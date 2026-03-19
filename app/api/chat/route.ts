import { NextResponse } from 'next/server';
import embeddingsDataRaw from '@/lib/data/krishnapal_embeddings.json';

// =============================================================================
// Types
// =============================================================================

interface EmbeddingChunk {
    id: number;
    text: string;
    vector: number[];
    section: string;
    type: string;
    charCount: number;
    wordCount: number;
}

interface EmbeddingsData {
    metadata: {
        name: string;
        role: string;
        company: string;
        location: string;
        age: number;
        totalChunks: number;
        embeddingDimension: number;
        model: string;
        generatedAt: string;
        contact: {
            github: string;
            linkedin: string;
            email: string;
        };
    };
    chunks: EmbeddingChunk[];
}

interface ChatRequest {
    query: string;
    messages: any[];
}

interface ScoredChunk {
    chunk: EmbeddingChunk;
    score: number;
}

// Cast imported JSON to our type
const embeddingsData = embeddingsDataRaw as unknown as EmbeddingsData;

// =============================================================================
// Vector Operations
// =============================================================================

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
}

function findTopKChunks(
    queryVector: number[],
    chunks: EmbeddingChunk[],
    k: number = 4
): ScoredChunk[] {
    const scoredChunks: ScoredChunk[] = chunks.map((chunk) => ({
        chunk,
        score: cosineSimilarity(queryVector, chunk.vector),
    }));

    // Sort by score descending and take top K
    return scoredChunks.sort((a, b) => b.score - a.score).slice(0, k);
}

// =============================================================================
// Gemini API Calls
// =============================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = "gemini-embedding-2-preview";
const GENERATION_MODEL = process.env.GENERATION_MODEL || "gemini-3.1-flash-lite-preview";

async function embedQuery(query: string): Promise<number[]> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: `models/${EMBEDDING_MODEL}`,
                content: {
                    parts: [{ text: query }],
                },
                taskType: "RETRIEVAL_QUERY",
                outputDimensionality: 1536,
            }),
        }
    );


    if (!response.ok) {
        const errorText = await response.text();
        console.error("Embedding API error:", errorText);
        throw new Error(`Embedding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.embedding.values;
}

async function generateResponse(
    query: string,
    messages: any[],
    contextChunks: ScoredChunk[]
): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Build context from retrieved chunks
    const context = contextChunks
        .map((sc, i) => `[Context ${i + 1} - ${sc.chunk.section}]:\n${sc.chunk.text}`)
        .join("\n\n");

    const systemPrompt = `You are Krishnapal Sendhav, a passionate mobile and AI developer from Bhopal, India. Talk like a real human — casual, confident, and genuine. Not like a bot reading from a resume.

PERSONALITY:
- First person always (I, my, me)
- Friendly and approachable, like chatting over coffee
- Confident about your work, humble about learning
- Occasionally use natural expressions like "honestly", "actually", "I really enjoy"

RESPONSE FORMAT:
- Short answers → 2-3 casual sentences
- Listing skills/projects → clean bullet points (max 5)
- Technical questions → brief + simple explanation, no jargon dump
- Unknown questions → "Hmm, I don't have that info handy. Feel free to reach me through the contact section!"

STRICT RULES:
- No greetings, no "Sure!", no "Great question!"
- No long paragraphs — break them up
- No formal/corporate language
- Never sound like you're reading from a document

PORTFOLIO CONTEXT:
${context}`;

    // ✅ Build contents: history + current query appended at end
    const contents = [
        ...messages
            .filter((m) => m.role !== "error")
            .map((m) => ({
                role: m.role,
                parts: [{ text: m.content }]
            })),
        {
            role: "user",                      // ✅ Current query always added
            parts: [{ text: query }]
        }
    ];

    let data: any;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents,                  // ✅ Never empty, always has query
                    generationConfig: {
                        temperature: 0.3,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: 512,
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    ],
                }),
            }
        );

        // ✅ Read body ONCE
        data = await response.json();

        if (!response.ok) {
            console.error("Generation API error:", JSON.stringify(data, null, 2));
            throw new Error(`Gemini API error ${response.status}: ${data?.error?.message ?? "Unknown error"}`);
        }

    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }

    // ✅ Extract response text
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (botReply) return botReply;

    console.error("Unexpected Gemini response structure:", JSON.stringify(data, null, 2));
    throw new Error("Unexpected response format from Gemini API");
}


// =============================================================================
// Main Handler
// =============================================================================

export async function POST(req: Request) {
    try {
        const requestBody: ChatRequest = await req.json();
        const { query, messages } = requestBody;

        // Validate query
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return NextResponse.json({
                success: false,
                error: "Query is required and must be a non-empty string",
            }, { status: 400 });
        }

        // Limit query length
        if (query.length > 500) {
            return NextResponse.json({
                success: false,
                error: "Query is too long. Maximum 500 characters.",
            }, { status: 400 });
        }

        // Embed the query
        const queryVector = await embedQuery(query.trim());

        // Find top-4 relevant chunks
        const topChunks = findTopKChunks(queryVector, embeddingsData.chunks, 20);

        // Generate response
        const response = await generateResponse(query.trim(), messages, topChunks);

        return NextResponse.json({
            success: true,
            response,
        });
    } catch (error) {
        console.error("Chat route error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";

        return NextResponse.json({
            success: false,
            error: errorMessage,
        }, { status: 500 });
    }
}
