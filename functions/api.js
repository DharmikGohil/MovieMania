const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Import your routes
const indexRouter = require('../routes/index');
// Import other routes as needed

// Use your routes
app.use('/', indexRouter);
// Use other routes as needed

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("Sorry, can't find that!");
});

module.exports.handler = serverless(app);