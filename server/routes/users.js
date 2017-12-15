var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const generateToken = require('../funcs/generateToken')
const getCleanUser = require('../funcs/getCleanUser')
const User = require('../models').User
const Ticket = require('../models').Ticket
const userController = require('../controllers').users
const ticketController = require('../controllers').tickets

router.post('/signup', userController.create)
router.post('/signin', function(req, res, next) {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        return res.status(204).json({
          error: true,
          message: 'Email or Password is Wrong'
        })
      }
      bcrypt.compare(req.body.password, user.password, function(err, valid) {
        if (!valid) {
          return res.status(204).json({
            error: true,
            message: 'Email or Password is Wrong'
          })
        }
        var token = generateToken(user)
        user = getCleanUser(user)
        res.status(200).json({
          user: user,
          token: token
        })
      })
    })
    .catch(error => console.log(error))
})

router.get('/me/from/token', function(req, res, next) {
  const token = req.header('Authorization').slice(7)
  if (!token) {
    return res.status(402).json({ message: 'Must pass token' })
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) throw err
    User.findById(user.id)
      .then(user => {
        user = getCleanUser(user)
        res.json({
          user: user,
          token: token
        })
      })
      .catch(err => console.log(err))
  })
})

router.use((req, res, next) => {
  const token = req.header('Authorization').slice(7)
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      })
    } else {
      req.user = user
      next()
    }
  })
})

router.post('/', userController.create)
router.get('/', userController.list)
router.get('/:userID', userController.retrieve)
router.patch('/:userID', userController.update)
router.delete('/:userID', userController.destroy)
router.post('/:userID/tickets', ticketController.create)
router.post('/:userID/tickets/:ticketID', ticketController.update)
router.delete('/:userID/tickets/:ticketID', ticketController.destroy)

module.exports = router
