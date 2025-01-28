const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('file'), createPost);
router.get('/', getPosts);

module.exports = router;