// File: notification-service/jobs/notificationCleaner.js
const Notification = require('../models/Notification');

exports.cleanOldNotifications = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await Notification.deleteMany({ createdAt: { $lt: oneWeekAgo } });
    console.log('Old notifications cleaned');
  } catch (error) {
    console.error('Error cleaning notifications:', error);
  }
};