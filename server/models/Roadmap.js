const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitle: { type: String, required: true },
  steps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    resource: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);

