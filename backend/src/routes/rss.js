const rssController = require('../controllers/rssController');

module.exports = async function(fastify, opts) {
  // Fetch all RSS feeds
  fastify.get('/fetch', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            results: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sourceName: { type: 'string' },
                  itemsFetched: { type: 'integer' },
                  itemsSaved: { type: 'integer' },
                  error: { type: 'string', nullable: true }
                }
              }
            }
          }
        }
      }
    },
    handler: rssController.fetchAllFeeds
  });

  // Get all RSS sources
  fastify.get('/sources', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              url: { type: 'string' },
              active: { type: 'boolean' },
              lastFetched: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    handler: rssController.getAllSources
  });

  // Add a new RSS source
  fastify.post('/sources', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'url'],
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          active: { type: 'boolean' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            url: { type: 'string' },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: rssController.addSource
  });

  // Update an RSS source
  fastify.put('/sources/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          active: { type: 'boolean' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            url: { type: 'string' },
            active: { type: 'boolean' },
            lastFetched: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: rssController.updateSource
  });

  // Delete an RSS source
  fastify.delete('/sources/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
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
    handler: rssController.deleteSource
  });
}; 