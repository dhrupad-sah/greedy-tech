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
              category: { type: 'string' },
              sourceName: { type: 'string', nullable: true },
              originalUrl: { type: 'string', nullable: true },
              pubDate: { type: 'string', format: 'date-time', nullable: true },
              consumed: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' }
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
            category: { type: 'string' },
            sourceName: { type: 'string', nullable: true },
            originalUrl: { type: 'string', nullable: true },
            pubDate: { type: 'string', format: 'date-time', nullable: true },
            consumed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
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
              category: { type: 'string' },
              sourceName: { type: 'string', nullable: true },
              originalUrl: { type: 'string', nullable: true },
              pubDate: { type: 'string', format: 'date-time', nullable: true },
              consumed: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    handler: articlesController.getArticlesByCategory
  });

  // Get unconsumed articles
  fastify.get('/status/unconsumed', {
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
              category: { type: 'string' },
              sourceName: { type: 'string', nullable: true },
              originalUrl: { type: 'string', nullable: true },
              pubDate: { type: 'string', format: 'date-time', nullable: true },
              consumed: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    handler: articlesController.getUnconsumedArticles
  });

  // Mark article as consumed
  fastify.patch('/:id/consume', {
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
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: articlesController.markArticleAsConsumed
  });
}; 