var express = require('express')
var router = express.Router()
var path = require('path')

const userController = require('../controllers').users
const ticketController = require('../controllers').tickets

router.use('/lottolist', require('./lottolist.js'))
router.use('/getnumbers', require('./getnumbers.js'))
router.use('/specs', require('./specs.js'))

router.get('/db', (req, res) =>
	res.status(200).send({
		message: 'Welcome to the db API'
	})
)

router.use('/db/users', require('./users.js'))

router.all('/db/tickets/:userID/tickets', (req, res) =>
	res.status(400).send({
		message: 'Method Not Allowed'
	})
)

// Catchall
router.get('*', (req, res) => {
	console.log(path)
	res.sendFile(path.resolve('client/build/index.html'))
})

module.exports = router
