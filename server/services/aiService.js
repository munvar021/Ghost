const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIResponse = async (question, resumeText) => {
  try {
    const prompt = `You are an AI interview assistant. Answer the interviewer\'s question. If the question is related to the resume, use the provided resume for context. Otherwise, answer based on your general knowledge. Please format your answers using Markdown for readability (e.g., use headings, bullet points, bold text where appropriate).\n\nResume: ${resumeText}\n\nInterviewer\'s Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Google Generative AI API:", error);
    console.log("Falling back to OpenAI API...");

    try {
      const prompt = `You are an AI interview assistant. Answer the interviewer\'s question. If the question is related to the resume, use the provided resume for context. Otherwise, answer based on your general knowledge. Please format your answers using Markdown for readability (e.g., use headings, bullet points, bold text where appropriate).\n\nResume: ${resumeText}\n\nInterviewer\'s Question: ${question}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content;
    } catch (openaiError) {
      console.error("Error with OpenAI API:", openaiError);
      return "Error with both Google and OpenAI APIs.";
    }
  }
};
