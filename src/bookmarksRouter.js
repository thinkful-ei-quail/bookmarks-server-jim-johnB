const express = require('express');

const bookmarksRouter = express.Router();

bookmarksRouter.get('/', (req, res) => {
  res.send('Hello, world!');
});

module.exports = bookmarksRouter;
