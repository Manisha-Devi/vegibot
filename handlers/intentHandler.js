
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
                    step: 'collecting',
                    data: {}
                };
            }
            
            // Try to extract all possible data from first message
            return handleFlexibleRegistration(userId, msg.body, entities);

        case "registration_data":
            const userId2 = msg?.from || 'unknown';
            return handleFlexibleRegistration(userId2, msg.body, entities);

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

// Flexible Registration Handler - Improved with better UX and validation
function handleFlexibleRegistration(userId, message, entities) {
    if (!global.userRegistrationState) {
        global.userRegistrationState = {};
    }
    
    if (!global.userRegistrationState[userId]) {
        global.userRegistrationState[userId] = {
            step: 'collecting',
            data: {},
            attempts: 0
        };
    }
    
    const state = global.userRegistrationState[userId];
    state.attempts += 1;
    
    // Extract all possible data from current message
    const extractedData = extractAllRegistrationData(message, entities);
    
    // Track what was updated in this message
    const updatedFields = [];
    const newFields = [];
    
    // Merge extracted data with existing data (allow updates)
    Object.keys(extractedData).forEach(key => {
        if (extractedData[key]) {
            if (state.data[key]) {
                // Field was updated
                updatedFields.push(key);
                state.data[key] = extractedData[key];
            } else {
                // New field added
                newFields.push(key);
                state.data[key] = extractedData[key];
            }
        }
    });
    
    // Check what data is still missing
    const requiredFields = ['name', 'gender', 'age', 'mobile', 'address'];
    const missingFields = requiredFields.filter(field => !state.data[field]);
    
    // Validate extracted data
    const validationWarnings = validateRegistrationData(state.data);
    
    // If all data is complete and valid
    if (missingFields.length === 0 && validationWarnings.length === 0) {
        const userData = state.data;
        delete global.userRegistrationState[userId]; // Clear state
        
        return `🎉 **Registration Complete!** 🎉\n\n📝 **Aapka Account Details:**\n\n✅ Name: ${userData.name}\n✅ Gender: ${userData.gender}\n✅ Age: ${userData.age} years\n✅ Mobile: ${userData.mobile}\n✅ Address: ${userData.address}\n\n🆔 Customer ID: CUST${Math.floor(Math.random() * 100000)}\n\n🛒 Ab aap vegetables order kar sakte hain!\nType 'Menu' to start shopping! 😊`;
    }
    
    // Build response with icons and updates
    let response = "📝 **Registration Progress:**\n\n";
    
    // Show what was updated/added in this message
    if (updatedFields.length > 0) {
        response += "🔄 **Updated:**\n";
        updatedFields.forEach(field => {
            response += `✅ ${getFieldDisplayName(field)}: ${state.data[field]}\n`;
        });
        response += "\n";
    }
    
    if (newFields.length > 0) {
        response += "✨ **Added:**\n";
        newFields.forEach(field => {
            response += `✅ ${getFieldDisplayName(field)}: ${state.data[field]}\n`;
        });
        response += "\n";
    }
    
    // Show all current data with icons
    response += "📊 **Current Status:**\n";
    requiredFields.forEach(field => {
        if (state.data[field]) {
            response += `✅ ${getFieldDisplayName(field)}: ${state.data[field]}\n`;
        } else {
            response += `❌ ${getFieldDisplayName(field)}: *Required*\n`;
        }
    });
    
    // Show validation warnings
    if (validationWarnings.length > 0) {
        response += "\n⚠️ **Warnings:**\n";
        validationWarnings.forEach(warning => {
            response += `🚨 ${warning}\n`;
        });
    }
    
    // Show missing fields if any
    if (missingFields.length > 0) {
        response += "\n❗ **Missing Required Fields:**\n";
        missingFields.forEach(field => {
            response += `❌ ${getFieldDisplayName(field)}\n`;
        });
        
        response += "\n💡 **Next Steps:**\n";
        
        // Provide specific examples based on missing fields
        if (missingFields.includes('name')) {
            response += "• Name: 'Mera naam Rohit Kumar hai'\n";
        }
        if (missingFields.includes('mobile')) {
            response += "• Mobile: '9876543210'\n";
        }
        if (missingFields.includes('address')) {
            response += "• Address: 'Sector 15, Noida, UP 201301'\n";
        }
        if (missingFields.includes('age')) {
            response += "• Age: '25 years old'\n";
        }
        if (missingFields.includes('gender')) {
            response += "• Gender: 'Male' ya 'Female'\n";
        }
    }
    
    // Help message based on attempts
    if (state.attempts > 3 && missingFields.length > 0) {
        response += "\n🤔 **Having trouble?**\n";
        response += "• Ek saath sab details bhej sakte hain\n";
        response += "• Ya 'help' type karo detailed guidance ke liye\n";
        response += "• Example: 'Rohit, male, 28, 9876543210, Noida'\n";
    }
    
    response += "\n📝 Type any missing info to continue! 😊";
    
    return response;
}

// Helper function to get field display names
function getFieldDisplayName(field) {
    const fieldNames = {
        'name': 'Full Name',
        'gender': 'Gender',
        'age': 'Age',
        'mobile': 'Mobile Number',
        'address': 'Address'
    };
    return fieldNames[field] || field;
}

// Validation function for registration data
function validateRegistrationData(data) {
    const warnings = [];
    
    // Validate mobile number
    if (data.mobile) {
        const cleanMobile = data.mobile.replace(/\s/g, '');
        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
            warnings.push("Mobile number should be 10 digits starting with 6-9");
        }
    }
    
    // Validate age
    if (data.age) {
        const age = parseInt(data.age);
        if (age < 18 || age > 100) {
            warnings.push("Age should be between 18-100 years");
        }
    }
    
    // Validate name
    if (data.name) {
        if (data.name.length < 2) {
            warnings.push("Name should be at least 2 characters");
        }
        if (!/^[a-zA-Z\s]+$/.test(data.name)) {
            warnings.push("Name should contain only letters and spaces");
        }
    }
    
    // Validate gender
    if (data.gender) {
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(data.gender.toLowerCase())) {
            warnings.push("Gender should be Male, Female, or Other");
        }
    }
    
    // Validate address
    if (data.address) {
        if (data.address.length < 10) {
            warnings.push("Address seems too short, please provide complete address");
        }
    }
    
    return warnings;
}

// Extract all possible registration data from message and entities
function extractAllRegistrationData(message, entities) {
    const data = {};
    
    // Extract Name
    data.name = entities["person_name:person_name"]?.[0]?.body || 
                entities["wit$contact:contact"]?.[0]?.body || 
                extractNameFromMessage(message);
    
    // Extract Gender
    data.gender = extractGenderFromMessage(message);
    
    // Extract Age
    const ageValue = entities["wit$age_of_person:age_of_person"]?.[0]?.value || 
                     entities["wit$number:number"]?.[0]?.value || 
                     extractNumberFromMessage(message);
    if (ageValue && ageValue > 0 && ageValue < 150) {
        data.age = ageValue;
    }
    
    // Extract Mobile
    data.mobile = entities["wit$phone_number:phone_number"]?.[0]?.value || 
                  extractMobileFromMessage(message);
    
    // Extract Address (if message seems like address)
    const addressFromMessage = extractAddressFromMessage(message);
    if (addressFromMessage) {
        data.address = addressFromMessage;
    }
    
    return data;
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

function extractAddressFromMessage(message) {
    const cleanMsg = message.trim();
    
    // Look for address indicators
    const addressKeywords = ['address', 'ghar', 'house', 'flat', 'apartment', 'sector', 'colony', 'street', 'road', 'pincode', 'pin'];
    const hasAddressKeyword = addressKeywords.some(keyword => 
        cleanMsg.toLowerCase().includes(keyword)
    );
    
    // If message is long and has address-like patterns or keywords
    if ((cleanMsg.length > 20 && hasAddressKeyword) || 
        (cleanMsg.length > 50 && /\d{6}/.test(cleanMsg))) { // Contains 6-digit pincode
        return cleanMsg;
    }
    
    return null;
}

module.exports = handleIntent;
