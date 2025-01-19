// logger.js
const winston = require('winston');

// Define the log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps
    winston.format.colorize(),  // Add colors (for console logs)
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log all levels to a file
  ],
});

module.exports = logger;
