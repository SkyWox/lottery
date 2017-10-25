var express = require('express')
var router = express.Router()
var path = require('path')

router.use('/lottolist', require('./lottolist.js'))
router.use('/getnumbers', require('./getnumbers.js'))
router.use('/specs', require('./specs.js'))

router.get('/watch', (req, res) => {
	res.sendFile(path.resolve('./client-watch/build/index.html'))
})

// Catchall
router.get('*', (req, res) => {
	res.sendFile(path.resolve('./client/build/index.html'))
})

module.exports = router
