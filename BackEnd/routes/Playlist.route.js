const router = require('express').Router()
const fs = require('fs')

//returns all of the playlists in playlist.json
router.get('/obtain', (req,res)=>{
    let playlists = fs.readFileSync('./playlist.json')
    res.send(JSON.parse(playlists));
})

//uploads a playlist to the playlist.json
router.post('/upload',(req,res)=>{
    let playlists = fs.readFileSync('./playlist.json')
    playlists = JSON.parse(playlists);

    //If the playlist hasnt been uploaded
    if(playlists.find((playlist)=> playlist.id == req.body.id) == undefined){
        //push the playlist in the request
        playlists.push(req.body)
        //rewrite the playlist.json
        fs.writeFileSync('./playlist.json',JSON.stringify(playlists))

        return res.status(200).send("Playlist uploaded")
    }
    //if the playlist has been already uploaded
    else{
        return res.status(400).send("Playlist already uploaded")
    }

    
})

module.exports = router;