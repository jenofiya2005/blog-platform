const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

const getPosts = async (req, res, next) => {
  try {
    const { search, category, author, tag, sort = 'latest', page = 1, limit = 9 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const take = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * take;

    const where = {
      published: true
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } }
      ];
    }

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (author) {
      where.author = {
        username: author
      };
    }

    if (tag) {
      where.tags = {
        contains: tag
      };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'views') orderBy = { views: 'desc' };
    if (sort === 'popular') orderBy = { likes: { _count: 'desc' } };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          author: {
            select: { id: true, name: true, username: true, avatar: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        }
      })
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / take),
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPostBySlugOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);

    const post = await prisma.post.findFirst({
      where: isNumeric ? { id: parseInt(identifier, 10) } : { slug: identifier },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true }
        },
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Increment views safely
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    let hasLiked = false;
    if (req.user) {
      const like = await prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: post.id
          }
        }
      });
      hasLiked = !!like;
    }

    res.json({
      post: {
        ...post,
        views: post.views + 1,
        hasLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, categoryId, tags, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = 'post-' + Date.now();

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const calculatedExcerpt = excerpt || content.slice(0, 160).replace(/[#*`_]/g, '') + '...';
    const readTime = calculateReadTime(content);

    const post = await prisma.post.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt: calculatedExcerpt,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        readTime,
        published: published !== undefined ? published : true,
        tags: tags || '',
        authorId: req.user.id,
        categoryId: categoryId ? parseInt(categoryId, 10) : null
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        category: true
      }
    });

    res.status(201).json({
      message: 'Post created successfully!',
      post
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, excerpt, content, coverImage, categoryId, tags, published } = req.body;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update this post.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) {
      updateData.content = content;
      updateData.readTime = calculateReadTime(content);
    }
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId, 10) : null;
    if (tags !== undefined) updateData.tags = tags;
    if (published !== undefined) updateData.published = published;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        category: true,
        _count: { select: { comments: true, likes: true } }
      }
    });

    res.json({
      message: 'Post updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: 'Post deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    let liked = false;
    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      await prisma.postLike.create({
        data: { userId, postId }
      });
      liked = true;
    }

    const likeCount = await prisma.postLike.count({ where: { postId } });

    res.json({
      liked,
      likeCount,
      message: liked ? 'Post liked!' : 'Post unliked.'
    });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });

    const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
    const totalLikes = posts.reduce((acc, p) => acc + p._count.likes, 0);
    const totalComments = posts.reduce((acc, p) => acc + p._count.comments, 0);

    res.json({
      posts,
      stats: {
        totalPosts: posts.length,
        totalViews,
        totalLikes,
        totalComments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostBySlugOrId,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts
};
