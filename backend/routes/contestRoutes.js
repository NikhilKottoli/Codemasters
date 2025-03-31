const express = require('express');
const router = express.Router();

const { isUserRegistered, registerContest, getContests, addContest, getContest,addQuestions } = require('../controllers/contestController');

// Get all contests
router.get('/', getContests);

// Get a contest by ID
router.get('/:id', getContest);

// Add a new contest
router.post('/', addContest);
router.put('/:id', addQuestions);
router.post("/:id", registerContest); //contest_reg
router.get("/:id/is-registered", isUserRegistered);

module.exports = router;// Export the router to use it in the main application