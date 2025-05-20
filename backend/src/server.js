const fastify = require('fastify')({ logger: true });
const path = require('path');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./models/dbInit');

// Load environment variables
dotenv.config();

// Initialize database
initializeDatabase()
  .then((success) => {
    if (success) {
      console.log('Database initialized successfully');
    } else {
      console.error('Failed to initialize database');
    }
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });

// Register plugins
fastify.register(require('@fastify/cors'), {
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(require('@fastify/swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Greedy Tech API',
      description: 'API for Greedy Tech mobile app',
      version: '0.1.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

// Register routes
fastify.register(require('./routes/articles'), { prefix: '/api/articles' });
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/rss'), { prefix: '/api/rss' });

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 