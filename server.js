const express = require('express')
const port = 4000
const app = express()
const axios = require('axios')
const fs = require('fs')

const videosDB = require('./videos.json')
const credentials = require('./credentials')

const PLAYLIST_ID = "PLaV6FKYP2zzHSbavzgd5TmK1dDoLALVIj"



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
let temporalVideos = [];

getPlayListItems(PLAYLIST_ID).then(data =>{

    
    data.items.forEach(element =>{
        
        //Push every video to the temporalVideos array
        temporalVideos.push({
            id: counter,
            videoId: element.snippet.resourceId.videoId,
            downloaded: false
        })
        counter++
    })


    let dataVideos = JSON.parse(fs.readFileSync('./videos.json'))

    //Populate the json with the videos for the first time
    if(dataVideos.length == 0 || undefined){
        fs.writeFileSync('./videos.json', JSON.stringify(temporalVideos))
    }

    
    //update the json with new videos
    // Checks the new added videos to the playlists and updates the json
    for(let i = 0; i < temporalVideos.length; i++){
        
        if(dataVideos.find(v =>v.videoId == temporalVideos[i].videoId) == undefined){
            
            console.log("Video not included with the id : " + temporalVideos[i].id);
            dataVideos.push({
                id: dataVideos[dataVideos.length-1].id + 1,
                videoId: temporalVideos[i].videoId,
                downloaded: false
            })
            fs.writeFileSync('./videos.json', JSON.stringify(dataVideos))
        }
    }


    console.log(dataVideos);
    // console.log(dataVideos.find(v =>v.videoId == '_SvXQ7k4VXM') != undefined);    
})




app.listen(port, console.log("Running at port: " + port))