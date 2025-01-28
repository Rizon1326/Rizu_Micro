// backend/controllers/notificationController.js
const Notification = require('../models/Notification');

exports.createNotification = async (userId, message, postId) => {
    try {
        const notification = new Notification({ userId, message, postId });
        await notification.save();
    } catch (error) {
        console.error('Notification error:', error);
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ userId })
            .populate('postId', 'title')
            .sort({ createdAt: -1 })
            .limit(5); // Limit to the last 5 notifications

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.markNotificationAsUnread = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: false });
        res.status(200).json({ message: 'Notification marked as unread' });
    } catch (error) {
        console.error('Error marking notification as unread:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.clearNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.deleteMany({ userId });
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('userId', 'email name'); // Include user info if needed

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: error.message });
    }
};
