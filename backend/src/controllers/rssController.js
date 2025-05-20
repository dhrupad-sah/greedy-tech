const rssService = require('../services/rssService');
const db = require('../config/db');

// Fetch articles from all active RSS feeds
const fetchAllFeeds = async (req, reply) => {
  try {
    const results = await rssService.fetchAllFeeds();
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error in fetchAllFeeds controller:', error);
    reply.code(500).send({ 
      success: false, 
      error: 'Failed to fetch RSS feeds'
    });
  }
};

// Get all RSS sources
const getAllSources = async (req, reply) => {
  try {
    const result = await db.query(
      'SELECT id, name, url, active, last_fetched as "lastFetched", created_at as "createdAt" FROM rss_sources ORDER BY name'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all RSS sources:', error);
    reply.code(500).send({ error: 'Failed to fetch RSS sources' });
  }
};

// Add a new RSS source
const addSource = async (req, reply) => {
  try {
    const { name, url, active = true } = req.body;
    
    const result = await db.query(
      `INSERT INTO rss_sources (name, url, active) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, url, active, created_at as "createdAt"`,
      [name, url, active]
    );
    
    reply.code(201);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding RSS source:', error);
    
    // Check for duplicate url
    if (error.code === '23505' && error.constraint === 'rss_sources_url_key') {
      reply.code(409).send({ error: 'A source with this URL already exists' });
      return;
    }
    
    reply.code(500).send({ error: 'Failed to add RSS source' });
  }
};

// Update an RSS source
const updateSource = async (req, reply) => {
  try {
    const { id } = req.params;
    const updates = {};
    const params = [id];
    let setClause = '';
    let paramIndex = 2;
    
    // Only update fields that are provided
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined) {
        updates[key] = value;
        setClause += `${setClause ? ', ' : ''}${key} = $${paramIndex}`;
        params.push(value);
        paramIndex++;
      }
    }
    
    if (Object.keys(updates).length === 0) {
      reply.code(400).send({ error: 'No update fields provided' });
      return;
    }
    
    const result = await db.query(
      `UPDATE rss_sources 
       SET ${setClause} 
       WHERE id = $1 
       RETURNING id, name, url, active, last_fetched as "lastFetched", created_at as "createdAt"`,
      params
    );
    
    if (result.rows.length === 0) {
      reply.code(404).send({ error: 'RSS source not found' });
      return;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating RSS source ${req.params.id}:`, error);
    
    // Check for duplicate url
    if (error.code === '23505' && error.constraint === 'rss_sources_url_key') {
      reply.code(409).send({ error: 'A source with this URL already exists' });
      return;
    }
    
    reply.code(500).send({ error: 'Failed to update RSS source' });
  }
};

// Delete an RSS source
const deleteSource = async (req, reply) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM rss_sources WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      reply.code(404).send({ 
        success: false,
        message: 'RSS source not found' 
      });
      return;
    }
    
    return {
      success: true,
      message: 'RSS source deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting RSS source ${req.params.id}:`, error);
    reply.code(500).send({ 
      success: false,
      error: 'Failed to delete RSS source'
    });
  }
};

module.exports = {
  fetchAllFeeds,
  getAllSources,
  addSource,
  updateSource,
  deleteSource
}; 