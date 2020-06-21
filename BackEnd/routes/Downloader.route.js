const router = require('express').Router()
const DownloaderController = require('../controllers/Downloader.controller')

router.get('/start', DownloaderController.showPlaylistSongs);

router.post('/showSongs', DownloaderController.showPlaylistSongs);

module.exports = router;