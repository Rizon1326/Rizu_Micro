// File: notification-service/routes/notificationRoutes.js
const express = require('express');
const { getNotifications, clearNotifications } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', getNotifications);
router.delete('/clear', clearNotifications);

module.exports = router;