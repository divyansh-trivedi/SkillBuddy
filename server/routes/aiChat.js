const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      // Use Gemini API
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are SkillBuddy, an AI coding mentor. Answer this user's question about programming, courses, or technology briefly and helpfully: "${message}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return res.json({ response: text });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to simulated response if API fails
  }

  // Fallback / Simulated Response if API key is missing or error occurs
  const responses = [
    "That's a great question about technology!",
    "I'd recommend starting with the basics of React.",
    "Have you checked our course library for that topic?",
    "Practice is key to mastering any skill.",
    "Recursion can be tricky, try visualizing the stack.",
    "MongoDB is a powerful NoSQL database perfect for this project."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  let reply = randomResponse;
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    reply = "Hello! I'm your AI SkillBuddy. How can I help you learn today? (Note: Add GEMINI_API_KEY to server/.env for real AI responses)";
  } else if (lowerMsg.includes('react')) {
    reply = "React is a JavaScript library for building user interfaces. Check out our 'React Fundamentals' course!";
  }

  res.json({ response: reply });
});

module.exports = router;
