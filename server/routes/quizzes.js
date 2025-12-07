const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all quizzes (just course titles/Ids)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'courseTitle courseId');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz by course title
router.get('/:courseTitle', async (req, res) => {
  try {
    // Decode URI component just in case, though Express usually handles it
    const courseTitle = decodeURIComponent(req.params.courseTitle);
    const quiz = await Quiz.findOne({ courseTitle: courseTitle });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this course' });
    }
    
    res.json(quiz.questions); // Return just questions to match previous frontend expectation, or return full object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
