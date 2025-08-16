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

        // Intent detection with fallback logic
        let finalIntent = intent;
        
        // Keyword-based fallback for low confidence
        if (confidence < 0.7) {
            const msgLower = msg.body.toLowerCase();
            
            // Greeting keywords
            if (msgLower.match(/\b(hello|hi|hey|namaste|good morning|good evening)\b/i)) {
                finalIntent = "greeting";
            }
            // Vegetable inquiry keywords
            else if (msgLower.match(/\b(available|price|milega|kitna|rate)\b/i) && 
                     msgLower.match(/\b(tomato|onion|potato|vegetable|sabzi)\b/i)) {
                finalIntent = "vegetable_inquiry";
            }
            // Order keywords
            else if (msgLower.match(/\b(order|book|mangwana|chahiye)\b/i) && 
                     msgLower.match(/\b(kg|kilo|grams)\b/i)) {
                finalIntent = "place_order";
            }
            // Track keywords
            else if (msgLower.match(/\b(track|status|kaha|delivery)\b/i)) {
                finalIntent = "track_delivery";
            }
            // Help keywords
            else if (msgLower.match(/\b(help|menu|options|kya kar sakte)\b/i)) {
                finalIntent = "help";
            }
            // If still low confidence, ask for clarification
            else if (confidence < 0.5) {
                const clarificationMsg = "🤔 मुझे आपका message पूरी तरह समझ नहीं आया। क्या आप थोड़ा और clear में बता सकते हैं?\n\nExample:\n• 'Tomato available hai?'\n• '2 kg onion order करना है'\n• 'Help' या 'Menu'";
                return client.sendMessage(msg.from, clarificationMsg);
            }
        }
        
        console.log(`👉 Final Intent: ${finalIntent} (Original: ${intent}, Confidence: ${confidence})`);

        const reply = await handleIntent(finalIntent, entities, msg);
        
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
