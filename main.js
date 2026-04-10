require('dotenv').config();
const express = require('express');
const cors = require('cors');

const AuthenticationService = require('./endpoint/auth');
const ProfileService = require('./endpoint/profile');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Quick Quest Express gateway aktif.',
  });
});

app.use('/api', AuthenticationService());
app.use('/api', ProfileService());

const PORT = process.env.PORT || 4450;
app.listen(PORT, () => {
  console.log(`Express gateway running on http://localhost:${PORT}`);
});
