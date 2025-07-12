# Client (Frontend) - Ghost

![Ghost Preview](https://res.cloudinary.com/dnkjgw2ti/image/upload/v1752301354/Screenshot_2025-07-12_at_11.51.18_dmzxxw.png)

This directory contains the frontend React application for Ghost, an AI-powered interview assistant.

## Features

*   **Resume Upload:** Securely upload your resume (PDF format) to provide context for the AI.
*   **AI-Powered Interview Questions:** The AI generates interview questions based on your resume content or general interview best practices.
*   **Real-time Interaction:** Engage in a live interview simulation with the AI.
*   **Speech Recognition:** Speak your answers naturally, and the application will transcribe them.
*   **AI Response Streaming:** AI answers are streamed in real-time, reducing perceived latency and improving user experience.
*   **Robust WebSocket Connection:** Implemented with heartbeat and reconnection logic for stable communication.
*   **Sleek User Interface:** Modern, compact, and dark-themed UI with glassmorphism effects and subtle animations for an enhanced user experience.

## Technologies Used

*   **React.js:** A JavaScript library for building user interfaces.
*   **CSS:** For styling, including custom variables, animations, and glassmorphism effects.
*   **Font Awesome:** For icons.
*   **Web Speech API:** For speech recognition and synthesis (though synthesis is currently disabled).
*   **WebSockets:** For real-time communication with the backend.

## Setup and Installation

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (comes with Node.js)

### 1. Navigate to the Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `client` directory:

#### `client/.env`

```
REACT_APP_SERVER_URL=http://localhost:4000
REACT_APP_WS_URL=ws://localhost:4000
REACT_APP_BACKEND_URL=http://localhost:4000
```

*   `REACT_APP_SERVER_URL`: The base URL for the client-side application.
*   `REACT_APP_WS_URL`: The WebSocket URL for connecting to the backend.
*   `REACT_APP_BACKEND_URL`: The base URL for API calls to the backend.

### 4. Run the Application

```bash
npm start
```

This will open the application in your browser at `http://localhost:3000`.

## Project Structure

```
client/
├── public/             # Static assets
├── src/                # React source code
│   ├── components/     # Reusable UI components (e.g., ResumeUploader, TranscriptDisplay)
│   ├── services/       # API and WebSocket communication logic
│   ├── App.js          # Main application component
│   ├── App.css         # Main application styles
│   └── index.css       # Global styles and CSS variables
└── package.json        # Frontend dependencies
```
