// File: notification-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const notificationRoutes = require('./routes/notificationRoutes');
const { cleanOldNotifications } = require('./jobs/notificationCleaner');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/notification', notificationRoutes);

cron.schedule('0 0 * * *', cleanOldNotifications);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));
