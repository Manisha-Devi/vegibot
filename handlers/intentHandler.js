// handlers/intentHandler.js
// const callN8n = require("../services/n8nService"); // Temporarily disabled

// Intent Examples for better understanding:
/*
INTENT TRIGGER EXAMPLES:
- greeting: "hello", "hi", "namaste", "hey", "good morning"
- vegetable_inquiry: "tomato available hai?", "onion price?", "potato milega?"
- place_order: "2 kg onion order karna hai", "tomato book kardo", "vegetables mangwana hai"
- track_delivery: "order track karna hai", "delivery status", "mera order kaha hai"
- change_cancel_order: "order cancel karna hai", "order change karna hai"
- register_customer: "account banana hai", "registration karna hai", "sign up"
- faq/help/menu: "help", "menu", "kya kar sakte ho", "options"
- thanks: "thank you", "thanks", "dhanyawad"
- goodbye: "bye", "goodbye", "alvida"
- small_talk: casual conversations, jokes
*/

async function handleIntent(intent, entities, msg = null) {
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
        case "help":
        case "menu":
            return `🤖 Main आपकी कैसे help कर सकता हूँ:\n\n🥬 Vegetables की inquiry\n📦 Order place करना\n🚚 Delivery tracking\n❌ Order cancel/change\n📝 New registration\n💰 Price check\n📍 Delivery areas\n\nExample:\n"Tomato available hai?"\n"2 kg onion order करना है"\n"Order track करना है"\n\nKoi bhi question पूछ सकते हैं! 😊`;

        case "small_talk":
            const funReplies = [
                "Haha 😄 nice one! Vegetables के बारे में भी कुछ पूछिए!",
                "😂 Good one! Fresh vegetables चाहिए तो बताइए!",
                "😅 Aap toh badiya mazak karte ho! Order भी कर दीजिए कोई!",
                "🤣 Hahaha, mast tha! Vegetables की list देखेंगे?"
            ];
            return funReplies[Math.floor(Math.random() * funReplies.length)];

        case "vegetable_inquiry":
            let veg = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const vegInquiryReplies = [
                `🥦 ${veg} ki availability check kar रहा हूँ... Available hai fresh quality में! Kitna chahiye?`,
                `✅ हाँ भाई, ${veg} available है! Best quality guarantee के साथ. Quantity बताइए?`,
                `🌿 ${veg} bilkul fresh मिल जाएगा! Price भी reasonable है. Kitne kg चाहिए?`,
                `👍 ${veg} stock में है sir! Farm se direct aaya hai. Order कर दें?`
            ];
            return vegInquiryReplies[Math.floor(Math.random() * vegInquiryReplies.length)];

        case "place_order":
            let qty = entities["quantity:quantity"]?.[0]?.body || "1 kg";
            let item = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const orderReplies = [
                `✅ Perfect! ${qty} ${item} का order confirm हो गया! 📝\n\nDelivery time: 2-3 hours\nPayment: Cash on delivery\n\nOrder ID: ORD${Math.floor(Math.random() * 10000)}`,
                `🎉 Great choice! ${qty} ${item} book कर दिया!\n\n✓ Fresh quality guarantee\n✓ Same day delivery\n✓ Best price\n\nThank you for ordering! 🙏`,
                `👌 Done! ${qty} ${item} का order successful!\n\nआपका order जल्दी ही deliver हो जाएगा.\nKoi special instructions हों तो बता दीजिए.`,
            ];
            return orderReplies[Math.floor(Math.random() * orderReplies.length)];

        case "track_delivery":
            let orderId = entities["order_id:order_id"]?.[0]?.body || "your order";
            const trackingReplies = [
                `📦 ${orderId} tracking:\n\n✅ Order confirmed\n🚚 Out for delivery\n⏰ Expected: 30-45 minutes\n\nDelivery boy contact: 9876543210`,
                `🔍 Checking ${orderId}...\n\n📍 Status: On the way\n🕐 ETA: 1 hour\n👨‍🚚 Delivery partner: Rahul\n\nTrack live location: [Link]`,
            ];
            return trackingReplies[Math.floor(Math.random() * trackingReplies.length)];

        case "change_cancel_order":
            const cancelReplies = [
                "🔄 Order change/cancel करने के लिए:\n\n1. अपना Order ID भेजें\n2. क्या change करना है बताएं\n\nNote: Delivery से पहले ही cancel/change हो सकता है.",
                "❌ Cancel करना चाहते हैं? No problem!\n\nOrder ID share करें, मैं तुरंत cancel कर दूंगा.\n\n⚠️ यदि order dispatch हो गया तो cancel नहीं होगा."
            ];
            return cancelReplies[Math.floor(Math.random() * cancelReplies.length)];

        case "register_customer":
            // Temporarily handle registration without n8n
            const registrationReplies = [
                "📝 Registration के लिए:\n\n1. आपका नाम\n2. Mobile number\n3. Complete address\n4. Area/locality\n\nYe details share करें, main account बना दूंगा! 😊",
                "🆕 नया account बनाना है? Great!\n\nBas ये details चाहिए:\n✓ Full name\n✓ Phone number\n✓ Delivery address\n✓ Pin code\n\nSend कर दीजिए! 👍"
            ];
            return registrationReplies[Math.floor(Math.random() * registrationReplies.length)];

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
                "🤔 Sorry, मुझे समझ नहीं आया। आप ये try कर सकते हैं:\n\n• 'Menu' या 'Help' type करें\n• 'Tomato available hai?' जैसे पूछें\n• 'Order करना है' लिखें\n\nMain आपकी मदद करने के लिए हूँ! 😊",
                "😅 Hmm, ये समझ नहीं आया। Examples:\n\n🥬 'Onion ka price?'\n📦 'Order place करना है'\n🚚 'Delivery track करें'\n📝 'Register करना hai'\n\nKoi bhi सवाल पूछ सकते हैं!",
                "🙏 Maaf करिए, clear नहीं था। आप ये try करें:\n\n✓ Vegetable names पूछें\n✓ Order related queries\n✓ Delivery information\n✓ Price check\n\n'Help' type करें complete menu के लिए!"
            ];
            return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
}

module.exports = handleIntent;
