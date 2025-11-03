const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
// ... other requires (e.g., mongoose, body-parser, etc.)

// **IMPORTANT: Update 'https://your-vercel-frontend-url.vercel.app' with your ACTUAL Vercel URL later**
const allowedOrigins = [
  'http://localhost:3000', // For local frontend development
  'https://skillbuddy-frontend.onrender.com' // This will be your Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Ensure all methods your API uses are listed
  credentials: true // If your frontend sends cookies or authorization headers
}));

// ... Your database connection (MONGO_URI will come from Render's env vars)
// Example:
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error(err));

// ... Your API routes and other middleware
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000; // Render will provide the PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});