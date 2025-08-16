require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const witAiMessage = require("./config/wit");
const handleIntent = require("./handlers/intentHandler");

const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("✅ WhatsApp Bot Connected"));

client.on("message", async (msg) => {
    console.log(`📩 User: ${msg.body}`);

    const witData = await witAiMessage(msg.body);
    if (!witData) return client.sendMessage(msg.from, "⚠️ AI not responding");

    const intent = witData.intents?.[0]?.name || "unknown";
    const entities = witData.entities || {};

    console.log("👉 Intent:", intent);
    console.log("👉 Entities:", entities);

    const reply = await handleIntent(intent, entities);
    client.sendMessage(msg.from, reply);
});

client.initialize();
