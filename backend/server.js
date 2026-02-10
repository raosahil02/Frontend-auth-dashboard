
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// SCHEMAS
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

// AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) { res.status(400).json({ msg: 'Token is invalid' }); }
};

// USER ROUTES
app.put('/api/users/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) { res.status(500).send('Server Error'); }
});

// TASK ROUTES
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/tasks', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description, userId: req.user.id });
    const task = await newTask.save();
    res.json(task);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();
    res.json(task);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.listen(process.env.PORT || 5000);
