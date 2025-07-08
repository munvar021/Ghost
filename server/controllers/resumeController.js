const pdf = require("pdf-parse");
const Resume = require("../models/resume");
const { getAIResponse } = require("../services/aiService");

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  try {
    const data = await pdf(req.file.buffer);
    const resume = new Resume({ text: data.text });
    await resume.save();
    res.send({ resumeId: resume._id, resumeText: resume.text });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).send({ message: "Error processing resume." });
  }
};

exports.handleWebSocketConnection = (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
      return;
    }

    const { question, resumeId } = parsedMessage;

    if (!question || !resumeId) {
      ws.send(JSON.stringify({ error: "Missing question or resume ID." }));
      return;
    }

    try {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        ws.send(JSON.stringify({ error: "Resume not found." }));
        return;
      }

      const cachedQA = resume.qaCache.find((qa) => qa.question === question);
      if (cachedQA) {
        console.log("Returning cached answer.");
        ws.send(JSON.stringify({ answer: cachedQA.answer, isFinal: true })); // Send cached answer as final
        return;
      }

      let fullAnswer = "";
      for await (const chunk of getAIResponse(question, resume.text)) {
        fullAnswer += chunk;
        ws.send(JSON.stringify({ answer: chunk, isFinal: false })); // Send each chunk
      }

      // After all chunks are received, send a final message to indicate completion
      ws.send(JSON.stringify({ answer: "", isFinal: true }));

      // Save the full answer to cache
      await Resume.findOneAndUpdate(
        { _id: resumeId },
        { $push: { qaCache: { question, answer: fullAnswer } } },
        { new: true }
      );

    } catch (error) {
      console.error("Error during WebSocket communication:", error);
      ws.send(JSON.stringify({ error: "An internal error occurred." }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
};