const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

// Read and execute the schema
async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('Database schema initialized successfully');
    
    // Check if articles table is empty, if so, add sample data
    const articlesResult = await pool.query('SELECT COUNT(*) FROM articles');
    
    if (parseInt(articlesResult.rows[0].count) === 0) {
      console.log('Adding sample articles...');
      
      // Sample article data
      const sampleArticles = [
        {
          title: 'The Future of AI in Daily Life',
          content: 'Artificial intelligence is rapidly transforming how we live and work. From smart home devices to personal assistants on our phones, AI is becoming increasingly integrated into our daily routines. This article explores how AI might continue to evolve and shape our futures in the coming decades.',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
          category: 'ai'
        },
        {
          title: 'Understanding Blockchain Beyond Cryptocurrency',
          content: 'While blockchain technology is best known for powering cryptocurrencies like Bitcoin, its potential applications extend far beyond digital currencies. This article delves into how blockchain is being used in supply chain management, digital identity verification, voting systems, and more.',
          thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55',
          category: 'blockchain'
        },
        {
          title: 'The Rise of Remote Work Technologies',
          content: 'The global shift to remote work has accelerated the development of technologies designed to support distributed teams. From virtual collaboration tools to asynchronous communication platforms, this article examines the innovations making remote work more effective and sustainable.',
          thumbnail: 'https://images.unsplash.com/photo-1587702068694-a909ef4f9150',
          category: 'work'
        }
      ];
      
      // Insert sample articles
      for (const article of sampleArticles) {
        await pool.query(
          'INSERT INTO articles (title, content, thumbnail, category) VALUES ($1, $2, $3, $4)',
          [article.title, article.content, article.thumbnail, article.category]
        );
      }
      
      console.log('Sample articles added successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Export the function
module.exports = { initializeDatabase };

// If run directly (not imported), initialize the database
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} 