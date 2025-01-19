const express = require('express');
const { addTask, getTaskResultById } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/submit', addTask);
router.get('/tasks/:id', getTaskResultById);
router.post('/run', addTask);

module.exports = router;
