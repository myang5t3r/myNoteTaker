const express = require('express');
const { fstat } = require('fs');
const fs = require('fs');
const path = require('path');
const suid = require('short-unique-id');

const PORT = process.env.PORT || 3001;

const app = express();
// Must add middleware so we can handle request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

///////////////         Routes for HTML         /////////////

// /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Home page
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

////////////////        Routes for API          //////////////

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (e, data) => {
        if (e) {
            console.log(e);
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
            // console.log(notes);
        }
    })
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client, use a unique id when it saved;

app.post('/api/notes', (req, res) => {
    // let client know that the post was received
    res.json(`${req.method} request was received`)
    
    // Lets create an unique id
    const uid = new suid();
    // Destructure response body
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uid()
    }

    console.log(JSON.stringify(newNote));
    fs.readFile('./db/db.json', (e,data) => {
    if (e) {
        console.log(e);
    }
    else{
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), e => e ? console.log(e) : console.log(`Notes updated`))        
    }
   }) 
})

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

app.delete('/api/notes/:id', (req, res) => {
    // let client know that the post was received
    res.json(`${req.method} request was received`);

    // Create empty array to push only items that have not been deleted
    const persData = [];
    fs.readFile('./db/db.json', 'utf8', (e, data) => {
        if (e) {
            console.log(e);
        } else {
            const notes = JSON.parse(data);
            // Loop through array and delete element if the id mataches the request parameter
            notes.forEach(element => {
                // console.log(element.id)
                if (element.id !== req.params.id){
                    persData.push(element);
                }
            });
        }
        // Now write to database
        fs.writeFile('./db/db.json', JSON.stringify(persData), e => e ? console.log(e) : console.log(`Notes updated`))   
    })
})


app.listen(PORT, () => console.log(`App listing on port ${PORT}`));