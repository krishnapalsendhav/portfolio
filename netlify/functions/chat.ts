import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

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
}

interface ChatResponse {
    success: boolean;
    response?: string;
    error?: string;
}

interface ScoredChunk {
    chunk: EmbeddingChunk;
    score: number;
}

// =============================================================================
// Embeddings Loading (Cold Start)
// =============================================================================

let embeddingsData: EmbeddingsData | null = null;

function loadEmbeddings(): EmbeddingsData {
    if (embeddingsData) {
        return embeddingsData;
    }

    const embeddingsPath = path.join(
        __dirname,
        "data",
        "krishnapal_embeddings.json"
    );

    try {
        const fileContent = fs.readFileSync(embeddingsPath, "utf-8");
        embeddingsData = JSON.parse(fileContent) as EmbeddingsData;
        console.log(
            `Loaded ${embeddingsData.chunks.length} embedding chunks (${embeddingsData.metadata.embeddingDimension} dimensions)`
        );
        return embeddingsData;
    } catch (error) {
        console.error("Failed to load embeddings:", error);
        throw new Error("Failed to load embeddings data");
    }
}

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
const EMBEDDING_MODEL = "gemini-embedding-001";
const GENERATION_MODEL = "gemini-2.5-flash";

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
                outputDimensionality: 768, // Match stored embedding dimensions
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
    contextChunks: ScoredChunk[]
): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Build context from retrieved chunks
    const context = contextChunks
        .map(
            (sc, i) =>
                `[Context ${i + 1} - ${sc.chunk.section}]:\n${sc.chunk.text}`
        )
        .join("\n\n");

    // Construct strict RAG prompt
    const systemPrompt = `You are a portfolio assistant for Krishnapal Sendhav, a Senior Software Engineer.

STRICT RULES:
1. You must ONLY answer questions using the provided context below.
2. Do NOT use any external knowledge or make assumptions.
3. If the answer is not present in the context, respond EXACTLY with: "I don't have that information."
4. Be conversational, helpful, and professional.
5. Keep responses concise but informative.
6. When discussing skills, experience, or projects, reference specific details from the context.

CONTEXT:
${context}

USER QUESTION: ${query}

Remember: Only use information from the context above. If the question cannot be answered from the context, say "I don't have that information."`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: systemPrompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 512,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE",
                    },
                ],
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Generation API error:", errorText);
        throw new Error(`Generation API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract text from response
    if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
    ) {
        return data.candidates[0].content.parts[0].text;
    }

    throw new Error("Unexpected response format from Gemini API");
}

// =============================================================================
// Main Handler
// =============================================================================

const handler: Handler = async (
    event: HandlerEvent,
    _context: HandlerContext
) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    // Handle preflight requests
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    }

    // Only allow POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: "Method not allowed. Use POST.",
            } as ChatResponse),
        };
    }

    try {
        // Parse request body
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Request body is required",
                } as ChatResponse),
            };
        }

        const requestBody: ChatRequest = JSON.parse(event.body);
        const { query } = requestBody;

        // Validate query
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Query is required and must be a non-empty string",
                } as ChatResponse),
            };
        }

        // Limit query length
        if (query.length > 500) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Query is too long. Maximum 500 characters.",
                } as ChatResponse),
            };
        }

        // Load embeddings (cached after cold start)
        const embeddings = loadEmbeddings();

        // Embed the query
        const queryVector = await embedQuery(query.trim());

        // Find top-4 relevant chunks
        const topChunks = findTopKChunks(queryVector, embeddings.chunks, 4);

        // Generate response
        const response = await generateResponse(query.trim(), topChunks);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                response,
            } as ChatResponse),
        };
    } catch (error) {
        console.error("Chat function error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: errorMessage,
            } as ChatResponse),
        };
    }
};

export { handler };
