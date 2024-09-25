const express = require('express');
const cors = require('cors');
const collegeRoutes = require('./routes/collegeRoutes');
const studentRoutes = require('./routes/studentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("hello")

// College routes
app.use('/api/colleges', collegeRoutes);

//student routes
app.use('/api/auth', studentRoutes); // Add this line
app.use('/api/review', reviewRoutes); // Add this line
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
