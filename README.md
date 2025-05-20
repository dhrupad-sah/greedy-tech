# Greedy Tech Project

Greedy Tech is a TikTok-style mobile app for short tech articles.

## Project Structure

The project is structured as a monorepo with two main components:

- **Backend**: Fastify + Supabase REST API
- **Mobile**: Expo + React Native app

## Backend

The backend provides a RESTful API for articles and authentication. It includes RSS feed integration to automatically fetch and store tech articles from various sources.

### RSS Feed Implementation (v1)

The current implementation focuses on fetching articles from The Verge and Wired, with a plan to support additional sources in the future.

#### How It Works

1. RSS sources are stored in the `rss_sources` table, which includes URLs and metadata for each feed
2. The system fetches articles from these sources and stores them in the `articles` table
3. Each article has a `consumed` flag (default: false) to track processing status
4. Unconsumed articles can be later processed by an LLM to generate custom content

#### Key Components

- `rssService.js`: Handles fetching and processing RSS feeds
- `rssController.js`: Provides API endpoints for RSS operations
- `fetchRssFeeds.js`: Script that can be run manually or scheduled for automatic fetching

#### API Endpoints

- `GET /api/rss/sources`: List all RSS sources
- `POST /api/rss/sources`: Add a new RSS source
- `PUT /api/rss/sources/:id`: Update an RSS source
- `DELETE /api/rss/sources/:id`: Delete an RSS source
- `GET /api/rss/fetch`: Manually trigger fetching from all active RSS sources

- `GET /api/articles`: Get all articles
- `GET /api/articles/:id`: Get article by ID
- `GET /api/articles/category/:category`: Get articles by category
- `GET /api/articles/status/unconsumed`: Get all unconsumed articles
- `PATCH /api/articles/:id/consume`: Mark an article as consumed

### Running the Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=greedytech
   PORT=3000
   ```

3. Initialize the database:
   ```bash
   npm run init-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Fetch RSS feeds:
   ```bash
   npm run fetch-rss
   ```

## Next Steps (v2)

The next version will:

1. Implement LLM processing for unconsumed articles
2. Generate custom content from the articles
3. Store the generated content in the `generated_content` table
4. Update the mobile app to display the generated content

## Tech Stack

### Backend
- Fastify (API server)
- Supabase (for auth, database, and storage)
- PostgreSQL (via Supabase)

### Mobile
- React Native (via Expo)
- Expo Router (for navigation)
- Axios (for API calls)

## Features (MVP)

- Vertical scrolling feed for tech articles
- Pre-generated articles with interesting tech content
- Categories for content discovery
- Basic UI with article cards
- Article detail view

## Setup & Running

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then fill in your Supabase credentials if you have them.

4. Run the development server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3000

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Follow the instructions in the terminal to open the app on your device or emulator.

### Running Both Together

You can run both the backend and mobile app concurrently using:

```bash
npm install
npm start
```

## Future Features

- User authentication
- Personalized content based on user interests
- Article generation with LLM integration
- Social features (likes, comments, shares)
- Bookmarking functionality
- Offline mode support 