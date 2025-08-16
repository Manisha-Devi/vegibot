
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
            // Initialize registration state if not exists
            if (!global.userRegistrationState) {
                global.userRegistrationState = {};
            }
            
            const userId = msg?.from || 'unknown';
            
            if (!global.userRegistrationState[userId]) {
                global.userRegistrationState[userId] = {
                    step: 'name',
                    data: {}
                };
                return "🆕 Account banana shuru karte hain! 😊\n\n📝 **Step 1:** Pehle aapka **Full Name** bataiye\n\nExample: 'Mera naam Rahul Kumar hai' ya sirf 'Rahul Kumar'";
            }
            
            return handleRegistrationFlow(userId, msg.body, entities);

        case "registration_data":
            const userId2 = msg?.from || 'unknown';
            return handleRegistrationFlow(userId2, msg.body, entities);

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

// Registration flow handler
function handleRegistrationFlow(userId, message, entities) {
    if (!global.userRegistrationState) {
        global.userRegistrationState = {};
    }
    
    if (!global.userRegistrationState[userId]) {
        global.userRegistrationState[userId] = {
            step: 'name',
            data: {}
        };
    }
    
    const state = global.userRegistrationState[userId];
    
    switch (state.step) {
        case 'name':
            // Extract name from entities or message
            let name = entities["person_name:person_name"]?.[0]?.body || 
                      entities["wit$contact:contact"]?.[0]?.body || 
                      extractNameFromMessage(message);
            
            if (name) {
                state.data.name = name;
                state.step = 'gender';
                return `✅ Name save ho gaya: **${name}**\n\n👤 **Step 2:** Gender bataiye\n\nExample: 'Male', 'Female' ya 'Other'`;
            } else {
                return "🤔 Name clear nahi mila. Please clearly bataiye:\n\nExample:\n• 'Mera naam Priya Sharma hai'\n• 'Rohit Singh'\n• 'My name is Amit'";
            }
            
        case 'gender':
            let gender = extractGenderFromMessage(message);
            if (gender) {
                state.data.gender = gender;
                state.step = 'age';
                return `✅ Gender save: **${gender}**\n\n🎂 **Step 3:** Aapki age kya hai?\n\nExample: '25 years', '30 saal', ya sirf '28'`;
            } else {
                return "🤔 Gender clear nahi mila. Please bataiye:\n\n• 'Male' ya 'M'\n• 'Female' ya 'F'\n• 'Other'";
            }
            
        case 'age':
            let age = entities["wit$age_of_person:age_of_person"]?.[0]?.value || 
                     entities["wit$number:number"]?.[0]?.value || 
                     extractNumberFromMessage(message);
            
            if (age && age > 0 && age < 150) {
                state.data.age = age;
                state.step = 'mobile';
                return `✅ Age save: **${age} years**\n\n📱 **Step 4:** Mobile number share karo\n\nExample: '9876543210' ya '+91 9876543210'`;
            } else {
                return "🤔 Valid age nahi mili. Please bataiye:\n\nExample:\n• '25 years old'\n• '30 saal'\n• '28'";
            }
            
        case 'mobile':
            let mobile = entities["wit$phone_number:phone_number"]?.[0]?.value || 
                        extractMobileFromMessage(message);
            
            if (mobile && mobile.length >= 10) {
                state.data.mobile = mobile;
                state.step = 'address';
                return `✅ Mobile save: **${mobile}**\n\n🏠 **Step 5:** Complete address bataiye\n\nExample: 'H-123, Sector 15, Gurgaon, Haryana, 122001'`;
            } else {
                return "🤔 Valid mobile number nahi mila. Please share karo:\n\nExample:\n• '9876543210'\n• '+91 9876543210'\n• '91-9876543210'";
            }
            
        case 'address':
            let address = message.trim();
            if (address.length > 10) {
                state.data.address = address;
                state.step = 'complete';
                
                // Registration complete
                const userData = state.data;
                delete global.userRegistrationState[userId]; // Clear state
                
                return `🎉 **Registration Complete!** 🎉\n\n📝 **Aapka Account Details:**\n\n👤 Name: ${userData.name}\n🚻 Gender: ${userData.gender}\n🎂 Age: ${userData.age} years\n📱 Mobile: ${userData.mobile}\n🏠 Address: ${userData.address}\n\n✅ Account successfully create ho gaya!\n🆔 Customer ID: CUST${Math.floor(Math.random() * 100000)}\n\n🛒 Ab aap vegetables order kar sakte hain!\nType 'Menu' to start shopping! 😊`;
            } else {
                return "🤔 Address complete nahi laga. Please detailed address share karo:\n\nExample:\n• 'H-123, Sector 15, Gurgaon, Haryana, 122001'\n• 'Flat 4B, Green Valley Apartments, Mumbai-400001'";
            }
            
        default:
            delete global.userRegistrationState[userId];
            return "🔄 Kuch error hui. Registration restart karte hain!\nType 'Register' to begin again.";
    }
}

// Helper functions
function extractNameFromMessage(message) {
    const cleanMsg = message.toLowerCase().trim();
    
    // Pattern matching for names
    let nameMatch = cleanMsg.match(/(?:mera naam|my name is|naam hai|i am|call me)\s+([a-zA-Z\s]+)/);
    if (nameMatch) {
        return nameMatch[1].trim();
    }
    
    // If message looks like a name (only letters and spaces)
    if (/^[a-zA-Z\s]{2,30}$/.test(message.trim())) {
        return message.trim();
    }
    
    return null;
}

function extractGenderFromMessage(message) {
    const cleanMsg = message.toLowerCase().trim();
    
    if (cleanMsg.match(/\b(male|m|boy|man|ladka|mard)\b/)) return "Male";
    if (cleanMsg.match(/\b(female|f|girl|woman|ladki|aurat)\b/)) return "Female";
    if (cleanMsg.match(/\b(other|others)\b/)) return "Other";
    
    return null;
}

function extractNumberFromMessage(message) {
    const numbers = message.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : null;
}

function extractMobileFromMessage(message) {
    const mobilePattern = /(?:\+91\s?)?(?:91\s?)?[6-9]\d{9}/;
    const match = message.match(mobilePattern);
    return match ? match[0].replace(/\s/g, '') : null;
}

module.exports = handleIntent;
