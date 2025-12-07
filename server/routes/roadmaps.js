const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');

// Get roadmap by course title
router.get('/:courseTitle', async (req, res) => {
  try {
    const courseTitle = decodeURIComponent(req.params.courseTitle);
    const roadmap = await Roadmap.findOne({ courseTitle: courseTitle });
    
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found for this course' });
    }
    
    res.json(roadmap.steps); // Return steps array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

