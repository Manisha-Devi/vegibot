const axios = require("axios");

async function callN8n(intent, entities) {
    try {
        const resp = await axios.post(process.env.N8N_WEBHOOK, {
            intent,
            entities,
        });
        return resp.data.reply || "✅ Data sent to automation.";
    } catch (err) {
        console.error("❌ n8n Error:", err.message);
        return "⚠️ Could not complete automation.";
    }
}

module.exports = callN8n;
