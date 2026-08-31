const express = require('express');
const {
  getPosts,
  getPostBySlugOrId,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts
} = require('../controllers/postController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPosts);
router.get('/user/me', authenticate, getMyPosts);
router.get('/:identifier', optionalAuth, getPostBySlugOrId);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, toggleLike);

module.exports = router;
