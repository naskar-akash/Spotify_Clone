# Spotify Clone
This is a simple clone of Spotify Music App using HTML, CSS and Java Script. Though the title suggests that it is a clone of Spotifi app, but certain changes have been made here.

## Features
- Play-pause button
- Back or forward buttons and seperate volume controller
- Playlist UI
- Shows your albums in card like structures
- Responsive design
## Tech Stack
- HTML
- CSS
- JS
## How to run
Open 'index.html' in your browser to view this app.
## Issues
While uploading this project into Github, the 'songs' album which contains all the songs and cover picture for all collections, has been pushed into '.gitignore' file. 
So when the app is opened in browser there will no collection of songs. 
## Resolving Issues
- Have to create 'songs/collection-1', 'songs/collection-2' etc folders.
- Inside those 'collection' folders the songs have to be saved as 'song.mp3' to get the songs.
- Seperate cover pictures for each collections are added as 'cover.jpg' inside 'songs/collection' folders.
- An 'info.json' file should have to be added to each collection. The file should contain date in the following format ---
  {
  "title": "collection title",
  "description": "Description for collection"
  }
  # Screenshots
  ![Home Page](https://github.com/naskar-akash/Spotify_Clone/issues/1#issue-3221779166)
