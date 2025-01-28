const Post = require('../models/Post');
const { v4: uuidv4 } = require('uuid');
const minioClient = require('../config/minioConfig');
const User = require('../models/User'); // Assuming you have a User model
const { getUserIdFromToken, createNotification } = require('../utils'); // Assuming you have these utility functions

const createPost = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title, codeSnippet } = req.body;

    // Validate required fields
    if (!title || !codeSnippet || !req.file) {
      return res.status(400).json({ message: 'Title, code snippet, and a file are required' });
    }

    const bucketName = 'user-files';
    const fileName = `${uuidv4()}_${req.file.originalname}`;

    // Check if the bucket exists, if not create it
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket "${bucketName}" created successfully.`);
    }

    // Upload the file to MinIO
    await minioClient.putObject(bucketName, fileName, req.file.buffer);
    const fileUrl = `${bucketName}/${fileName}`;

    // Save the post in the database
    const post = new Post({ userId, title, codeSnippet, fileUrl });
    await post.save();

    // Notify all users except the post creator
    const users = await User.find({ _id: { $ne: userId } });
    for (const user of users) {
      await createNotification(user._id, 'New post available', post._id);
    }

    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts
};