const axios = require("axios");

async function witAiMessage(msg) {
    try {
        const resp = await axios.get(
            `https://api.wit.ai/message?v=20240801&q=${encodeURIComponent(msg)}`,
            { headers: { Authorization: `Bearer ${process.env.WIT_AI_TOKEN}` } }
        );
        return resp.data;
    } catch (err) {
        console.error("❌ Wit.ai Error:", err.message);
        return null;
    }
}

module.exports = witAiMessage;
