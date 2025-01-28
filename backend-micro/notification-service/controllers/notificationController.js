// File: notification-service/controllers/notificationController.js
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany();
    res.status(200).json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};