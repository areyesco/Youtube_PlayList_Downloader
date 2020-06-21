const axios = require('axios')
const Song = require('../models/Song')
const credentials = require('../credentials')

class DownloaderScript{
    
    //obtain the songs of the playlist via axios
    async getPlaylistData(playlistID){
            const result = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems',{
                params:{
                    part: 'id, snippet',
                    playlistId: playlistID,
                    maxResults:100,
                    key: credentials.API_KEY
                }
            });
            return result.data;
    }
}

const downloaderScript = new DownloaderScript();
module.exports = downloaderScript;