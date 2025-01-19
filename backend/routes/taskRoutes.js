const express = require('express');
const { addTask, getTaskResultById } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/tasks', addTask);
router.get('/tasks/:id', getTaskResultById);

module.exports = router;
