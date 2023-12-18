// Create web server

// Import express
const express = require('express');

// Create router
const router = express.Router();

// Import Comments model
const Comments = require('../models/comments');

// Import mongoose
const mongoose = require('mongoose');

// Import passport
const passport = require('passport');

// Import Post model
const Post = require('../models/post');

// Import User model
const User = require('../models/user');

// Import validate comments
const validateCommentInput = require('../validation/comments');

// @route   GET api/comments/test
// @desc    Test comments route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Comments works' }));

// @route   GET api/comments
// @desc    Get comments
// @access  Public
router.get('/', (req, res) => {
  Comments.find()
    .sort({ date: -1 })
    .then((comments) => res.json(comments))
    .catch((err) => res.status(404).json({ nocommentsfound: 'No comments found' }));
});

// @route   GET api/comments/:id
// @desc    Get comments by id
// @access  Public
router.get('/:id', (req, res) => {
  Comments.findById(req.params.id)
    .then((comments) => res.json(comments))
    .catch((err) =>
      res.status(404).json({ nocommentsfound: 'No comments found with that id' })
    );
});

// @route   POST api/comments
// @desc    Create comments
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors } = validateCommentInput(req.body);

    if (errors) {
      return res.status(400).json(errors);
    }

    const newComments = new Comments({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
      post: req.body.post,
    });

    newComments.save().then((comments) => res.json(comments));
  }
);

// @route   DELETE api/comments/:id
// @desc    Delete comments by id
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res)
