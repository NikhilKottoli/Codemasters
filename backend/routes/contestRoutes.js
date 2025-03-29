const express = require('express');
const router = express.Router();

const { getContests, addContest, getContest,addQuestions } = require('../controllers/contestController');

// Get all contests
router.get('/', getContests);

// Get a contest by ID
router.get('/:id', getContest);

// Add a new contest
router.post('/', addContest);
router.put('/:id', addQuestions);

module.exports = router;// Export the router to use it in the main application