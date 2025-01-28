// backend/routes/notificationRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    getNotifications, 
    markNotificationAsRead, 
    markNotificationAsUnread,
    clearNotifications 
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);
router.patch('/:notificationId/unread', authMiddleware, markNotificationAsUnread); // New route
router.post('/clear', authMiddleware, clearNotifications);

module.exports = router;
