# Greedy Tech App

A TikTok-style mobile application for short-form tech articles.

## Project Structure

- **backend/** - Fastify API server with Supabase integration
- **mobile/** - Expo mobile app

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