//backend/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts,getPostById} = require('../controllers/postController');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('file'), createPost);
router.get('/', getPosts);
router.get('/:postId', getPostById); // New route for fetching a single post

module.exports = router;
