const express = require('express');
const { Submit, getTaskResultById, runTask } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/submit', Submit);
router.get('/:id', getTaskResultById);
router.post('/run', runTask);

module.exports = router;
