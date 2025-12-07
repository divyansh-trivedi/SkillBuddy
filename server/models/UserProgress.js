const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseTitle: { type: String, required: true },
  completedLessons: [String]
}, { timestamps: true });

// Ensure one progress record per user per course
UserProgressSchema.index({ userId: 1, courseTitle: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);

