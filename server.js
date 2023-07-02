// added expressjs
const express = require('express');
// allows ability to read/write to filesystem
const fs = require('fs');
// adjusted dynamic port so this site works in heroku
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
// allows ability to use the uniqid package
const uniqid = require('uniqid');
// allows the usage of puglic folder files like stylesheet 
app.use(express.static('public'));
app.use(express.json()),
// reads notes html file
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});
// reads existing notes /saved notes in db file and returns them to html
app.get('/api/notes', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err,data) =>{
        res.send(data)
    })
});
// post route allows reading of the file and assigns each note an ID which routes to db.json and creates an array of notes with an ID
app.post('/api/notes', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err,data) =>{
        const note = req.body
        note.id = uniqid()
        const notes = JSON.parse(data)
        notes.push(note)
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err,data) =>{
        res.send(200)
        })
    })
});
// allows ability to delete notes
app.delete('/api/notes/:id', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err,data) =>{
        const notes = JSON.parse(data)
        const filterednotes = notes.filter(note => note.id !== req.params.id)
        fs.writeFile('./db/db.json', JSON.stringify(filterednotes), (err,data) =>{
        res.send(200)
        })
    })
});

// returns html file
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
