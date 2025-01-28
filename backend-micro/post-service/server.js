// File: post-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use('/post', postRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Post service running on port ${PORT}`));
