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


    test('Get songs', async ()=>{
        let resp = await Song.getAllVideos()
        expect(Array.isArray(resp)).toBe(true)
    })


    test('Update song downloaded attribute to true', async()=>{
        let resp = await Song.updateVideo(song1.videoId, {downloaded:true})
        expect(resp.downloaded).toBe(true)
    })

    test('Update a non existent attribute in an existing song', async ()=>{
        let resp = await Song.updateVideo(song1.videoId, {'nonExisting':'Hello'})
        expect(resp.nonExisting).toBe(undefined)
        expect(resp.nonExisting).not.toBe('Hello')
    })


    test('Update a non existing song', async ()=>{
        let resp = await Song.updateVideo('12345',{'downloaded': true})
        expect(resp).toBe(false)

    })

    test('Delete Song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp.videoId).toBe(song1.videoId)
        expect(resp).not.toBe(false)
    })

    //cant delete something that doesnt exist
    test('Delete non existent song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp).toBe(false)
    })
})