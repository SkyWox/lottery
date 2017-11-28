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

router.post('/signup', function(req, res, next) {
	var body = req.body
	var hash = bcrypt.hashSync(body.password.trim(), 10)
	var user = new User({
		firstname: body.firstname.trim(),
		lastname: body.lastname.trim(),
		email: body.email.trim(),
		password: hash,
		admin: false,
		isEmailVerified: false
	})
	user.save(function(err, user) {
		if (err) throw err
		var token = generateToken(user)
		res.json({
			user: user,
			token: token
		})
	})
})
router.post('/signin', function(req, res, next) {
	User.findOne({ where: { email: req.body.email } })
		.then(user => {
			console.log(user.dataValues.firstname + user.dataValues.lastname)
			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'Email or Password is Wrong'
				})
			}
			bcrypt.compare(req.body.password, user.password, function(err, valid) {
				if (!valid) {
					return res.status(404).json({
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

//get current user from token
router.post('/me/from/token', function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token
	if (!token) {
		return res.status(402).json({ message: 'Must pass token' })
	}
	// Check token that was passed by decoding token using secret
	jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
		if (err) throw err
		//return user using the id from w/in JWTToken
		User.findById(user.id)
			.then(user => {
				user = getCleanUser(user)
				//Note: you can renew token by creating new token(i.e.
				//refresh it)w/ new expiration time at this point, but I’m
				//passing the old token back.
				// var token = utils.generateToken(user);
				res.json({
					user: user,
					token: token
				})
			})
			.catch(err => console.log(err))
	})
})

//require auth before proceeding
router.use((req, res, next) => {
	console.log('Restricted Routes')
	//let token = req.body.token
	//if (!token) return next(); //if no token, continue

	jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, user) {
		if (err) {
			console.log('error in gatekeeper')
			return res.status(401).json({
				success: false,
				message: 'Please register Log in using a valid email to submit posts'
			})
		} else {
			req.user = user //set the user to req so other routes can use it
			next()
		}
	})
})

router.post('/:userID/', (req, res, next) => {
	console.log('requesting info for user ' + req.params.userID)
	return User.findById(req.params.userID, {
		include: [
			{
				model: Ticket,
				as: 'tickets'
			}
		],
		order: [
			['createdAt', 'DESC'],
			[{ model: Ticket, as: 'tickets' }, 'createdAt', 'ASC']
		]
	}).then(tickets => res.status(200).send(tickets))
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
