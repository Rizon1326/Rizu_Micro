// Complete code structure for 3 microservices with Docker and Docker Compose

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));

// File: auth-service/routes/authRoutes.js
const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;

// File: auth-service/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// File: auth-service/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

// File: post-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/post', postRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Post service running on port ${PORT}`));

// File: post-service/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('file'), createPost);
router.get('/', getPosts);

module.exports = router;

// File: post-service/controllers/postController.js
const Post = require('../models/Post');
const { v4: uuidv4 } = require('uuid');
const minioClient = require('../config/minioConfig');

exports.createPost = async (req, res) => {
  const { title, codeSnippet } = req.body;
  const file = req.file;
  try {
    const bucketName = 'user-files';
    const fileName = `${uuidv4()}_${file.originalname}`;

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) await minioClient.makeBucket(bucketName);

    await minioClient.putObject(bucketName, fileName, file.buffer);

    const post = new Post({
      title,
      codeSnippet,
      fileUrl: `${bucketName}/${fileName}`,
    });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// File: post-service/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  codeSnippet: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);

// File: post-service/config/minioConfig.js
const Minio = require('minio');
require('dotenv').config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

module.exports = minioClient;

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

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));

// File: notification-service/routes/notificationRoutes.js
const express = require('express');
const { getNotifications, clearNotifications } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', getNotifications);
router.delete('/clear', clearNotifications);

module.exports = router;

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

// File: notification-service/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

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

// Docker Compose File: docker-compose.yml
version: '3.8'

services:
  auth-service:
    build:
      context: ./auth-service
    ports:
      - "5001:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}

  post-service:
    build:
      context: ./post-service
    ports:
      - "5002:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_PORT=${MINIO_PORT}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}

  notification-service:
    build:
      context: ./notification-service
    ports:
      - "5003:5000"
    environment:
      - MONGO_URI=${MONGO_URI}

  mongo:
    image: mongo:5.0
    container_name: mongo
    ports:
      - "27017:27017"

volumes:
  mongo-data:
