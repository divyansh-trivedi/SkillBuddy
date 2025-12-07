require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow all origins for now, or configure as needed

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbuddy';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const courseRoutes = require('./routes/courses');
const quizRoutes = require('./routes/quizzes');
const roadmapRoutes = require('./routes/roadmaps');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const aiChatRoutes = require('./routes/aiChat');

app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('SkillBuddy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
