const express = require('express');
const passport = require('passport');
const router = express.Router();
const connection = require('../config/db');

// Register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    }
  );
});

// Log in a user
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Log out a user
router.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

// Get a specific user by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    connection.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, results) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.json(results[0]);
      }
    );
  });
  
  // Update a user by ID
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    connection.query(
      'UPDATE users SET username = ?, password = ? WHERE id = ?',
      [username, password, id],
      (err, results) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      }
    );
  });
  
  // Delete a user by ID
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query(
      'DELETE FROM users WHERE id = ?',
      [id],
      (err, results) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      }
    );
  });
  
  module.exports = router;
  