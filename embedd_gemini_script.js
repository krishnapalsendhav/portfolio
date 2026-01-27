/**
 * OPTIMIZED GEMINI EMBEDDING SCRIPT - Personal Portfolio
 * 
 * Features:
 * - Semantic chunking for personal data
 * - Batch API processing (up to 2048 chunks at once)
 * - Retry logic with exponential backoff
 * - Rich metadata with section labels
 * - Progress tracking
 * - 768-dimensional embeddings (optimal storage/quality)
 * 
 * 
 * Usage:
 * npm install
 * export GEMINI_API_KEY=your_api_key
 * node embedd_gemini_script.js
 */

import fs from "fs";
import fetch from "node-fetch";

// ================ CONFIG ================
const INPUT_FILE = "/public/Krishnapal-Sendhav-info.txt";
const OUTPUT_FILE = "/netlify/functions/data/krishnapal_embeddings.json";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Optimized for personal portfolio data
const CHUNK_SIZE = 400;
const MIN_CHUNK_SIZE = 80;
const BATCH_SIZE = 100; // Max chunks per batch request
const OUTPUT_DIMENSIONALITY = 768; // 768, 1536, or 3072

// Retry config
const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds
// =========================================

// ================ SEMANTIC CHUNKING ================
function semanticChunk(text) {
    const chunks = [];

    // Split by section headers (ALL CAPS)
    const sections = text.split(/\n\n(?=[A-Z][A-Z &]+\n)/);

    for (const section of sections) {
        const trimmed = section.trim();
        if (!trimmed || trimmed.length < MIN_CHUNK_SIZE) continue;

        const lines = trimmed.split('\n');
        const header = lines[0]?.trim() || "";
        const content = lines.slice(1).join('\n').trim();

        const isSectionHeader = header.length > 0 &&
            header === header.toUpperCase() &&
            header.length < 50;

        // Keep section whole if reasonably sized
        if (trimmed.length <= CHUNK_SIZE * 1.5) {
            chunks.push({
                text: trimmed,
                section: isSectionHeader ? header : "OVERVIEW",
                type: "section",
            });
        } else {
            // Split by paragraphs
            const paragraphs = content.split('\n\n');
            let current = isSectionHeader ? `${header}\n\n` : "";

            for (const para of paragraphs) {
                const cleaned = para.trim();
                if (!cleaned) continue;

                const test = current ? `${current}\n\n${cleaned}` : cleaned;

                if (test.length > CHUNK_SIZE && current) {
                    chunks.push({
                        text: current.trim(),
                        section: isSectionHeader ? header : "OVERVIEW",
                        type: "subsection",
                    });
                    current = cleaned;
                } else {
                    current = test;
                }
            }

            if (current && current.length >= MIN_CHUNK_SIZE) {
                chunks.push({
                    text: current.trim(),
                    section: isSectionHeader ? header : "OVERVIEW",
                    type: "subsection",
                });
            }
        }
    }

    return chunks;
}

// ================ BATCH EMBEDDING ================
async function batchEmbedTexts(texts, retries = 0) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${GEMINI_API_KEY}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requests: texts.map((text) => ({
                    model: "models/gemini-embedding-001",
                    content: { parts: [{ text }] },
                    taskType: "RETRIEVAL_DOCUMENT", // Optimized for RAG
                    outputDimensionality: OUTPUT_DIMENSIONALITY,
                })),
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();

            // Handle rate limiting with exponential backoff
            if (res.status === 429 && retries < MAX_RETRIES) {
                const delay = BASE_DELAY * Math.pow(2, retries);
                console.log(`⚠️  Rate limited. Retrying in ${delay / 1000}s (attempt ${retries + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return batchEmbedTexts(texts, retries + 1);
            }

            throw new Error(`Embedding failed (${res.status}): ${errorText}`);
        }

        const data = await res.json();
        return data.embeddings.map((emb) => emb.values);
    } catch (error) {
        if (retries < MAX_RETRIES && error.message.includes("ECONNRESET")) {
            const delay = BASE_DELAY * Math.pow(2, retries);
            console.log(`🔄 Connection error. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return batchEmbedTexts(texts, retries + 1);
        }
        throw error;
    }
}

// ================ PROGRESS BAR ================
function showProgress(current, total, startTime) {
    const percent = ((current / total) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (current / elapsed).toFixed(1);
    const eta = ((total - current) / rate).toFixed(0);

    const barLength = 30;
    const filled = Math.round((current / total) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    process.stdout.write(
        `\r[${bar}] ${percent}% | ${current}/${total} chunks | ${rate}/s | ETA: ${eta}s  `
    );

    if (current === total) {
        console.log(`\n✓ Completed in ${elapsed}s`);
    }
}

// ================ MAIN ================
async function run() {
    console.log("╔════════════════════════════════════════╗");
    console.log("║   GEMINI EMBEDDING GENERATION          ║");
    console.log("╚════════════════════════════════════════╝\n");

    // Validate API key
    if (!GEMINI_API_KEY) {
        throw new Error("❌ GEMINI_API_KEY environment variable not set");
    }

    // Read input
    console.log(`📄 Reading: ${INPUT_FILE}`);
    const text = fs.readFileSync(INPUT_FILE, "utf-8").trim();
    console.log(`   Loaded ${text.length} characters\n`);

    // Semantic chunking
    console.log("✂️  Chunking text semantically...");
    const chunkData = semanticChunk(text);
    const texts = chunkData.map((c) => c.text);

    console.log(`   Created ${texts.length} chunks\n`);

    // Show chunk distribution
    const sectionCounts = {};
    chunkData.forEach((c) => {
        sectionCounts[c.section] = (sectionCounts[c.section] || 0) + 1;
    });

    console.log("📊 Section breakdown:");
    Object.entries(sectionCounts).forEach(([section, count]) => {
        console.log(`   • ${section}: ${count} chunk(s)`);
    });
    console.log();

    // Batch embedding with progress
    console.log(`🔄 Generating embeddings (batch size: ${BATCH_SIZE})...\n`);
    const startTime = Date.now();
    const allVectors = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const vectors = await batchEmbedTexts(batch);
        allVectors.push(...vectors);

        showProgress(Math.min(i + BATCH_SIZE, texts.length), texts.length, startTime);

        // Small delay between batches to avoid rate limits
        if (i + BATCH_SIZE < texts.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Build output with rich metadata
    const output = {
        metadata: {
            name: "Krishnapal Sendhav",
            role: "Senior Software Engineer",
            company: "ClassIO",
            location: "Indore, Madhya Pradesh, India",
            age: 23,
            totalChunks: texts.length,
            embeddingDimension: OUTPUT_DIMENSIONALITY,
            model: "gemini-embedding-001",
            generatedAt: new Date().toISOString(),
            contact: {
                github: "https://github.com/krishnapalsendhav",
                linkedin: "https://www.linkedin.com/in/krishnapal-sendhav/",
                email: "krishnapalsendhav591@gmail.com",
            },
        },
        chunks: chunkData.map((chunk, idx) => ({
            id: idx,
            text: chunk.text,
            vector: allVectors[idx],
            section: chunk.section,
            type: chunk.type,
            charCount: chunk.text.length,
            wordCount: chunk.text.split(/\s+/).length,
        })),
    };

    // Save output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║         EMBEDDING COMPLETE ✓           ║");
    console.log("╚════════════════════════════════════════╝\n");
    console.log(`📦 Output: ${OUTPUT_FILE}`);
    console.log(`   Size: ${fileSize} KB`);
    console.log(`   Chunks: ${texts.length}`);
    console.log(`   Dimension: ${OUTPUT_DIMENSIONALITY}`);
    console.log(`   Avg chunk size: ${Math.round(texts.reduce((sum, t) => sum + t.length, 0) / texts.length)} chars\n`);
}

run().catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
});
