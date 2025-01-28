//backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const authRoutes = require('/Users/rizon/Desktop/Buddhir_Bati_2/backend/routes/authRoutes.js');
const postRoutes = require('/Users/rizon/Desktop/Buddhir_Bati_2/backend/routes/postRoutes.js');
const notificationRoutes = require('/Users/rizon/Desktop/Buddhir_Bati_2/backend/routes/notificationRoutes.js');
const { cleanOldNotifications } = require('/Users/rizon/Desktop/Buddhir_Bati_2/backend/jobs/notificationCleaner.js');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/notification', notificationRoutes);

cron.schedule('0 0 * * *', () => {
    setTimeout(() => {
      cleanOldNotifications();
    }, 15000); // Delay of 15 seconds (15000 ms)
  });
  
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  