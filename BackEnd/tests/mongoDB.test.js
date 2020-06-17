const Song = require('../models/Song')

describe("MongoDB Integration", ()=>{

    let song1 = {
        videoId : 'id1',
        title : "Song Title",
        downloaded : false,
        playlistId : "playlist123"
    }

    let song2 = {
        videoId : 'id2',
        title : "Song Title 2",
        downloaded : false,
        playlistId : "playlist123"
    }

    test('Add song', async ()=>{
        

        let resp = await Song.createVideo(song1)
        // console.log(resp);
        expect(resp).not.toBe(false)

    })

    test('Add song 2', async ()=>{
        

        let resp = await Song.createVideo(song2)
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
        let totalVideos = await Song.getAllVideos()
        expect(resp.downloaded).toBe(true)
        expect(totalVideos.length).toBe(2)
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


    test('Update manySongs downloaded status to true', async()=>{
        await Song.updateVideo(song1.videoId, {downloaded:false})

        let resp = await Song.updateVideosToDownloaded('playlist123')
        let videos = await Song.getAllVideos()
        expect(resp.nModified).toBe(2)
        expect(videos[0].downloaded).toBe(true)
        expect(videos[1].downloaded).toBe(true)


    })


    test('Delete Song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp.videoId).toBe(song1.videoId)
        expect(resp).not.toBe(false)
    })

    test('Delete Song 2', async()=>{
        let resp = await Song.deleteVideo(song2.videoId)
        expect(resp.videoId).toBe(song2.videoId)
        expect(resp).not.toBe(false)
    })

    //cant delete something that doesnt exist
    test('Delete non existent song', async()=>{
        let resp = await Song.deleteVideo(song1.videoId)
        expect(resp).toBe(false)
    })
})