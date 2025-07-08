# Server (Backend) - Ghost Candidate

This directory contains the backend Node.js application for Ghost Candidate, an AI-powered interview assistant.

## Features

*   **Resume Processing:** Handles PDF resume uploads and extracts text content.
*   **AI Integration:** Communicates with Google Generative AI (Gemini) and OpenAI (GPT-3.5 Turbo) for generating interview questions and responses.
*   **Intelligent Caching:** Caches AI responses for frequently asked questions to improve performance.
*   **WebSocket Server:** Manages real-time communication with the frontend client, including handling ping/pong for connection stability and streaming AI responses.
*   **MongoDB Integration:** Stores resume data and AI response cache in a MongoDB database.

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database for storing resume data and AI response cache.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **`ws`:** WebSocket library for Node.js.
*   **`pdf-parse`:** For extracting text from PDF resumes.
*   **Google Generative AI API (Gemini):** Primary AI model for generating interview responses.
*   **OpenAI API (GPT-3.5 Turbo):** Fallback AI model for generating interview responses.
*   **`dotenv`:** For managing environment variables.
*   **`cors`:** Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Setup and Installation

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (comes with Node.js)
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

### 1. Navigate to the Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

#### `server/.env`

```
MONGO_URI=your_mongodb_connection_string
PORT=4000
GOOGLE_API_KEY=your_google_generative_ai_api_key
OPENAI_API_KEY=your_openai_api_key
```

*   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/ghostcandidate` for a local instance, or a MongoDB Atlas connection string).
*   `PORT`: The port your server will run on (default is `4000`).
*   `GOOGLE_API_KEY`: Your API key for Google Generative AI (Gemini).
*   `OPENAI_API_KEY`: Your API key for OpenAI.

### 4. Run the Server

```bash
npm start
# Or, if you have nodemon installed for automatic restarts:
# nodemon server.js
```

The server should start on `http://localhost:4000` (or your specified port). You should see a "MongoDB connected" message in the console.

## Project Structure

```
server/
├── config/             # Database configuration
├── controllers/        # Request handlers and WebSocket logic
├── models/             # Mongoose schemas for MongoDB
├── routes/             # API routes
├── services/           # AI integration logic
├── server.js           # Main server entry point
└── package.json        # Backend dependencies
```
