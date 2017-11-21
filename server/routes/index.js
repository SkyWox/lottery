var express = require('express')
var router = express.Router()
var path = require('path')
//db includes
const userController = require('../controllers').users
const ticketController = require('../controllers').tickets

router.use('/lottolist', require('./lottolist.js'))
router.use('/getnumbers', require('./getnumbers.js'))
router.use('/specs', require('./specs.js'))

//db calls
router.get('/db', (req, res) =>
	res.status(200).send({
		message: 'Welcome to the db API'
	})
)

router.post('/db/users', userController.create)
router.get('/db/users', userController.list)
router.get('/db/users/:userID', userController.retrieve)
router.patch('/db/users/:userID', userController.update)
router.delete('/db/users/:userID', userController.destroy)

router.post('/db/check', ticketController.check)

router.post('/db/users/:userID/tickets', ticketController.create)
router.post('/db/users/:userID/tickets/:ticketID', ticketController.update)
router.delete('/db/users/:userID/tickets/:ticketID', ticketController.destroy)

// For any other request method on user tickets, we're going to return "Method Not Allowed"
router.all('/db/tickets/:userID/tickets', (req, res) =>
	res.status(405).send({
		message: 'Method Not Allowed'
	})
)

// Catchall
router.get('*', (req, res) => {
	res.sendFile(path.resolve('../../client/build/index.html'))
})

module.exports = router
