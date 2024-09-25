const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assuming you have a database connection file
const router = express.Router();

// const JWT_SECRET = 'jivan'; // Use a strong secret key in production
const secretKey = "your_jwt_secret_key";

// Signup route
router.post("/signup", (req, res) => {
  console.log("hello")
  const { full_name, email, phone, password } = req.body;
  console.log(req.body)

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const sql = "INSERT INTO students (full_name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [full_name, email, phone, hashedPassword], (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "User registered successfully" });
  });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM students WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {

      return res.status(500).json({ message: "Database error"});
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

    console.log(user)

    res.status(200).json({ message: "User logged in successfully", token,studentID:user.student_id });
  });
});

// Token verification route
router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, secretKey);
    res.status(200).json({ isValid: true });
  } catch (err) {
    res.status(401).json({ isValid: false });
  }
});

module.exports = router;
