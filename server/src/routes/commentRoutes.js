const express = require('express');
const { getCommentsByPost, addComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/posts/:postId/comments', getCommentsByPost);
router.post('/posts/:postId/comments', authenticate, addComment);
router.delete('/comments/:id', authenticate, deleteComment);

module.exports = router;
