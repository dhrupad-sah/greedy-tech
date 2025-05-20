#!/usr/bin/env node

/**
 * RSS Feed Fetcher Script
 * 
 * Fetches articles from all configured RSS feeds and saves them to the database.
 * Can be run manually or scheduled with a cron job.
 * 
 * Usage: node fetchRssFeeds.js
 */

require('dotenv').config();
const rssService = require('../services/rssService');

async function main() {
  try {
    console.log('Starting RSS feed fetch...');
    
    const results = await rssService.fetchAllFeeds();
    
    if (results.length === 0) {
      console.log('No feeds processed. Check if any active RSS sources are configured.');
      process.exit(0);
    }
    
    // Print summary
    console.log('\nFetch Summary:');
    console.log('----------------------------------------------');
    
    let totalFetched = 0;
    let totalSaved = 0;
    
    for (const result of results) {
      console.log(`${result.sourceName}:`);
      
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      } else {
        console.log(`  Items fetched: ${result.itemsFetched}`);
        console.log(`  Items saved: ${result.itemsSaved}`);
        totalFetched += result.itemsFetched;
        totalSaved += result.itemsSaved;
      }
      
      console.log('----------------------------------------------');
    }
    
    console.log(`Total items fetched: ${totalFetched}`);
    console.log(`Total new items saved: ${totalSaved}`);
    
    console.log('\nFeed fetch completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in RSS feed fetch:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 