const express = require('express');
const router = express.Router();

const { addQuestion,getAllQuestions,getQuestionById } = require('../controllers/questionsController');

// Get all questions title and some details
router.get('/', getAllQuestions);

// Get full question by id
router.get('/:id', getQuestionById);


router.post('/', addQuestion);

module.exports = router;
