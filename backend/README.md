# Greedy Tech Backend

Backend server for the Greedy Tech mobile app.

## RSS Feed Feature

The backend includes functionality to fetch and process articles from RSS feeds. It currently supports The Verge and Wired, with the ability to add more sources.

### How It Works

1. RSS feeds are stored in the `rss_sources` table with information like name, URL, and active status.
2. The system fetches articles from these sources and stores them in the `articles` table.
3. Each article has a `consumed` flag (default: false) to track processing status.
4. In the future, unconsumed articles can be processed by an LLM to generate custom content.

### API Endpoints

#### RSS Endpoints

- `GET /api/rss/sources` - List all RSS sources
- `POST /api/rss/sources` - Add a new RSS source
- `PUT /api/rss/sources/:id` - Update an RSS source
- `DELETE /api/rss/sources/:id` - Delete an RSS source
- `GET /api/rss/fetch` - Manually trigger fetching from all active RSS sources

#### Article Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/category/:category` - Get articles by category
- `GET /api/articles/status/unconsumed` - Get all unconsumed articles
- `PATCH /api/articles/:id/consume` - Mark an article as consumed

### Running the RSS Fetcher

You can manually fetch RSS feeds using:

```bash
npm run fetch-rss
```

For automatic fetching, you can set up a cron job or use a task scheduler like pm2 to run this script at regular intervals.

## Database Setup

To initialize the database:

```bash
npm run init-db
```

This will create the required tables and insert default RSS sources.

## Environment Variables

Create a `.env` file with the following variables:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=greedytech
PORT=3000
```

## Development

Start the development server:

```bash
npm run dev
``` 