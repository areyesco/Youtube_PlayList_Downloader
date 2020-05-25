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
        }else{
            return false;
        }
    }

    async updateVideo(videoId, video){
        let videoToUpdate = await this.getVideoById(videoId)

        if(videoToUpdate != undefined && videoToUpdate != null){
            return await super.update({videoId}, video)
        }else{
            return false;
        }
    }


    async deleteVideo(videoId){
        let videoToDelete = await this.getVideoById(videoId)

        if(videoToDelete != null && videoToDelete != undefined){
            return await super.delete(videoToDelete)
        }else{
            return false;
        }
    }

};

let song = new Song();

module.exports = song;