const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set up database connection
const connection = mysql.createConnection(db);
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Set up passport
passport.use(
  new LocalStrategy((username, password, done) => {
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) return done(err);
        if (results.length === 0)
          return done(null, false, { message: 'Incorrect username.' });
        if (results[0].password !== password)
          return done(null, false, { message: 'Incorrect password.' });
        return done(null, results[0]);
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return done(err);
      done(null, results[0]);
    }
  );
});

// Set up routes
app.use('/users', userRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
