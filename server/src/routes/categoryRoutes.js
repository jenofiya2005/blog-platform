const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, createCategory);

module.exports = router;
