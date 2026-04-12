import * as dotenv from "dotenv";

dotenv.config();

// Configuration taken from OpenClaw (minimax provider logic)
// Global endpoint: https://api.minimax.io/v1
// CN endpoint: https://api.minimaxi.com/v1
const MINIMAX_BASE_URL = "https://api.minimaxi.com/v1"; // Or api.minimax.io for global
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "YOUR_MINIMAX_API_KEY_HERE";
const MODEL_ID = "MiniMax-Text-01"; // E.g., MiniMax-Test-01 or abab6.5s. OpenClaw uses MiniMax-M2.5 or abab6.5-chat

async function minimaxMvpTest() {
    if (MINIMAX_API_KEY === "YOUR_MINIMAX_API_KEY_HERE") {
        console.error("❌ Please provide your MiniMax API Key in the script or in the .env file as MINIMAX_API_KEY.");
        process.exit(1);
    }

    console.log("🚀 Starting MiniMax MVP Test...");
    console.log(`📡 Endpoint: ${MINIMAX_BASE_URL}/chat/completions`);
    console.log(`🤖 Model: ${MODEL_ID}\n`);

    try {
        const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // MiniMax accepts standard Bearer token auth in OpenAI format
                "Authorization": `Bearer ${MINIMAX_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello! Can you briefly introduce yourself?" }
                ],
                max_tokens: 1024,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const data = await response.json() as any;
        console.log("✅ Received successful response:\n");
        console.log(data.choices?.[0]?.message?.content || data);

    } catch (error) {
        console.error("❌ Test failed:");
        console.error(error);
    }
}

minimaxMvpTest();
