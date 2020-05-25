const Song = require('../models/Song')

describe("MongoDB Integration", ()=>{

    let song1 = {
        videoId : '123ABC',
        title : "Song Title",
        downloaded : false,
        playlistId : "playlist123"
    }


    test('Add song', async ()=>{
        

        let resp = await Song.createVideo(song1)
        // console.log(resp);
        expect(resp).not.toBe(false)

    })

    test('Dont add duplicate song', async ()=>{
        

        let resp = await Song.createVideo(song1)

        expect(resp).toBe(false)
    })


    test('Delete Song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp).not.toBe(false)
    })

    //cant delete something that doesnt exist
    test('Delete non existent song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp).toBe(false)
    })
})