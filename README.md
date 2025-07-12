# Ghost

![Ghost Preview](https://res.cloudinary.com/dnkjgw2ti/image/upload/v1752301354/Screenshot_2025-07-12_at_11.51.18_dmzxxw.png)

## AI-Powered Interview Assistant

Ghost is an interactive AI interview assistant designed to help users practice and prepare for job interviews. Users can upload their resumes, and the AI will ask relevant questions based on the resume content or general knowledge. The application features real-time communication, speech recognition for user input, and AI-generated responses, providing a dynamic and engaging interview simulation experience.

## Features

*   **Resume Upload:** Securely upload your resume (PDF format) to provide context for the AI.
*   **AI-Powered Interview Questions:** The AI generates interview questions based on your resume content or general interview best practices.
*   **Real-time Interaction:** Engage in a live interview simulation with the AI.
*   **Speech Recognition:** Speak your answers naturally, and the application will transcribe them.
*   **AI Response Streaming:** AI answers are streamed in real-time, reducing perceived latency and improving user experience.
*   **Intelligent Caching:** Frequently asked questions and their answers are cached to provide faster responses and reduce API calls.
*   **Robust WebSocket Connection:** Implemented with heartbeat and reconnection logic for stable communication.
*   **Sleek User Interface:** Modern, compact, and dark-themed UI with glassmorphism effects and subtle animations for an enhanced user experience.

## Technologies Used

### Frontend (Client)

*   **React.js:** A JavaScript library for building user interfaces.
*   **CSS:** For styling, including custom variables, animations, and glassmorphism effects.
*   **Font Awesome:** For icons.
*   **Web Speech API:** For speech recognition and synthesis (though synthesis is currently disabled).
*   **WebSockets:** For real-time communication with the backend.

### Backend (Server)

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

Follow these steps to get Ghost up and running on your local machine.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (comes with Node.js)
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ghost-candidate.git
cd ghost-candidate
```

### 2. Install Dependencies

Navigate into both the `client` and `server` directories and install their respective dependencies.

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Configure Environment Variables

Create `.env` files in both the `client` and `server` directories.

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

#### Start the Backend Server

From the `server` directory:

```bash
npm start
# Or, if you have nodemon installed for automatic restarts:
# nodemon server.js
```

The server should start on `http://localhost:4000` (or your specified port). You should see a "MongoDB connected" message in the console.

#### Start the Frontend Client

From the `client` directory:

```bash
npm start
```

This will open the application in your browser at `http://localhost:3000`.

## Usage

1.  **Upload Resume:** On the landing page, click the "Upload Resume" button and select your PDF resume.
2.  **Start Interview:** Once the resume is processed, the AI will begin asking questions.
3.  **Speak Your Answers:** Click the microphone button and speak your answers. The application will transcribe your speech and send it to the AI.
4.  **Receive AI Feedback:** The AI will respond in real-time, providing a dynamic interview experience.

## Project Structure

```
ghost-candidate/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable UI components (e.g., ResumeUploader, TranscriptDisplay)
│   │   ├── services/       # API and WebSocket communication logic
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Main application styles
│   │   └── index.css       # Global styles and CSS variables
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers and WebSocket logic
│   ├── models/             # Mongoose schemas for MongoDB
│   ├── routes/             # API routes
│   ├── services/           # AI integration logic
│   ├── server.js           # Main server entry point
│   └── package.json        # Backend dependencies
└── README.md               # Project README file
```

## Future Enhancements

*   **User Authentication:** Implement user login and registration.
*   **Interview History:** Allow users to review past interview sessions.
*   **Performance Analytics:** Provide detailed feedback on interview performance (e.g., common keywords, speaking pace).
*   **More AI Models:** Integrate with other AI models for diverse interview styles.
*   **Customizable Interview Topics:** Allow users to select specific topics or roles for the interview.
*   **Text-based Input Option:** Provide an alternative for users who prefer typing their answers.
*   **Improved Error Handling:** More robust and user-friendly error messages.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
