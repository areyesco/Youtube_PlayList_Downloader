const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const fs = require('fs')
const ytdl = require('ytdl-core')
const bodyParser = require('body-parser');

//require routes
const routerPlaylist = require('./routes/Playlist.route')
const routerDownloader = require('./routes/Downloader.route')


//Middlewares
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


//use of routes
app.use('/playlist',routerPlaylist)
app.use('/downloader',routerDownloader)


//listen to port
app.listen(port,()=>console.log(`Running on port: ${port}`))