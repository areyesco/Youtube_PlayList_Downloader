const express = require('express')
const port = 4000
const app = express()
const axios = require('axios')
const fs = require('fs')

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
let temporalVideos = []; // array with the videos from the playlist

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

    // json where the videos are stored with extra metadata
    let dataVideos = JSON.parse(fs.readFileSync('./videos.json'))

    //Populate the json with the videos for the first time
    if(dataVideos.length == 0 || undefined){
        fs.writeFileSync('./videos.json', JSON.stringify(temporalVideos))
    }

    
    //update the json with new videos
    // Checks the new added videos to the playlists and updates the json
    for(let i = 0; i < temporalVideos.length; i++){
        
        //if there is a video in temporal that is not in the json, then it is added to the json
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

    //Deletes videos from the json that have been removed from the temporal
    for(let i = 0; i < dataVideos.length; i++){
         //if there is a video in the json that is not in the temporal, then it must be removed from the json
        if(!(temporalVideos.find(v => v.videoId == dataVideos[i].videoId))){
            console.log("No longer existing video in the playlist with id: " + dataVideos[i].id);

            //filters out the video that was removed from the temporal playlist
            dataVideos = dataVideos.filter(v => v.id != dataVideos[i].id)

            fs.writeFileSync('./videos.json', JSON.stringify(dataVideos))
        }
    }

    console.log(temporalVideos);
    console.log(dataVideos);
})




app.listen(port, console.log("Running at port: " + port))