const express = require('express');
const { executeTask, getTaskResultById,getSubmitbyId } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/', executeTask);
router.get('/:id', getTaskResultById);
router.get('/submit/:id', getSubmitbyId);

module.exports = router;
