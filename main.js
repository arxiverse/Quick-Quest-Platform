require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({ message: "Nothing to see here" });
});

// Controllers
const AuthenticationService = require('./controllers/auth')();

// Routes
app.use('/auth', AuthenticationService);

const PORT = process.env.PORT || 4450;
app.listen(PORT, () => {
    console.log("Running")
})