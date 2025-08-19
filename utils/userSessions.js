
// utils/userSessions.js
// Simple in-memory user session storage

class UserSessions {
    constructor() {
        this.sessions = new Map();
    }

    // Get user session data
    getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, {
                registrationData: {},
                isRegistering: false,
                lastActivity: Date.now()
            });
        }
        return this.sessions.get(userId);
    }

    // Update registration data for user
    updateRegistrationData(userId, newData) {
        const session = this.getSession(userId);
        session.registrationData = { ...session.registrationData, ...newData };
        session.isRegistering = true;
        session.lastActivity = Date.now();
        
        console.log(`📝 Updated registration data for ${userId}:`, session.registrationData);
        return session.registrationData;
    }

    // Check if user has complete registration data
    isRegistrationComplete(userId) {
        const session = this.getSession(userId);
        const data = session.registrationData;
        
        const hasName = data.name && data.name.trim().length > 0;
        const hasAge = data.age && data.age.trim().length > 0;
        const hasPhone = data.phone && data.phone.trim().length > 0;
        const hasAddress = data.address && data.address.trim().length > 0;
        
        return hasName && hasAge && hasPhone && hasAddress;
    }

    // Get registration summary
    getRegistrationSummary(userId) {
        const session = this.getSession(userId);
        return session.registrationData;
    }

    // Clear registration data after successful registration
    clearRegistration(userId) {
        const session = this.getSession(userId);
        session.registrationData = {};
        session.isRegistering = false;
        session.lastActivity = Date.now();
    }

    // Clean old sessions (older than 24 hours)
    cleanOldSessions() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        for (const [userId, session] of this.sessions) {
            if (session.lastActivity < oneDayAgo) {
                this.sessions.delete(userId);
                console.log(`🧹 Cleaned old session for user: ${userId}`);
            }
        }
    }
}

// Export singleton instance
const userSessions = new UserSessions();

// Clean old sessions every hour
setInterval(() => {
    userSessions.cleanOldSessions();
}, 60 * 60 * 1000);

module.exports = userSessions;
