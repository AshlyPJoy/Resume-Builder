const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoute.js');
const resumeRoutes = require('./routes/resumeRoute.js');
const aiRoutes = require('./routes/aiRoute.js');
const connectDB = require('./config/db.js');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});