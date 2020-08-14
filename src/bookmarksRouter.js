const express = require('express');
const { v4: uuid } = require('uuid');

const bookmarks = require('./bookmarkStore');

const bookmarksRouter = express.Router();
const bodyParser = express.json()

bookmarksRouter // add logging to methods
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post( bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;
    const ratingNum = Number(rating)

    if(!title) {
      return res
        .status(400)
        .json({message: 'Title is required'})
    }

    if(!url) {
      return res
        .status(400)
        .json({message: 'URL is required'})
    }

    if(!description) {
      return res
        .status(400)
        .json({message: 'Description is required'})
    }

    if(!rating) {
      return res
        .status(400)
        .json({message: 'Rating is required'})
    }

    if(Number.isNaN(ratingNum)) {
      return res
        .status(400)
        .json({ message: 'Rating must be a number' })
    }

    // if(!(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(title))) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Please provide a valid URL' })
    // }

    const id = uuid()
    const newBookmark = {
      id,
      title,
      url,
      description,
      rating
    }

    bookmarks.push(newBookmark)

    res
      .status(201)
      .json(newBookmark)

  }) // complete URL validation

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;

    const bookmark = bookmarks.find(mark => mark.id === id)
    
    if(!bookmark) {
      return res
        .status(404)
        .json({message: 'Bookmark not found'})
    }

    res
      .status(200)
      .json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params
    
    const bookmarkIndex = bookmarks.findIndex(mark => mark.id === id);

    if(bookmarkIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Bookmark not found' })
    }

    bookmarks.splice(bookmarkIndex, 1)

    res
      .status(204)
      .end()

  })

module.exports = bookmarksRouter;
