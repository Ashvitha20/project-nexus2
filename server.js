const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const users = []; // In-memory "database" for simplicity

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    users.push(user);
    res.status(201).send('User registered');
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user) return res.status(404).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(403).send('Invalid credentials');

    const token = jwt.sign({ email: user.email }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
