const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitle: { type: String, required: true }, // For easier lookup by name
  questions: [{
    type: { type: String, required: true }, // 'multiple-choice', 'true-false', 'short-answer'
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    explanation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);

