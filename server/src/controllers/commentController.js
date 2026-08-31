const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId, 10);

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: req.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    res.status(201).json({
      message: 'Comment posted successfully!',
      comment
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { post: { select: { authorId: true } } }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    const isCommentAuthor = comment.authorId === req.user.id;
    const isPostAuthor = comment.post.authorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    await prisma.comment.delete({ where: { id } });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommentsByPost, addComment, deleteComment };
