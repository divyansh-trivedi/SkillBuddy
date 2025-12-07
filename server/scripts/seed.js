require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbuddy';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function seedData() {
  try {
    console.log('Starting seed process...');

    // 1. Get Courses from server/data/courses.json
    const coursesPath = path.join(__dirname, '../data/courses.json');
    let courses = [];
    
    if (fs.existsSync(coursesPath)) {
        const coursesContent = fs.readFileSync(coursesPath, 'utf8');
        courses = JSON.parse(coursesContent);
        console.log(`Loaded ${courses.length} courses from courses.json`);
    } else {
        // Fallback or Error
        console.error("courses.json not found. Please run backup script or ensure data exists.");
        // Try reading from CourseLibrary.jsx if it still had data (it doesn't now)
        // So we rely on courses.json
    }

    // 2. Get Quizzes
    const quizzesPath = path.join(__dirname, '../../client/src/pages/quizzes.js');
    let quizzesContent = fs.readFileSync(quizzesPath, 'utf8');
    // Remove export and evaluate
    quizzesContent = quizzesContent.replace('export const quizzes =', 'const quizzes =');
    const getQuizzes = new Function(quizzesContent + '; return quizzes;');
    const quizzesData = getQuizzes();
    console.log(`Found quizzes for ${Object.keys(quizzesData).length} topics.`);

    // 3. Get Roadmaps
    const roadmapsPath = path.join(__dirname, '../../client/src/pages/roadmaps.js');
    let roadmapsContent = fs.readFileSync(roadmapsPath, 'utf8');
    roadmapsContent = roadmapsContent.replace('export const roadmaps =', 'const roadmaps =');
    const getRoadmaps = new Function(roadmapsContent + '; return roadmaps;');
    const roadmapsData = getRoadmaps();
    console.log(`Found roadmaps for ${Object.keys(roadmapsData).length} topics.`);

    // Clear DB
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    await Roadmap.deleteMany({});
    console.log('Cleared existing data.');

    // Insert Data
    const processedTitles = new Set();

    for (const courseData of courses) {
      if (processedTitles.has(courseData.title)) {
        console.log(`Skipping duplicate course: ${courseData.title}`);
        continue;
      }
      processedTitles.add(courseData.title);

      // Create Course
      const course = await Course.create(courseData);
      
      // Create Quiz
      if (quizzesData[course.title]) {
        await Quiz.create({
          courseId: course._id,
          courseTitle: course.title,
          questions: quizzesData[course.title]
        });
      }

      // Create Roadmap
      if (roadmapsData[course.title]) {
        await Roadmap.create({
          courseId: course._id,
          courseTitle: course.title,
          steps: roadmapsData[course.title]
        });
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

