import React, { useState, useRef, useEffect, useCallback } from "react";
import { uploadResume } from "./services/api";
import ResumeUploader from "./components/ResumeUploader/ResumeUploader";
import TranscriptDisplay from "./components/TranscriptDisplay/TranscriptDisplay";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [resumeId, setResumeId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const recognitionRef = useRef(null);
  const wsRef = useRef(null);
  const speakRef = useRef();
  const startRecognitionRef = useRef();

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecognitionActive(false);
    }
  }, []);

  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file);
      setResumeId(response.data.resumeId);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const speak = useCallback(
    (text) => {
      console.log("Attempting to speak: ", text);
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        console.log("Speech synthesis started.");
        stopRecognition();
      };
      utterance.onend = () => {
        console.log("Speech synthesis ended.");
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          startRecognitionRef.current();
        }
      };
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
      };
      window.speechSynthesis.speak(utterance);
    },
    [stopRecognition]
  );

  const getAIResponse = useCallback(
    (question) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Sending question via WebSocket:", question);
        wsRef.current.send(JSON.stringify({ question, resumeId }));
      } else {
        console.error("WebSocket is not connected.");
        setTranscript((prev) => [
          ...prev,
          { type: "error", text: "Connection lost. Please refresh." },
        ]);
      }
    },
    [resumeId]
  );

  const startRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      stopRecognition();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Process single utterance
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Recognition started.");
      setIsRecognitionActive(true);
    };

    recognition.onresult = (event) => {
      const question =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Recognition result: ", question);
      setTranscript((prev) => [...prev, { type: "question", text: question }]);
      getAIResponse(question);
    };

    recognition.onend = () => {
      console.log("Recognition ended.");
      setIsRecognitionActive(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecognitionActive(false);
      if (
        event.error === "no-speech" &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("No speech detected, restarting recognition...");
        startRecognitionRef.current();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [getAIResponse, stopRecognition]);

  useEffect(() => {
    speakRef.current = speak;
    startRecognitionRef.current = startRecognition;
  }, [speak, startRecognition]);

  useEffect(() => {
    if (!resumeId) return;

    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsWsConnected(true);
      startRecognitionRef.current();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.answer) {
        setTranscript((prev) => [
          ...prev,
          { type: "answer", text: data.answer },
        ]);
        speakRef.current(data.answer);
      } else if (data.error) {
        console.error("WebSocket server error:", data.error);
        setTranscript((prev) => [
          ...prev,
          { type: "error", text: `Server error: ${data.error}` },
        ]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsWsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWsConnected(false);
      stopRecognition();
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopRecognition();
    };
  }, [resumeId, stopRecognition]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img
            src="https://static.vecteezy.com/system/resources/previews/048/847/814/non_2x/halloween-famine-ghost-logo-illustration-silhouette-design-black-and-white-vector.jpg"
            className="App-logo"
            alt="logo"
          />
          <h1>Ghost Candidate</h1>
        </div>
      </header>
      <main className={!resumeId ? "main-centered" : "main-compact"}>
        {!resumeId ? (
          <ResumeUploader onUpload={handleResumeUpload} />
        ) : (
          <>
            <TranscriptDisplay transcript={transcript} />
            <div className="controls">
              {isRecognitionActive && <p>Listening...</p>}
              {!isWsConnected && resumeId && <p>Connecting...</p>}
            </div>
          </>
        )}
      </main>
      {resumeId && (
        <button
          className="mic-button"
          onClick={() =>
            startRecognitionRef.current && startRecognitionRef.current()
          }
          disabled={!isWsConnected || isRecognitionActive}
          title={isWsConnected ? "Speak now" : "Connecting..."}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      )}
    </div>
  );
};

export default App;
