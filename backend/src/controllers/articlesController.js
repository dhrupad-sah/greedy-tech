const db = require('../config/db');

// Get all articles
const getAllArticles = async (req, reply) => {
  try {
    const result = await db.query(
      `SELECT 
        id, 
        title, 
        content, 
        thumbnail, 
        category, 
        source_name as "sourceName", 
        original_url as "originalUrl", 
        pub_date as "pubDate", 
        consumed,
        created_at as "createdAt" 
      FROM articles 
      ORDER BY pub_date DESC`
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
      `SELECT 
        id, 
        title, 
        content, 
        thumbnail, 
        category, 
        source_name as "sourceName", 
        original_url as "originalUrl", 
        pub_date as "pubDate", 
        consumed,
        created_at as "createdAt" 
      FROM articles 
      WHERE id = $1`,
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
      `SELECT 
        id, 
        title, 
        content, 
        thumbnail, 
        category, 
        source_name as "sourceName", 
        original_url as "originalUrl", 
        pub_date as "pubDate", 
        consumed,
        created_at as "createdAt" 
      FROM articles 
      WHERE category = $1 
      ORDER BY pub_date DESC`,
      [category]
    );
    
    return result.rows.map(formatArticle);
  } catch (error) {
    console.error(`Error getting articles by category ${req.params.category}:`, error);
    reply.code(500).send({ error: 'Failed to fetch articles by category' });
  }
};

// Get unconsumed articles
const getUnconsumedArticles = async (req, reply) => {
  try {
    const result = await db.query(
      `SELECT 
        id, 
        title, 
        content, 
        thumbnail, 
        category, 
        source_name as "sourceName", 
        original_url as "originalUrl", 
        pub_date as "pubDate", 
        consumed,
        created_at as "createdAt" 
      FROM articles 
      WHERE consumed = false 
      ORDER BY pub_date DESC`
    );
    
    return result.rows.map(formatArticle);
  } catch (error) {
    console.error('Error getting unconsumed articles:', error);
    reply.code(500).send({ error: 'Failed to fetch unconsumed articles' });
  }
};

// Mark article as consumed
const markArticleAsConsumed = async (req, reply) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `UPDATE articles 
       SET consumed = true 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return reply.code(404).send({ 
        success: false,
        message: 'Article not found' 
      });
    }
    
    return {
      success: true,
      message: 'Article marked as consumed'
    };
  } catch (error) {
    console.error(`Error marking article ${req.params.id} as consumed:`, error);
    reply.code(500).send({ 
      success: false,
      error: 'Failed to mark article as consumed'
    });
  }
};

// Helper to format article data
const formatArticle = (article) => {
  return {
    ...article,
    id: article.id.toString(),
    createdAt: article.createdAt.toISOString(),
    pubDate: article.pubDate ? article.pubDate.toISOString() : null
  };
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getUnconsumedArticles,
  markArticleAsConsumed
}; 