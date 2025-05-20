const db = require('../config/db');

// Get all articles
const getAllArticles = async (req, reply) => {
  try {
    const result = await db.query(
      'SELECT id, title, content, thumbnail, category, created_at as "createdAt" FROM articles ORDER BY created_at DESC'
    );
    
    return result.rows.map(formatArticle);
  } catch (error) {
    console.error('Error getting all articles:', error);
    reply.code(500).send({ error: 'Failed to fetch articles' });
  }
};

// Get article by ID
const getArticleById = async (req, reply) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT id, title, content, thumbnail, category, created_at as "createdAt" FROM articles WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return reply.code(404).send({ error: 'Article not found' });
    }
    
    return formatArticle(result.rows[0]);
  } catch (error) {
    console.error(`Error getting article by ID ${req.params.id}:`, error);
    reply.code(500).send({ error: 'Failed to fetch article' });
  }
};

// Get articles by category
const getArticlesByCategory = async (req, reply) => {
  try {
    const { category } = req.params;
    
    const result = await db.query(
      'SELECT id, title, content, thumbnail, category, created_at as "createdAt" FROM articles WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    
    return result.rows.map(formatArticle);
  } catch (error) {
    console.error(`Error getting articles by category ${req.params.category}:`, error);
    reply.code(500).send({ error: 'Failed to fetch articles by category' });
  }
};

// Helper to format article data
const formatArticle = (article) => {
  return {
    ...article,
    id: article.id.toString(),
    createdAt: article.createdAt.toISOString()
  };
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticlesByCategory
}; 