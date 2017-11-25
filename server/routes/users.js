var express = require('express')
var router = express.Router()
var path = require('path')
const userController = require('../controllers').users
const ticketController = require('../controllers').tickets

router.post('/', userController.create)
router.get('/', userController.list)
router.get('/:userID', userController.retrieve)
router.patch('/:userID', userController.update)
router.delete('/:userID', userController.destroy)
router.post('/:userID/tickets', ticketController.create)
router.post('/:userID/tickets/:ticketID', ticketController.update)
router.delete('/:userID/tickets/:ticketID', ticketController.destroy)

module.exports = router
