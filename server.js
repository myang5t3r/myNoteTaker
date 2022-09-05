const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'))

// Routes
// Home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.listen(PORT, () => console.log(`App listing on port ${PORT}`));