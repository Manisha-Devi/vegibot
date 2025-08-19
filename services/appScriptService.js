
const axios = require("axios");

async function callAppScript(intent, data) {
    try {
        const payload = {
            intent: intent,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        console.log("📤 Sending to Google Apps Script:", JSON.stringify(payload, null, 2));
        
        const resp = await axios.post(process.env.APPS_SCRIPT_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'VegiBot-WhatsApp'
            },
            timeout: 15000 // 15 second timeout
        });
        
        console.log("📥 Apps Script Response:", resp.data);
        
        if (resp.data.success) {
            return "✅ Registration successfully stored in Google Sheets!";
        } else {
            return "⚠️ Could not store registration data.";
        }
        
    } catch (err) {
        console.error("❌ Apps Script Error:", err.message);
        if (err.response) {
            console.error("❌ Apps Script Response Error:", err.response.data);
        }
        return "⚠️ Could not complete data storage.";
    }
}

// Function to check if user already exists
async function checkUserExists(userId) {
    try {
        const url = `${process.env.APPS_SCRIPT_URL}?action=check_user&user_id=${encodeURIComponent(userId)}`;
        
        console.log("📤 Checking user exists:", userId);
        
        const resp = await axios.get(url, {
            timeout: 10000 // 10 second timeout
        });
        
        console.log("📥 User check response:", resp.data);
        
        if (resp.data.success) {
            return resp.data.user_exists ? resp.data.user_data : null;
        } else {
            return null;
        }
        
    } catch (err) {
        console.error("❌ User Check Error:", err.message);
        return null;
    }
}

module.exports = { callAppScript, checkUserExists };
