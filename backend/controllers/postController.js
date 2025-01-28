// backend/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const minioClient = require('../config/minioConfig');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');

// Utility function to extract userId from the token
const getUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET).userId;
};

// Controller to create a new post
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

// Controller to get a post by its ID
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate the postId format
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId).populate('userId', 'email name'); // Include user details if needed

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', { postId, error: error.message });
        res.status(500).json({ error: error.message });
    }
};

// Controller to fetch all posts (optional, already in your codebase)
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'email name');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
};

// Exporting all controllers
module.exports = { createPost, getPostById, getPosts };
