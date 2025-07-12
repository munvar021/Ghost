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
  const currentAnswerRef = useRef(""); // Ref to accumulate streaming answer

  // WebSocket reconnection and heartbeat variables
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const reconnectDelay = useRef(1000); // Initial delay 1 second
  const heartbeatIntervalRef = useRef(null);
  const pingTimeoutRef = useRef(null);

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
        // Add a placeholder for the AI's answer immediately
        setTranscript((prev) => [...prev, { type: "answer", text: "" }]);
        currentAnswerRef.current = ""; // Reset current answer accumulator
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

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const ws = new WebSocket(process.env.REACT_APP_WS_URL);
    wsRef.current = ws;

    const heartbeat = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
        pingTimeoutRef.current = setTimeout(() => {
          console.warn("WebSocket ping timeout. Terminating connection.");
          ws.terminate();
        }, 5000); // 5 seconds to receive pong
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsWsConnected(true);
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      reconnectDelay.current = 1000; // Reset delay
      heartbeatIntervalRef.current = setInterval(heartbeat, 30000); // Send ping every 30 seconds
      if (resumeId) {
        startRecognitionRef.current();
      }
    };

    ws.onmessage = (event) => {
      clearTimeout(pingTimeoutRef.current);
      const data = JSON.parse(event.data);
      if (data.type === "pong") {
        // console.log("Received pong.");
        return;
      }

      if (data.answer !== undefined) {
        if (data.isFinal === false) {
          // Append chunk to the current answer
          currentAnswerRef.current += data.answer;
          setTranscript((prev) => {
            const newTranscript = [...prev];
            // Update the last item (which should be the AI's answer placeholder)
            newTranscript[newTranscript.length - 1] = {
              ...newTranscript[newTranscript.length - 1],
              text: currentAnswerRef.current,
            };
            return newTranscript;
          });
        } else if (data.isFinal === true) {
          // Final chunk received, speak the full answer
          // if (currentAnswerRef.current) {
          //   speakRef.current(currentAnswerRef.current);
          // }
          currentAnswerRef.current = ""; // Reset for next answer
        }
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
      clearInterval(heartbeatIntervalRef.current);
      clearTimeout(pingTimeoutRef.current);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWsConnected(false);
      clearInterval(heartbeatIntervalRef.current);
      clearTimeout(pingTimeoutRef.current);
      stopRecognition();

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay =
          reconnectDelay.current * Math.pow(2, reconnectAttempts.current - 1);
        reconnectDelay.current = Math.min(delay, 30000); // Cap delay at 30 seconds
        console.log(
          `Attempting to reconnect in ${
            reconnectDelay.current / 1000
          } seconds... (Attempt ${reconnectAttempts.current})`
        );
        setTimeout(connectWebSocket, reconnectDelay.current);
      } else {
        console.error(
          "Max reconnect attempts reached. Please refresh the page."
        );
        setTranscript((prev) => [
          ...prev,
          {
            type: "error",
            text: "Connection lost. Max reconnect attempts reached.",
          },
        ]);
      }
    };
  }, [resumeId, stopRecognition]);

  useEffect(() => {
    speakRef.current = speak;
    startRecognitionRef.current = startRecognition;
  }, [speak, startRecognition]);

  useEffect(() => {
    if (resumeId) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(heartbeatIntervalRef.current);
      clearTimeout(pingTimeoutRef.current);
      stopRecognition();
    };
  }, [resumeId, connectWebSocket, stopRecognition]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img
            src={`${process.env.PUBLIC_URL}/logo192.png`}
            className="App-logo"
            alt="logo"
          />
          <h1>Ghost</h1>
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
