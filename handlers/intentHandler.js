// handlers/intentHandler.js
const callN8n = require("../services/n8nService");

async function handleIntent(intent, entities) {
    switch (intent) {
        case "greeting":
            // Multiple friendly greetings (Hindi + English mix for human-like touch)
            const greetings = [
                "Hello 👋 Kaise help karu aapki?",
                "Hi there! 😊 Aaj mai aapki kaise madad kar sakta hoon?",
                "Hey 🙌 Welcome! Bataiye kis cheez me help chahiye?",
                "Hi 👋 mai yaha hoon aapki madad ke liye, bataiye?",
                "Namaste 🙏 mai aapke liye kya kar sakta hoon?",
                "Hello 🌸 Hope aapka din acha ho! Kaise help karu?",
                "Heyy 😄 kya haal hai? Bataiye kaise assist karu?",
                "Hi 👋 mujhe bataye kis cheez me support chahiye?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];

        case "faq":
            return "You can ask about registration, vegetables, delivery, or placing orders.";

        case "small_talk":
            const funReplies = [
                "Haha 😄 nice one!",
                "😂 Good one!",
                "😅 Aap toh badiya mazak karte ho!",
                "🤣 Hahaha, mast tha!"
            ];
            return funReplies[Math.floor(Math.random() * funReplies.length)];

        case "vegetable_inquiry":
            let veg = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            return `Let me check availability for ${veg} 🥦...`;

        case "place_order":
            let qty = entities["quantity:quantity"]?.[0]?.body || "some";
            let item = entities["vegetable_name:vegetable_name"]?.[0]?.body || "items";
            const orderReplies = [
                `✅ Order placed: ${qty} ${item}. Jaldi hi confirm karenge!`,
                `Great choice! 🎉 ${qty} ${item} ka order book ho gaya hai.`,
                `👌 Done! ${qty} ${item} order kar diya hai. Confirmation aayega soon.`,
            ];
            return orderReplies[Math.floor(Math.random() * orderReplies.length)];

        case "track_delivery":
            let orderId = entities["order_id:order_id"]?.[0]?.body || "your order";
            return `📦 Tracking ${orderId}... Please wait a moment.`;

        case "change_cancel_order":
            return "Okay, please provide your Order ID to change/cancel.";

        case "register_customer":
            return await callN8n(intent, entities);

        case "thanks":
            const thanksReplies = [
                "You're welcome! 🙏",
                "Always happy to help 😊",
                "No problem 👍 Glad I could help!",
                "Aapka swagat hai 🌸",
            ];
            return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];

        case "goodbye":
            const goodbyeReplies = [
                "Goodbye 👋 Have a great day!",
                "See you soon! 😊",
                "Bye 👋 Khayal rakhiye!",
                "Phir milte hain 🙌",
            ];
            return goodbyeReplies[Math.floor(Math.random() * goodbyeReplies.length)];

        default:
            const defaultReplies = [
                "Sorry, mujhe samajh nahi aaya 🤔 Kya aap dobara bata sakte ho?",
                "Hmm 😅 ye mujhe samajh nahi aaya. Thoda clear karoge?",
                "Maf kijiye, mujhe ye query samajh nahi aayi. Kya aap dobara likhoge?",
                "Oops 🤔 lagta hai mujhe samajh nahi aaya. Kya aap thoda aur explain karenge?"
            ];
            return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
}

module.exports = handleIntent;
