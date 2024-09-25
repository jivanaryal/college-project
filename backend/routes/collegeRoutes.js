const express = require('express');
const db = require('../db');
const multer = require('multer');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Create a new college
router.post('/add', upload.single('photo'), (req, res) => {
    // console.log(req.body)
  const { name, address, city, courses } = req.body;
  const photo = req.file ? req.file.filename : null;
  
  const sql = 'INSERT INTO college (name, address, city, courses, photos) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, address, city, courses, photo], (err, result) => {
    if (err) {
      return res.status(500).send('Failed to add college');
    }
    res.status(200).send('College added successfully');
  });
});

// Get all colleges
router.get('/all', (req, res) => {
  const sql = `
   SELECT c.id, c.name, c.address, c.city, c.courses, c.photos,
       AVG(r.rating) AS avg_rating, COUNT(r.rating) AS review_count
FROM college c
LEFT JOIN reviews r ON c.id = r.college_id
GROUP BY c.id
ORDER BY avg_rating DESC
LIMIT 0, 1000;

  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Failed to fetch colleges with reviews');
    }
    res.json(results);
  });
});


router.get('/single/:id', (req, res) => {
  // console.log("hello")
  const { id } = req.params;
  // console.log(id)
  
  // Fetch college details
  const sqlCollege = 'SELECT * FROM college WHERE id = ?';
  db.query(sqlCollege, [id], (err, collegeResults) => {
    if (err || collegeResults.length === 0) {
      return res.status(500).send('Failed to fetch college details');
    }

    
      res.json({
        college: collegeResults[0],
      });
    });
  });

// Update college
router.put('/update/:id', upload.single('photo'), (req, res) => {
  const { name, address, city, courses } = req.body;
  const { id } = req.params;
  const photo = req.file ? req.file.filename : null;

  let sql = 'UPDATE college SET name = ?, address = ?, city = ?, courses = ?';
  const params = [name, address, city, courses];

  if (photo) {
    sql += ', photos = ?';
    params.push(photo);
  }
  
  sql += ' WHERE id = ?';
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).send('Failed to update college');
    }
    res.status(200).send('College updated successfully');
  });
});

// Delete college
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM college WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Failed to delete college');
    }
    res.status(200).send('College deleted successfully');
  });
});

module.exports = router;
