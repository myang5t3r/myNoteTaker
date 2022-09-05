const express = require('express');
const { fstat } = require('fs');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'))

///////////////         Routes for HTML         /////////////
// Home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

////////////////        Routes for API          //////////////

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (e, data) => {
        if (e) {
            console.log(e);
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
            console.log(notes);
        }
    })
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client, use a unique id when it saved;



app.listen(PORT, () => console.log(`App listing on port ${PORT}`));