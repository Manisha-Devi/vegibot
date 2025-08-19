
const axios = require("axios");

async function callN8n(intent, data) {
    try {
        const payload = {
            intent: intent,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        console.log("📤 Sending to n8n:", JSON.stringify(payload, null, 2));
        
        const resp = await axios.post(process.env.N8N_WEBHOOK, payload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'VegiBot-WhatsApp'
            },
            timeout: 10000 // 10 second timeout
        });
        
        console.log("📥 n8n Response:", resp.data);
        return resp.data.reply || "✅ Data successfully stored.";
        
    } catch (err) {
        console.error("❌ n8n Error:", err.message);
        if (err.response) {
            console.error("❌ n8n Response Error:", err.response.data);
        }
        return "⚠️ Could not complete data storage.";
    }
}

module.exports = callN8n;
