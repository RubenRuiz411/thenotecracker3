const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const uniqid = require('uniqid');

app.use(express.static('public'));
app.use(express.json()),

app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err,data) =>{
        res.send(data)
    })
});

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

app.delete('/api/notes/:id', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err,data) =>{
        const notes = JSON.parse(data)
        const filterednotes = notes.filter(note => note.id !== req.params.id)
        fs.writeFile('./db/db.json', JSON.stringify(filterednotes), (err,data) =>{
        res.send(200)
        })
    })
});


app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
