# AI Interview Assistant

## Project Overview

![AI Interview Assistant Preview](./preview.png)
*Note: Please replace `preview.png` with an actual screenshot of the application.*

The AI Interview Assistant is a full-stack application designed to help users practice and prepare for job interviews. It allows users to upload their resume (PDF), after which an AI-powered interviewer asks questions and provides answers based on the resume content and general knowledge. The application features a conversational interface with speech-to-text for user questions and text-to-speech for AI responses, along with a real-time transcript display.

## Features

*   **Resume Upload:** Upload PDF resumes to provide context for AI-generated questions and answers.
*   **AI-Powered Interviewer:** Utilizes Google Generative AI (Gemini 1.5 Flash) to simulate an interview experience.
*   **Speech-to-Text:** Converts user's spoken questions into text for AI processing.
*   **Text-to-Speech:** Converts AI's text answers into natural-sounding speech.
*   **Real-time Transcript:** Displays a live transcript of the conversation between the user and the AI.
*   **Responsive UI:** A sleek and intuitive user interface that adapts to various screen sizes.

## Technologies Used

### Frontend (Client)

*   **React.js:** A JavaScript library for building user interfaces.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **Web Speech API:** For speech recognition and synthesis.
*   **React Markdown:** For rendering Markdown content in AI answers.
*   **Font Awesome:** For icons.
*   **CSS:** For styling, including responsive design.

### Backend (Server)

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **Multer:** Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **pdf-parse:** A library to extract text from PDF files.
*   **@google/generative-ai:** Official Google Generative AI SDK for interacting with Gemini models.
*   **CORS:** Middleware to enable Cross-Origin Resource Sharing.
*   **Dotenv:** For loading environment variables from a `.env` file.
*   **Nodemon:** A tool that helps develop Node.js applications by automatically restarting the node application when file changes in the directory are detected.

## Setup Instructions

To set up and run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ai-interview-assistant
```

### 2. Backend Setup

Navigate to the `server` directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory and add your Google API Key:

```
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

You can obtain a Google API Key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

Start the backend server:

```bash
npm start
```

The server will run on `http://localhost:4000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `client` directory:

```bash
cd ../client
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm start
```

The client application will open in your browser at `http://localhost:3000`.

## Usage

1.  **Upload Resume:** On the home page, click "Upload Resume" and select a PDF file.
2.  **Start Interview:** Once the resume is processed, the microphone button will appear. Click it to start the interview.
3.  **Ask Questions:** Speak your interview questions clearly. The application will transcribe your question and send it to the AI.
4.  **Receive Answers:** The AI will process your question (using your resume for context if relevant) and respond verbally and in the transcript.
5.  **Continue Conversation:** The microphone will automatically reactivate after the AI finishes speaking, allowing for a continuous conversation.

## Preview

![AI Interview Assistant Preview](./preview.png)
*Note: Please replace `preview.png` with an actual screenshot of the application.*