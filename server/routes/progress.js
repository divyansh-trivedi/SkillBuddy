const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

// Get all progress for user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.id });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress
router.get('/:courseTitle', auth, async (req, res) => {
  try {
    const courseTitle = decodeURIComponent(req.params.courseTitle);
    const progress = await UserProgress.findOne({ 
      userId: req.user.id, 
      courseTitle: courseTitle 
    });
    
    if (!progress) return res.json({});
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update progress (start course or update steps)
router.put('/:courseTitle', auth, async (req, res) => {
  try {
    const courseTitle = decodeURIComponent(req.params.courseTitle);
    const { completedLessons } = req.body;

    let progress = await UserProgress.findOne({ 
      userId: req.user.id, 
      courseTitle: courseTitle 
    });

    if (progress) {
      progress.completedLessons = completedLessons;
      await progress.save();
    } else {
      progress = new UserProgress({
        userId: req.user.id,
        courseTitle: courseTitle,
        completedLessons: completedLessons
      });
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

