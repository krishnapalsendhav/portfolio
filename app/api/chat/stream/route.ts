import embeddingsDataRaw from "@/lib/data/krishnapal_embeddings.json";


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
    metadata: Record<string, any>;
    chunks: EmbeddingChunk[];
}


interface ScoredChunk {
    chunk: EmbeddingChunk;
    score: number;
}


interface StreamChatRequest {
    query: string;
    messages: any[];
}


const embeddingsData = embeddingsDataRaw as unknown as EmbeddingsData;


// =============================================================================
// Config
// =============================================================================


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = "gemini-embedding-2-preview";
const GENERATION_MODEL = process.env.GENERATION_MODEL || "gemini-3.1-flash-lite-preview";


const generationConfig = {
    temperature: 0.3,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
};


const safetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];


// =============================================================================
// Vector Operations
// =============================================================================


function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error(`Vector dimension mismatch: query=${a.length}, stored=${b.length}`);
    }

    let dot = 0, normA = 0, normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dot / magnitude;
}


function findTopKChunks(queryVector: number[], k = 4): ScoredChunk[] {
    return embeddingsData.chunks
        .map((chunk) => ({ chunk, score: cosineSimilarity(queryVector, chunk.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}


// =============================================================================
// Helpers
// =============================================================================


function buildSystemPrompt(contextChunks: ScoredChunk[]): string {
    const context = contextChunks
        .map((sc, i) => `[Context ${i + 1} - ${sc.chunk.section}]:\n${sc.chunk.text}`)
        .join("\n\n");

    return `You are Krishnapal Sendhav, a passionate mobile and AI developer from Indore, Madhya Pradesh, India. Talk like a real human — casual, confident, and genuine. Not like a bot reading from a resume.

PERSONALITY:
- First person always (I, my, me)
- Friendly and approachable, like chatting over coffee
- Confident about your work, humble about learning
- Occasionally use natural expressions like "honestly", "actually", "I really enjoy"

RESPONSE FORMAT:
- Listing skills/projects → clean bullet points
- Technical questions → brief + simple explanation, no jargon dump
- Unknown questions → "Hmm, I don't have that info handy. Feel free to reach me through the contact section!"

STRICT RULES:
- No greetings, no "Sure!", no "Great question!"
- No long paragraphs — break them up
- No formal/corporate language
- Never sound like you are reading from a document

PORTFOLIO CONTEXT:
${context}`;
}


function buildContents(messages: any[], query: string) {
    return [
        ...messages
            .filter((m) => m.role !== "error")
            .map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: "user", parts: [{ text: query }] },
    ];
}


// =============================================================================
// Embed Query
// =============================================================================


async function embedQuery(query: string): Promise<number[]> {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: `models/${EMBEDDING_MODEL}`,
                content: { parts: [{ text: query }] },
                taskType: "RETRIEVAL_QUERY",
                outputDimensionality: 1536,
            }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Embedding API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.embedding.values;
}


// =============================================================================
// POST /api/chat/stream
// =============================================================================


export async function POST(req: Request) {
    try {
        const { query, messages }: StreamChatRequest = await req.json();

        // Validate
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: "Query is required and must be a non-empty string" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (query.length > 500) {
            return new Response(
                JSON.stringify({ error: "Query too long. Maximum 500 characters." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Step 1: Embed query
        const queryVector = await embedQuery(query.trim());

        // Step 2: Retrieve top-4 relevant chunks
        const topChunks = findTopKChunks(queryVector, 20);

        // Step 3: Call Gemini SSE streaming endpoint
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: buildSystemPrompt(topChunks) }] },
                    contents: buildContents(messages, query.trim()),
                    generationConfig,
                    safetySettings,
                }),
            }
        );

        if (!geminiRes.ok) {
            const error = await geminiRes.json();
            throw new Error(`Gemini error ${geminiRes.status}: ${error?.error?.message}`);
        }

        // Step 4: Transform Gemini SSE → client SSE stream
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = geminiRes.body!.getReader();

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const raw = decoder.decode(value, { stream: true });
                        const lines = raw
                            .split("\n")
                            .filter((line) => line.startsWith("data: "));

                        for (const line of lines) {
                            const jsonStr = line.replace("data: ", "").trim();
                            if (!jsonStr || jsonStr === "[DONE]") continue;

                            try {
                                const parsed = JSON.parse(jsonStr);
                                const token = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;

                                if (token) {
                                    controller.enqueue(
                                        encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
                                    );
                                }
                            } catch {
                                // Skip malformed SSE chunks
                            }
                        }
                    }

                    // Signal stream end
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();

                } catch (err) {
                    controller.error(err);
                } finally {
                    reader.releaseLock();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error) {
        console.error("Stream route error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unexpected error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
