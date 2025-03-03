require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');

const io = require('socket.io')(8080, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send-changes', (content) => {
    // console.log('Received changes:', content);
    socket.broadcast.emit('receive-changes', content);});

  socket.on('disconnect', () => {console.log('User disconnected');});
});


const supabase = require('./supabase')
const { client } = require('./redisClient');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(cookieParser());

app.use('/task', taskRoutes);
app.use('/user',userRoutes);
app.use('/question',questionRoutes)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
