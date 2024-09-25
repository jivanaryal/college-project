const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path based on your project structure

// POST: Create a new review
router.post('/rate/:collegeId', (req, res) => {
    const { studentId, rating, comment } = req.body;
    const collegeId = req.params.collegeId;

    // Check if a review already exists for the given student and college
    const checkQuery = 'SELECT * FROM reviews WHERE student_id = ? AND college_id = ?';
    db.query(checkQuery, [studentId, collegeId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error checking existing review.', error });
        }

        if (results.length > 0) {
            // Review already exists
            return res.status(400).json({ message: 'You have already submitted a review for this college.' });
        }

        // If no review exists, proceed to insert the new review
        const insertQuery = 'INSERT INTO reviews (student_id, college_id, rating, comments) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [studentId, collegeId, rating, comment], (insertError, insertResults) => {
            if (insertError) {
                return res.status(500).json({ message: 'Failed to submit review.', insertError });
            }
            res.status(201).json({ message: 'Review submitted successfully!', reviewId: insertResults.insertId });
        });
    });
});

// GET: Get reviews for a specific college
router.get('/:collegeId', (req, res) => {
    const collegeId = req.params.collegeId;
    console.log(collegeId,"normal")

  const query = `
      SELECT reviews.*, students.full_name 
      FROM reviews 
      JOIN students ON reviews.student_id = students.student_id 
      WHERE college_id = ?`;
  db.query(query, [collegeId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to fetch reviews.', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this college.' });
    }

    res.status(200).json(results);
  });
});


// GET: Check if student has reviewed the college
router.get('/check/:collegeId/:studentId', (req, res) => {
    const { collegeId, studentId } = req.params;

    const query = 'SELECT * FROM reviews WHERE student_id = ? AND college_id = ?';
    db.query(query, [studentId, collegeId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error checking review.', error });
        }

        if (results.length > 0) {
            return res.json({ hasReviewed: true });
        } else {
            return res.json({ hasReviewed: false });
        }
    });
});

module.exports = router;
