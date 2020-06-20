const axios = require('axios')
const Song = require('../models/Song')
const credentials = require('../credentials')

const PLAYLIST_ID = "PLaV6FKYP2zzFny7QdoCEUSqwb5MQpdrbf"
const PLAYLIST_NAME = 'Soul Disco'
// PLaV6FKYP2zzE5qjtiAXZiCej2BD3EJGn_ test
// PLaV6FKYP2zzFq2rGgY_zZIdSiovKxrP_m test2
// PLaV6FKYP2zzHSbavzgd5TmK1dDoLALVIj mixes
// PLaV6FKYP2zzFny7QdoCEUSqwb5MQpdrbf  soul Disco

//Update the json of playlists with the id and the name
UpdatePlaylistJson(PLAYLIST_ID, PLAYLIST_NAME)



//obtain the songs of the playlist via axios
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



//manipulate the songs: Store them in Mongo and download them
getPlayListItems(PLAYLIST_ID).then( async(data) =>{

    //Add the songs to the DB
    let videos = await Song.getAllVideos()
    console.log("Songs to be downloaded from the playlist provided: " + data.items.length);
    if(true){
        
        for(let i = 0; i < data.items.length; i++){
            await Song.createVideo({
                videoId: data.items[i].snippet.resourceId.videoId,
                title: data.items[i].snippet.title,
                downloaded: false,
                playlistId: PLAYLIST_ID
            });
        }
        
    }
    else{
        //calls function to download videos
        // await downloadVideos()
    }

   
    await downloadVideos()
})



async function downloadVideos(){
    try {
        let urlYoutube = 'https://www.youtube.com/watch?v='
        let dataVideos = await Song.getAllVideos()
        let title = 'audio'
        let counter = 0;

        //find the name of the playlist in the json
        let playlists = JSON.parse(fs.readFileSync('../playlist.json'))
        let playlistName = playlists.find(p=> p.id == PLAYLIST_ID)

        //create directory if it doesnt exist
        let folderPlaylist = `C:/Users/Alponcho/Music/Canciones/YoutubeDownloads/${playlistName.name}`
        if(!fs.existsSync(folderPlaylist)){
            fs.mkdirSync(folderPlaylist);
        }

        //obtains the number of videos to be downloaded
        let videosToDownload = getVideosToDownloadByPlaylist(dataVideos, PLAYLIST_ID)
        console.log("VideosToDownload: " + videosToDownload);

        for(let i = 0; i < dataVideos.length; i++){
            // if the song has not been downloaded
            if(dataVideos[i].downloaded == false && dataVideos[i].playlistId == PLAYLIST_ID){
 
                console.log("Initiating download for: " + dataVideos[i].title);
                let url = urlYoutube + dataVideos[i].videoId

                await ytdl.getBasicInfo(url,{
                    format: 'mp4',
                }, (err, info)=>{
                    title = info.player_response.videoDetails.title;
                });
                
                //deletes chars that are not permitted in a windows route destination name
                title = deleteForbiddenChars(title);

                let fileDestination = folderPlaylist + '/' + title + '.mp3'
                let writable = fs.createWriteStream(fileDestination);
    
                 let readable = await ytdl(url,{
                    format: 'mp3',
                    filter: 'audioonly'
                }) //.pipe(writable)
                
    
               readable.on('data',(chunk)=>{
                    // console.log(`Received ${chunk.length} bytes of data.`);
                    writable.write(chunk);
                })
    
               readable.on('end', ()=>{
                    // console.log('There will be no more data.');
                    writable.end();
                })
    
                writable.on('finish', async ()=>{
                    console.log("Done downloading: " + dataVideos[i].title);
                    counter++
                    
                    
                    //exits process when all of the videos are done being downloaded
                    if(counter == videosToDownload){
                            
                       await Song.updateVideosToDownloaded(PLAYLIST_ID)

                        process.exit()
                    }
                });
                
            }
            //if the song is not from the selected playlist
            else if(dataVideos[i].playlistId != PLAYLIST_ID){
                console.log('Song not included in the playlist selected: ' + dataVideos[i].title);
            }
            //if the song has already been downloaded
            else{
                console.log( 'Already downloaded: ' + dataVideos[i].title);
            }
          
        }

        
    } catch (error) {
        console.log(error);
    }
}

//obtains the number of videos that have the value false in the attribute downloaded
function getVideosToDownloadByPlaylist(videos, idPlaylist){
    let counter = 0;
    for(let i = 0; i < videos.length; i++){
        if(videos[i].downloaded == false && videos[i].playlistId == idPlaylist){
            counter ++;
        }
    }

    return counter;
}

//used to eliminate forbidden characters in windows filenames
function deleteForbiddenChars(title){
    title = title.replace('?','');
    title = title.replace('/','');
    title = title.replace("\/",'');
    title = title.replace(':','');
    title = title.replace('*','');
    title = title.replace(/"/g,'');
    title = title.replace('<','');
    title = title.replace('>','');
    title = title.replace('|','');


    return title
}


//adds playlists objects to the playlist json
function UpdatePlaylistJson(idPlaylist, namePlaylist){
    let playlists = fs.readFileSync('../playlist.json')
    playlists = JSON.parse(playlists)
    
    //Add the playlist to the json if it doesnt exist yet
    let existingPlaylist = playlists.find(p => p.id == idPlaylist);
    if(existingPlaylist == undefined){
        playlists.push({
            "id":idPlaylist,
            "name": namePlaylist
        });
    }

    playlists = JSON.stringify(playlists)

    fs.writeFileSync('../playlist.json',playlists)
}