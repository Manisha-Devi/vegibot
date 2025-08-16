const axios = require("axios");

async function witAiMessage(msg, retries = 2) {
    // Validate input
    if (!msg || typeof msg !== 'string' || msg.trim().length === 0) {
        console.log("⚠️ Empty or invalid message received");
        return null;
    }

    // Check if WIT_AI_TOKEN exists
    if (!process.env.WIT_AI_TOKEN) {
        console.error("❌ WIT_AI_TOKEN not found in environment variables");
        return null;
    }

    try {
        // Clean and prepare message
        const cleanMsg = msg.trim().substring(0, 280); // Limit message length
        
        console.log(`🔄 Sending to Wit.ai: "${cleanMsg}"`);
        
        const resp = await axios.get(
            `https://api.wit.ai/message?v=20240801&q=${encodeURIComponent(cleanMsg)}`,
            { 
                headers: { 
                    Authorization: `Bearer ${process.env.WIT_AI_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        if (resp.data && resp.data.intents) {
            console.log("✅ Wit.ai response received successfully");
            return resp.data;
        } else {
            console.log("⚠️ Wit.ai returned empty or invalid response");
            return null;
        }

    } catch (err) {
        console.error("❌ Wit.ai Error:", err.message);
        
        // Retry logic for network issues
        if (retries > 0 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
            console.log(`🔄 Retrying Wit.ai request... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            return witAiMessage(msg, retries - 1);
        }
        
        // Log specific error types
        if (err.response) {
            console.error("❌ Wit.ai API Error:", err.response.status, err.response.data);
        } else if (err.request) {
            console.error("❌ Network Error - No response from Wit.ai");
        }
        
        return null;
    }
}

module.exports = witAiMessage;
