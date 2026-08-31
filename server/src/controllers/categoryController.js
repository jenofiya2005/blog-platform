const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Category name and slug are required.' });
    }

    const category = await prisma.category.create({
      data: { name, slug, description }
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory };
