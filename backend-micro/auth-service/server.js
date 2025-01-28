// File: auth-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
