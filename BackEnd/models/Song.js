const DB = require('../db/DB')
const mongoose = require('../db/mongodb-connection')

class Song extends DB{
    constructor(){
        super();

        this.schema = new mongoose.Schema({
            videoId:{
                type: String,
                unique: true
            },
            title:{
                type: String,
                required: true
            },
            downloaded:{
                type: Boolean,
                required: true
            },
            playlistId: {
                type: String,
                required: true
            }

        });

        this._model = mongoose.model('VideosDownloaded', this.schema)
        
    }


    async getAllVideos(){
        return await super.query({},{},{});
    }

    async getVideoById(videoId){
        return await super.queryOne({videoId}, {}, {});
    }

    async createVideo(video){
        let doc = await this.getVideoById(video.videoId)

        if(doc == null || doc == undefined || doc.length == 0){
            return super.add(video);
        }
        else  return false;
        
    }

    async updateVideo(videoId, video){
        if(await super.exists({videoId:videoId})){
            return await super.update(this.getVideoById(videoId),video)
        }
        else return false
        
    }

    async updateVideosToDownloaded(playlistId){
            return await super.updateMany({downloaded:false, playlistId:playlistId}, {downloaded:true})
    }


    async deleteVideo(videoId){
        if(await super.exists({videoId:videoId})){
            return await super.delete(this.getVideoById(videoId))
        }
        else return false
        
    }

};

let song = new Song();


module.exports = song;