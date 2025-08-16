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
                "Hello 👋 How can I help you today? Aapki kaise madad kar sakta hu?",
                "Hi there! 😊 Welcome to VegiBot! Mai aapki vegetable shopping me help karunga.",
                "Hey 🙌 Great to meet you! Bataiye what vegetables do you need?",
                "Hi 👋 I'm here to assist you! Vegetables ki inquiry kar sakte hai.",
                "Namaste 🙏 How are you doing? Mai fresh vegetables provide karta hu.",
                "Hello 🌸 Hope you're having a good day! Kaise help kar sakta hu?",
                "Hey 😄 What's up? Tell me what vegetables you're looking for!",
                "Hi 👋 Ready to help! Batao kis cheez me support chahiye?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];

        case "faq":
        case "help":
        case "menu":
            return `🤖 How can I help you? Mai aapki kaise madad kar sakta hu:\n\n🥬 Check vegetable availability & prices\n📦 Place your order easily\n🚚 Track your delivery status\n❌ Cancel or modify orders\n📝 Register as new customer\n💰 Get price information\n📍 Check delivery areas\n\nExamples:\n"Is tomato available?" / "Tomato milega?"\n"I want 2 kg onions" / "2 kg onion chahiye"\n"Track my order" / "Order track karo"\n\nFeel free to ask anything! Koi bhi sawal puch sakte hai! 😊`;

        case "small_talk":
            const funReplies = [
                "Haha 😄 That's funny! But kya aapko vegetables bhi chahiye?",
                "😂 Good one! Need any fresh vegetables today? Kuch fresh sabzi mangwani hai?",
                "😅 You're quite the joker! How about placing an order? Order kar dete hai koi?",
                "🤣 Hahaha, nice! Want to check our vegetable list? Vegetables ki list dekhenge?"
            ];
            return funReplies[Math.floor(Math.random() * funReplies.length)];

        case "vegetable_inquiry":
            let veg = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const vegInquiryReplies = [
                `🥦 Yes! ${veg} is available fresh! ${veg} bilkul fresh hai. How much do you need? Kitna chahiye?`,
                `✅ Absolutely! ${veg} is in stock with best quality guarantee. Quantity batao kitni chahiye?`,
                `🌿 ${veg} is perfectly fresh and reasonably priced! Price bhi accha hai. How many kg? Kitne kg chahiye?`,
                `👍 ${veg} is available sir! Direct from farm se aaya hai. Shall I place your order? Order kar du?`
            ];
            return vegInquiryReplies[Math.floor(Math.random() * vegInquiryReplies.length)];

        case "place_order":
            let qty = entities["quantity:quantity"]?.[0]?.body || "1 kg";
            let item = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const orderReplies = [
                `✅ Perfect! Your order for ${qty} ${item} is confirmed! Aapka order confirm ho gaya! 📝\n\nDelivery time: 2-3 hours\nPayment: Cash on delivery\n\nOrder ID: ORD${Math.floor(Math.random() * 10000)}`,
                `🎉 Great choice! ${qty} ${item} successfully booked! Order book ho gaya!\n\n✓ Fresh quality guarantee\n✓ Same day delivery\n✓ Best price guaranteed\n\nThank you for ordering! Order ke liye dhanyawad! 🙏`,
                `👌 Done! ${qty} ${item} order is successful! Order successful hai!\n\nYour order will be delivered soon. Jaldi deliver ho jayega.\nAny special instructions? Koi special instructions hai?`,
            ];
            return orderReplies[Math.floor(Math.random() * orderReplies.length)];

        case "track_delivery":
            let orderId = entities["order_id:order_id"]?.[0]?.body || "your order";
            const trackingReplies = [
                `📦 Tracking ${orderId}:\n\n✅ Order confirmed / Order confirm hai\n🚚 Out for delivery / Delivery ke liye nikla hai\n⏰ Expected: 30-45 minutes\n\nDelivery boy contact: 9876543210`,
                `🔍 Checking ${orderId} status...\n\n📍 Status: On the way / Raaste me hai\n🕐 ETA: 1 hour / 1 ghante me pahunchega\n👨‍🚚 Delivery partner: Rahul\n\nTrack live location: [Link]`,
            ];
            return trackingReplies[Math.floor(Math.random() * trackingReplies.length)];

        case "change_cancel_order":
            const cancelReplies = [
                "🔄 To change/cancel your order:\n\n1. Send your Order ID / Apna Order ID bhejo\n2. Tell me what to change / Kya change karna hai batao\n\nNote: Only possible before delivery starts / Delivery shuru hone se pehle hi possible hai.",
                "❌ Want to cancel? No problem! Cancel karna chahte ho?\n\nShare Order ID, I'll cancel immediately / Order ID share karo, turant cancel kar dunga.\n\n⚠️ If order is dispatched, cancellation not possible / Agar order dispatch ho gaya to cancel nahi hoga."
            ];
            return cancelReplies[Math.floor(Math.random() * cancelReplies.length)];

        case "register_customer":
            // Temporarily handle registration without n8n
            const registrationReplies = [
                "📝 For registration, I need these details:\n\n1. Your name / Aapka naam\n2. Mobile number\n3. Complete address / Pura address\n4. Area/locality / Area ya locality\n\nShare these details, I'll create your account! Details share karo, account bana dunga! 😊",
                "🆕 Want to create new account? Great! Naya account banana hai?\n\nJust need these details / Bas ye details chahiye:\n✓ Full name\n✓ Phone number\n✓ Delivery address\n✓ Pin code\n\nPlease send them! Bhej dijiye! 👍"
            ];
            return registrationReplies[Math.floor(Math.random() * registrationReplies.length)];

        case "thanks":
            const thanksReplies = [
                "You're welcome! Aapka swagat hai! 🙏",
                "Always happy to help! Hamesha madad ke liye ready hu! 😊",
                "No problem! Koi baat nahi! 👍 Glad I could help!",
                "My pleasure! Khushi hui madad karke! 🌸",
            ];
            return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];

        case "goodbye":
            const goodbyeReplies = [
                "Goodbye! Have a great day! Acha din ho! 👋",
                "See you soon! Jaldi milenge! 😊",
                "Bye! Take care! Khayal rakhiye! 👋",
                "See you later! Phir milte hain! 🙌",
            ];
            return goodbyeReplies[Math.floor(Math.random() * goodbyeReplies.length)];

        default:
            const defaultReplies = [
                "🤔 Sorry, I didn't understand that. Mujhe samajh nahi aaya. You can try:\n\n• Type 'Menu' or 'Help'\n• Ask 'Is tomato available?' / 'Tomato available hai?'\n• Say 'I want to order' / 'Order karna hai'\n\nI'm here to help! Madad ke liye yaha hu! 😊",
                "😅 Hmm, that wasn't clear. Ye clear nahi tha. Examples:\n\n🥬 'What's the onion price?' / 'Onion ka price?'\n📦 'Want to place order' / 'Order place karna hai'\n🚚 'Track delivery' / 'Delivery track karo'\n📝 'Want to register' / 'Register karna hai'\n\nFeel free to ask anything! Koi bhi sawal pucho!",
                "🙏 Sorry, that wasn't clear. Maaf karo, clear nahi tha. You can try:\n\n✓ Ask about vegetable names\n✓ Order related questions\n✓ Delivery information\n✓ Price checking\n\nType 'Help' for complete menu! Complete menu ke liye 'Help' type karo!"
            ];
            return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
}

module.exports = handleIntent;
