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
        // Clean and prepare message - normalize for better intent detection
        let cleanMsg = msg.trim().toLowerCase().substring(0, 280);
        
        // Common Hindi-English word mappings for better detection
        const wordMappings = {
            'kya': 'what',
            'hai': 'is',
            'chahiye': 'want',
            'karna': 'do',
            'banana': 'make',
            'milega': 'available',
            'price': 'price',
            'kitna': 'how much',
            'track': 'track',
            'cancel': 'cancel',
            'order': 'order',
            'delivery': 'delivery'
        };
        
        // Apply mappings but keep original structure
        Object.keys(wordMappings).forEach(hindi => {
            const regex = new RegExp(`\\b${hindi}\\b`, 'gi');
            cleanMsg = cleanMsg.replace(regex, `${hindi} ${wordMappings[hindi]}`);
        });
        
        console.log(`🔄 Wit.ai ko bhej rahe hain: "${cleanMsg}"`);
        
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
            console.log("✅ Wit.ai response successfully mil gaya");
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
