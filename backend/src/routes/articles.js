const articlesController = require('../controllers/articlesController');

module.exports = async function (fastify, opts) {
  // Get all articles
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string' },
              thumbnail: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              category: { type: 'string' }
            }
          }
        }
      }
    },
    handler: articlesController.getAllArticles
  });

  // Get article by ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            thumbnail: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            category: { type: 'string' }
          }
        }
      }
    },
    handler: articlesController.getArticleById
  });

  // Get articles by category
  fastify.get('/category/:category', {
    schema: {
      params: {
        type: 'object',
        required: ['category'],
        properties: {
          category: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string' },
              thumbnail: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              category: { type: 'string' }
            }
          }
        }
      }
    },
    handler: articlesController.getArticlesByCategory
  });
}; 