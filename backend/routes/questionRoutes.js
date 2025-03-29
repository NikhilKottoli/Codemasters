const express = require('express');
const router = express.Router();

const { addQuestion,getAllQuestions,getQuestionById,getMcqs} = require('../controllers/questionsController');

// Get all questions title and some details
router.get('/', getAllQuestions);
router.get('/mcqs', getMcqs);

// Get full question by id
router.get('/:id', getQuestionById);


router.post('/', addQuestion);

module.exports = router;
