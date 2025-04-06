require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const contestRoutes = require('./routes/contestRoutes');
const polygonRoutes = require('./routes/polygonRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send-changes', (content) => {
    // console.log('Received changes:', content);
    socket.broadcast.emit('receive-changes', content);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Express routes
app.use('/task', taskRoutes);
app.use('/user', userRoutes);
app.use('/question', questionRoutes);
app.use('/contests', contestRoutes);
app.use('/polygon', polygonRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
