const express = require('express');
const { v4: uuid } = require('uuid');

const bookmarks = require('./bookmarkStore');
const logger = require('./logger.js');

const bookmarksRouter = express.Router();
const bodyParser = express.json();
const isUrl = require('is-valid-http-url');

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;
    const ratingNum = Number(rating);

    if (!title) {
      logger.error(`Title is required.`);
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!url) {
      logger.error(`URL is required.`);
      return res.status(400).json({ message: 'URL is required' });
    }

    if (!description) {
      logger.error(`Description is required.`);
      return res.status(400).json({ message: 'Description is required' });
    }

    if (!rating) {
      logger.error(`Rating is required.`);
      return res.status(400).json({ message: 'Rating is required' });
    }

    if (Number.isNaN(ratingNum)) {
      logger.error(`Rating must be a number. Received ${rating}`);
      return res.status(400).json({ message: 'Rating must be a number' });
    }
    if (!isUrl(url)) {
      logger.error(`Invalid URL. Received ${url}`);
      return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    const id = uuid();
    const newBookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(newBookmark);

    logger.info(`New bookmark added. ${newBookmark.id}`);

    res.status(201).json(newBookmark);
  });

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;

    const bookmark = bookmarks.find((mark) => mark.id === id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((mark) => mark.id === id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
