const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const User = require('./Models/user');
const Message = require('./Models/message');

mongoose.connect('mongodb://127.0.0.1:27017//chat_app')
    .then((result) => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error in connecting MongoDB");
    });

app.use(bodyParser.json());


app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    user.status = 'AVAILABLE';
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'HIREQUOTIENT', { expiresIn: '1h' });
    res.status(200).json({ token });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    user.status = 'OFFLINE';
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/sendMessage', async (req, res) => {
  try {
    const { message, receiverID } = req.body;

    const recipient = await User.findById(receiverID);
    if (recipient.status === 'BUSY') {
      const response = await getLLMResponse(message);
      return res.status(200).json({ message: response });
    }

    const newMessage = new Message({ message, userId: req.user.userId });
    await newMessage.save();

    io.to(receiverID).emit('chat message', newMessage);
    res.status(200).json({ message: 'Message sent successfully' });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    const userId = socket.userId;
    if (userId) {
      const user = User.findById(userId);
      user.status = 'OFFLINE';
      user.save();
    }
  });

  socket.on('setUserId', (userId) => {
    socket.userId = userId;
  });
});

async function getLLMResponse(prompt) {
  return new Promise((resolve) => {
    const timeout = Math.random() * (10000 - 5000) + 5000;
    setTimeout(() => {
      resolve('This is a mock response from the LLM based on user input');
    }, timeout);
  });
}


server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
