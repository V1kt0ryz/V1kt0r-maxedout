const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the "artists" directory
app.use('/artists', express.static(path.join(__dirname, 'artists')));

// Serve static files from the root directory (for index.html and artist.html)
app.use(express.static(__dirname));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the artist.html file for the /artist route
app.get('/artist', (req, res) => {
    res.sendFile(path.join(__dirname, 'artist.html'));
});

// Endpoint to get the list of artists
app.get('/artists', (req, res) => {
    const artistsDir = path.join(__dirname, 'artists');
    let artists = [];

    fs.readdir(artistsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }

        files.forEach((artist) => {
            const artistPath = path.join(artistsDir, artist);
            if (fs.lstatSync(artistPath).isDirectory()) {
                artists.push(artist);
            }
        });

        res.json(artists);
    });
});

// Endpoint to get the list of songs for a specific artist
app.get('/songs/:artist', (req, res) => {
    const artist = req.params.artist;
    const artistDir = path.join(__dirname, 'artists', artist);

    fs.readdir(artistDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }

        const songs = files
            .filter(file => file.endsWith('.mp3'))
            .map(song => ({
                name: song,
                path: `/artists/${artist}/${song}`
            }));

        res.json(songs);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});