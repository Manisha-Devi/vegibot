
// utils/userSessions.js
// In-memory storage for user registration sessions

const userSessions = {};

// Initialize or get user session
function getUserSession(userId) {
    if (!userSessions[userId]) {
        userSessions[userId] = {
            registration: {
                name: null,
                age: null,
                gender: null,
                phone: null,
                address: null,
                isComplete: false
            },
            lastActivity: new Date()
        };
    }
    
    // Update last activity
    userSessions[userId].lastActivity = new Date();
    return userSessions[userId];
}

// Update registration data
function updateRegistrationData(userId, data) {
    const session = getUserSession(userId);
    
    // Update only provided fields
    if (data.name) session.registration.name = data.name;
    if (data.age) session.registration.age = data.age;
    if (data.gender) session.registration.gender = data.gender;
    if (data.phone) session.registration.phone = data.phone;
    if (data.address) session.registration.address = data.address;
    
    // Check if registration is complete
    session.registration.isComplete = !!(
        session.registration.name &&
        session.registration.age &&
        session.registration.phone &&
        session.registration.address
    );
    
    return session.registration;
}

// Get registration data
function getRegistrationData(userId) {
    const session = getUserSession(userId);
    return session.registration;
}

// Clear user session
function clearUserSession(userId) {
    delete userSessions[userId];
}

// Clean old sessions (older than 1 hour)
function cleanOldSessions() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    Object.keys(userSessions).forEach(userId => {
        if (userSessions[userId].lastActivity < oneHourAgo) {
            delete userSessions[userId];
        }
    });
}

// Auto cleanup every 30 minutes
setInterval(cleanOldSessions, 30 * 60 * 1000);

module.exports = {
    getUserSession,
    updateRegistrationData,
    getRegistrationData,
    clearUserSession,
    cleanOldSessions
};
