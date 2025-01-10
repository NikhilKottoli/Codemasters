const express = require('express');
const { addTask, getTasks } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/test', addTask);
router.get('/tasks', getTasks);

module.exports = router;
