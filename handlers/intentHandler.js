
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
            // Multiple friendly greetings in Roman Hindi + English
            const greetings = [
                "Hello 👋 Welcome to VegiBot! Main aapki vegetable shopping me help karunga!",
                "Hi there! 😊 Namaste! Kaise help kar sakta hun aapki?",
                "Hey 🙌 Great to see you! Bataiye kya vegetables chahiye?",
                "Hello 👋 Main yahan hu aapki madad ke liye! Fresh vegetables available hain.",
                "Namaste 🙏 Kaise ho? Fresh sabziyan mangwani hain?",
                "Hi 😄 VegiBot ready hai! Koi bhi vegetable ke bare me puch sakte hain!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];

        case "faq":
        case "help":
        case "menu":
            return `🤖 VegiBot Menu - Main ye sab kar sakta hun:\n\n🥬 Vegetable availability & prices check karna\n📦 Easy order placement\n🚚 Delivery tracking\n❌ Order cancel ya modify karna\n📝 New customer registration\n💰 Price information\n📍 Delivery areas check karna\n\nExamples:\n"Tomato available hai?" \n"2 kg onion chahiye"\n"Order track karo"\n"Help" ya "Menu"\n\nKoi bhi sawal pucho! 😊`;

        case "small_talk":
            const funReplies = [
                "Haha 😄 Funny! Par kya vegetables bhi order karni hain?",
                "😂 Nice one! Fresh sabziyan bhi mangwao na!",
                "😅 Accha joke tha! Order placement ke liye ready ho?",
                "🤣 Good sense of humor! Vegetable list dekhna chahoge?"
            ];
            return funReplies[Math.floor(Math.random() * funReplies.length)];

        case "vegetable_inquiry":
            let veg = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const vegInquiryReplies = [
                `🥦 Yes! ${veg} bilkul fresh available hai! Kitna quantity chahiye?`,
                `✅ Haan ${veg} stock me hai, best quality guaranteed! Kitne kg?`,
                `🌿 ${veg} fresh hai aur reasonable price me! Order place karu?`,
                `👍 ${veg} available hai sir! Farm fresh quality! Quantity bataiye?`
            ];
            return vegInquiryReplies[Math.floor(Math.random() * vegInquiryReplies.length)];

        case "place_order":
            let qty = entities["quantity:quantity"]?.[0]?.body || "1 kg";
            let item = entities["vegetable_name:vegetable_name"]?.[0]?.body || "vegetables";
            const orderReplies = [
                `✅ Perfect! ${qty} ${item} ka order confirm ho gaya! 📝\n\nDelivery time: 2-3 hours\nPayment: Cash on delivery\n\nOrder ID: ORD${Math.floor(Math.random() * 10000)}\n\nDhanyawad! 🙏`,
                `🎉 Great! ${qty} ${item} successfully book ho gaya!\n\n✓ Fresh quality guarantee\n✓ Same day delivery\n✓ Best price\n\nOrder placed successfully! 👍`,
                `👌 Done! ${qty} ${item} order complete!\n\nJaldi deliver kar denge. Special instructions koi hai?`,
            ];
            return orderReplies[Math.floor(Math.random() * orderReplies.length)];

        case "track_delivery":
            let orderId = entities["order_id:order_id"]?.[0]?.body || "your order";
            const trackingReplies = [
                `📦 ${orderId} ka status:\n\n✅ Order confirmed\n🚚 Out for delivery\n⏰ Expected: 30-45 minutes\n\nDelivery boy contact: 9876543210`,
                `🔍 ${orderId} checking...\n\n📍 Status: On the way\n🕐 ETA: 1 hour\n👨‍🚚 Delivery partner: Rahul\n\nTrack kar sakte hain live!`,
            ];
            return trackingReplies[Math.floor(Math.random() * trackingReplies.length)];

        case "change_cancel_order":
            const cancelReplies = [
                "🔄 Order change/cancel karne ke liye:\n\n1. Order ID share karo\n2. Kya change karna hai bataiye\n\nNote: Delivery start hone se pehle hi possible hai",
                "❌ Cancel karna hai? No problem!\n\nOrder ID bhejo, immediately cancel kar dunga.\n\n⚠️ Agar dispatch ho gaya to cancel nahi hoga"
            ];
            return cancelReplies[Math.floor(Math.random() * cancelReplies.length)];

        case "register_customer":
            // Extract registration details from entities
            const customerName = entities["customer_name:customer_name"]?.[0]?.value;
            const customerPhone = entities["customer_phone:customer_phone"]?.[0]?.value;
            const customerAddress = entities["customer_address:customer_address"]?.[0]?.value;
            const customerGender = entities["customer_gender:customer_gender"]?.[0]?.value;
            const customerAge = entities["customer_age:customer_age"]?.[0]?.value;
            
            // Check if we have all required details
            const hasName = customerName && customerName.trim().length > 0;
            const hasPhone = customerPhone && customerPhone.trim().length > 0;
            const hasAddress = customerAddress && customerAddress.trim().length > 0;
            
            // If all required details are present, complete registration
            if (hasName && hasPhone && hasAddress) {
                let registrationSuccess = `🎉 Registration Successful! Welcome ${customerName}!\n\n`;
                registrationSuccess += `✅ Registration Details:\n`;
                registrationSuccess += `✓ Full name: ${customerName}\n`;
                if (customerAge) {
                    registrationSuccess += `✓ Age: ${customerAge} years\n`;
                }
                if (customerGender) {
                    registrationSuccess += `✓ Gender: ${customerGender}\n`;
                }
                registrationSuccess += `✓ Phone number: ${customerPhone}\n`;
                registrationSuccess += `✓ Delivery address: ${customerAddress}\n\n`;
                registrationSuccess += `🥬 Account ready hai! Ab vegetables order kar sakte hain!\n`;
                registrationSuccess += `Type "Menu" to see available options 😊`;
                
                return registrationSuccess;
            } 
            // If some details are missing, show what we have and what's needed
            else {
                let partialRegistration = `📝 Registration in progress...\n\n`;
                
                // Show what we have
                if (hasName || hasPhone || hasAddress || customerGender || customerAge) {
                    partialRegistration += `✅ Received Details:\n`;
                    if (hasName) partialRegistration += `✓ Full name: ${customerName}\n`;
                    if (customerAge) partialRegistration += `✓ Age: ${customerAge} years\n`;
                    if (customerGender) partialRegistration += `✓ Gender: ${customerGender}\n`;
                    if (hasPhone) partialRegistration += `✓ Phone number: ${customerPhone}\n`;
                    if (hasAddress) partialRegistration += `✓ Delivery address: ${customerAddress}\n`;
                    partialRegistration += `\n`;
                }
                
                // Show what's still needed
                partialRegistration += `❌ Still needed:\n`;
                if (!hasName) partialRegistration += `✗ Full name\n`;
                if (!hasPhone) partialRegistration += `✗ Phone number\n`;
                if (!hasAddress) partialRegistration += `✗ Delivery address\n`;
                
                partialRegistration += `\nPlease provide missing details to complete registration! 😊`;
                
                return partialRegistration;
            }
            
            // Fallback if no entities detected
            const registrationReplies = [
                "📝 Registration ke liye ye details chahiye:\n\n1. Aapka naam\n2. Age (optional)\n3. Gender (optional)\n4. Mobile number\n5. Complete address\n6. Area/locality\n\nYe details share karo, account ready kar dunga! 😊",
                "🆕 New account banana hai? Great!\n\nBas ye details send karo:\n✓ Full name\n✓ Age (optional)\n✓ Gender (optional)\n✓ Phone number\n✓ Delivery address\n✓ Pin code\n\nAccount setup ho jayega! 👍"
            ];
            return registrationReplies[Math.floor(Math.random() * registrationReplies.length)];

        case "thanks":
            const thanksReplies = [
                "Welcome hai! Koi aur help? 🙏",
                "No problem! Always ready to help! 😊",
                "Koi baat nahi! Khushi hui madad karke! 👍",
                "My pleasure! Aur kuch chahiye? 🌸",
            ];
            return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];

        case "goodbye":
            const goodbyeReplies = [
                "Bye! Take care! Phir milenge! 👋",
                "See you soon! Acha din ho! 😊",
                "Alvida! Khayal rakhiye apna! 👋",
                "Goodbye! Come back soon! 🙌",
            ];
            return goodbyeReplies[Math.floor(Math.random() * goodbyeReplies.length)];

        default:
            const defaultReplies = [
                "🤔 Sorry, samajh nahi aaya. Try karo:\n\n• 'Menu' ya 'Help' type karo\n• 'Tomato available hai?' pucho\n• 'Order karna hai' bolo\n\nMain help karne ke liye ready hun! 😊",
                "😅 Ye clear nahi tha. Examples:\n\n🥬 'Onion ka price kya hai?'\n📦 'Order place karna hai'\n🚚 'Delivery track karo'\n📝 'Register karna hai'\n\nKoi bhi sawal pucho freely!",
                "🙏 Sorry, clear nahi tha. Try karo:\n\n✓ Vegetable names pucho\n✓ Order related questions\n✓ Delivery information\n✓ Price checking\n\n'Help' type karo complete menu ke liye!"
            ];
            return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
}

module.exports = handleIntent;
