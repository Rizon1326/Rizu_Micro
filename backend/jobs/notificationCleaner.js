//backend/jobs/notificationCleaner.js
const Notification = require('../models/Notification');

// Deletes notifications older than 7 days
exports.cleanOldNotifications = async () => {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        await Notification.deleteMany({ createdAt: { $lt: weekAgo } });
        console.log('Old notifications cleaned');
    } catch (error) {
        console.error('Error cleaning old notifications:', error);
    }
};
