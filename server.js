const express = require('express')
const port = 4000
const app = express()
const axios = require('axios')
const fs = require('fs')

// const {google} = require('googleapis')  not used since axios was implemented
// const youtube = google.youtube('v3')   not used since axios was implemented

const credentials = require('./credentials')

const PLAYLIST_ID = "PLaV6FKYP2zzHSbavzgd5TmK1dDoLALVIj"

let videos = [];

const getPlayListItems = async playListID => {
    const result = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems',{
        params:{
            part: 'id, snippet',
            playlistId: playListID,
            maxResults:100,
            key: credentials.API_KEY
        }
    });
    return result.data;
};
let counter = 1;
getPlayListItems(PLAYLIST_ID).then(data =>{
    data.items.forEach(element =>{
        videos.push({
            id: counter,
            videoId: element.snippet.resourceId.videoId,
            downloaded: false
        })
        counter++
    })

    console.log(videos);
    
})

//  youtube.playlistItems.list({
//     key: API_KEY,
//     part: 'id, snippet',
//     playlistId: PLAYLIST_ID
// }, async (err,results)=>{
//      videos = await results.data.items;
//     // console.log(err ? err.message : results.data.items);
// });



app.listen(port, console.log("Running at port: " + port))