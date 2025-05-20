const Parser = require('rss-parser');
const db = require('../config/db');
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', {keepArray: true}],
      ['media:thumbnail', 'mediaThumbnail'],
      ['dc:creator', 'creator']
    ]
  }
});

/**
 * Check if a string contains HTML content
 */
function isHtml(text) {
  if (!text) return false;
  
  // Simple regex to detect HTML tags
  const htmlRegex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
  return htmlRegex.test(text) || text.includes('&lt;') || text.includes('&gt;') || 
         text.includes('&nbsp;') || text.includes('&quot;') || text.includes('&amp;') ||
         text.includes('<p>') || text.includes('<div>') || text.includes('<span>') ||
         text.includes('<a ') || text.includes('<img ');
}

/**
 * Parse HTML content and extract clean text
 */
function parseHtmlContent(html) {
  if (!html) return '';
  if (!isHtml(html)) return html;
  
  try {
    // Replace common entities
    let text = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    
    // Remove scripts and style tags and their content
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    
    // Preserve line breaks and paragraphs
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
    text = text.replace(/<\/div>\s*<div[^>]*>/gi, '\n\n');
    
    // Extract only the link text, without adding URLs in parentheses
    text = text.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2');
    
    // Remove remaining tags
    text = text.replace(/<[^>]+>/g, '');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Decode HTML entities that might remain
    text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    
    // Remove any links in parentheses that might still be in the content
    text = text.replace(/\s*\([^()]*https?:\/\/[^()]*\)\s*/g, ' ');
    
    // Clean up any double spaces created by removing links
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    // Return stripped tags as fallback
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

/**
 * Parse and clean category string
 */
function parseCategory(category) {
  if (!category) return '';
  
  // Check if the category is HTML and parse it
  if (isHtml(category)) {
    category = parseHtmlContent(category);
  }
  
  // Normalize category: lowercase, trim, replace special chars
  return category
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except whitespace and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single one
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Fetch all active RSS sources from the database
 */
async function getActiveSources() {
  try {
    const result = await db.query(
      'SELECT id, name, url FROM rss_sources WHERE active = true'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching RSS sources:', error);
    throw error;
  }
}

/**
 * Update the last_fetched timestamp for a source
 */
async function updateSourceLastFetched(sourceId) {
  try {
    await db.query(
      'UPDATE rss_sources SET last_fetched = NOW() WHERE id = $1',
      [sourceId]
    );
  } catch (error) {
    console.error(`Error updating last_fetched for source ${sourceId}:`, error);
    throw error;
  }
}

/**
 * Extract thumbnail URL from various RSS formats
 */
function extractThumbnail(item) {
  // Try different possible locations for the image
  if (item.mediaContent && item.mediaContent.length > 0) {
    for (const media of item.mediaContent) {
      if (media.$ && media.$.url) {
        return media.$.url;
      }
    }
  }

  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }

  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // Extract image from content if possible
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  // Also try in the description
  if (item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  // Default placeholder image
  return 'https://placehold.co/600x400?text=No+Image';
}

/**
 * Determine category from item (can be customized based on RSS feed structure)
 */
function determineCategory(item, feedTitle) {
  // Try to extract from categories if available
  if (item.categories && item.categories.length > 0) {
    // Parse the first category
    return parseCategory(item.categories[0]);
  }
  
  // Check if there's a category field
  if (item.category) {
    return parseCategory(item.category);
  }
  
  // Fallback to the feed name
  return parseCategory(feedTitle || 'uncategorized');
}

/**
 * Save a single article to the database
 */
async function saveArticle(article) {
  try {
    const result = await db.query(
      `INSERT INTO articles 
       (title, content, thumbnail, category, source_id, source_name, original_url, pub_date, guid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (guid, source_id) DO NOTHING
       RETURNING id`,
      [
        article.title,
        article.content,
        article.thumbnail,
        article.category,
        article.sourceId,
        article.sourceName,
        article.link,
        article.pubDate,
        article.guid
      ]
    );
    
    return result.rows[0] ? result.rows[0].id : null;
  } catch (error) {
    console.error('Error saving article:', error);
    throw error;
  }
}

/**
 * Process a single feed from a source
 */
async function processFeed(source) {
  try {
    console.log(`Fetching feed: ${source.name} (${source.url})`);
    const feed = await parser.parseURL(source.url);
    
    console.log(`Fetched ${feed.items.length} items from ${source.name}`);
    
    let savedCount = 0;
    
    for (const item of feed.items) {
      let content = item.content || item['content:encoded'] || item.description || '';
      
      // Parse HTML content to clean text if needed
      content = parseHtmlContent(content);
      
      const article = {
        title: item.title || 'Untitled Article',
        content: content,
        thumbnail: extractThumbnail(item),
        category: determineCategory(item, feed.title),
        sourceId: source.id,
        sourceName: source.name,
        link: item.link,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        guid: item.guid || item.id || item.link
      };

      const articleId = await saveArticle(article);
      if (articleId) {
        savedCount++;
      }
    }
    
    // Update last fetched timestamp
    await updateSourceLastFetched(source.id);
    
    return {
      sourceName: source.name,
      itemsFetched: feed.items.length,
      itemsSaved: savedCount
    };
  } catch (error) {
    console.error(`Error processing feed for source ${source.name}:`, error);
    return {
      sourceName: source.name,
      error: error.message,
      itemsFetched: 0,
      itemsSaved: 0
    };
  }
}

/**
 * Fetch articles from all active RSS sources
 */
async function fetchAllFeeds() {
  try {
    const sources = await getActiveSources();
    
    if (sources.length === 0) {
      console.log('No active RSS sources found');
      return [];
    }
    
    const results = [];
    
    for (const source of sources) {
      const result = await processFeed(source);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching all feeds:', error);
    throw error;
  }
}

module.exports = {
  fetchAllFeeds,
  getActiveSources,
  processFeed,
  parseHtmlContent, // Export for testing
  isHtml, // Export for testing
  parseCategory // Export for testing
}; 