#!/usr/bin/env node

/**
 * Database initialization script
 * 
 * This script creates the PostgreSQL database and initializes the schema.
 * Usage: node init-db.js
 */

const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Configuration
const config = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  // Connect to postgres database initially
  database: 'postgres'
};

const DB_NAME = process.env.DB_NAME || 'greedytech';

async function initializeDatabase() {
  let client;
  try {
    // Connect to PostgreSQL
    client = new Client(config);
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    // Check if the database exists
    const checkDbRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]
    );

    // Drop database if it exists
    if (checkDbRes.rows.length > 0) {
      console.log(`Dropping existing database ${DB_NAME}...`);
      
      // Terminate all connections to the database first
      await client.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${DB_NAME}'
        AND pid <> pg_backend_pid();
      `);
      
      await client.query(`DROP DATABASE ${DB_NAME}`);
      console.log(`Database ${DB_NAME} dropped successfully.`);
    }

    // Create database
    console.log(`Creating database ${DB_NAME}...`);
    await client.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`Database ${DB_NAME} created successfully.`);

    // Close connection to postgres database
    await client.end();

    // Connect to the new database
    const newClient = new Client({
      ...config,
      database: DB_NAME
    });
    await newClient.connect();
    console.log(`Connected to ${DB_NAME} database.`);

    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'src', 'models', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('Creating schema...');
    await newClient.query(schemaSql);
    console.log('Schema created successfully.');

    await newClient.end();
    console.log('Database initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    if (client) {
      await client.end();
    }
    return false;
  }
}

// Run initialization
initializeDatabase()
  .then((success) => {
    if (success) {
      console.log('--- Database Setup Complete ---');
      process.exit(0);
    } else {
      console.error('--- Database Setup Failed ---');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 