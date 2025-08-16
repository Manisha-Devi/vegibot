require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const witAiMessage = require("./config/wit");
const handleIntent = require("./handlers/intentHandler");

const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on("qr", (qr) => {
    console.log("📱 QR Code scan करें WhatsApp में:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ WhatsApp Bot Successfully Connected!");
    console.log("🤖 Bot अब messages का इंतज़ार कर रहा है...");
});

client.on("authenticated", () => {
    console.log("🔐 WhatsApp authentication successful!");
});

client.on("auth_failure", () => {
    console.log("❌ WhatsApp authentication failed!");
});

client.on("disconnected", (reason) => {
    console.log("📱 WhatsApp disconnected:", reason);
});

client.on("message", async (msg) => {
    // Ignore group messages and messages from status
    if (msg.from.includes('@g.us') || msg.from.includes('status@broadcast')) {
        return;
    }

    // Ignore messages from bot itself
    if (msg.fromMe) return;

    console.log(`📩 User (${msg.from}): ${msg.body}`);

    try {
        // Show typing indicator for better UX
        await msg.getChat().then(chat => chat.sendStateTyping());

        const witData = await witAiMessage(msg.body);
        
        if (!witData) {
            const errorMsg = "🤔 Sorry, मुझे समझने में दिक्कत हो रही है। कृपया थोड़ी देर बाद try करें।";
            return client.sendMessage(msg.from, errorMsg);
        }

        const intent = witData.intents?.[0]?.name || "unknown";
        const entities = witData.entities || {};
        const confidence = witData.intents?.[0]?.confidence || 0;

        console.log("👉 Intent:", intent, "Confidence:", confidence);
        console.log("👉 Entities:", entities);

        // If confidence is too low, ask for clarification
        if (confidence < 0.5 && intent !== "unknown") {
            const clarificationMsg = "🤔 मुझे आपका message पूरी तरह समझ नहीं आया। क्या आप थोड़ा और clear में बता सकते हैं?";
            return client.sendMessage(msg.from, clarificationMsg);
        }

        const reply = await handleIntent(intent, entities, msg);
        
        // Clear typing and send reply
        await msg.getChat().then(chat => chat.clearState());
        await client.sendMessage(msg.from, reply);
        
        console.log(`🤖 Bot Reply: ${reply}`);

    } catch (error) {
        console.error("❌ Error processing message:", error);
        const errorReply = "😅 Sorry, कुछ technical issue हो गई है। Please try again!";
        client.sendMessage(msg.from, errorReply);
    }
});

// Handle process termination gracefully
process.on('SIGINT', async () => {
    console.log('🛑 Bot को safely shutdown कर रहे हैं...');
    await client.destroy();
    process.exit(0);
});

client.initialize();
