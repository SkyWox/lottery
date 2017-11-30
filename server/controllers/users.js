const User = require('../models').User
const Ticket = require('../models').Ticket
var bcrypt = require('bcrypt')
const generateToken = require('../funcs/generateToken')

module.exports = {
	create(req, res) {
		var body = req.body
		var hash = bcrypt.hashSync(body.password.trim(), 10)
		return User.create({
			email: body.email.trim(),
			password: hash,
			admin: false,
			isEmailVerified: false,
			contactwin: body.contactwin,
			contactlose: body.contactlose
		})
			.then(User => {
				var token = generateToken(User)
				res.status(201).json({
					user: User,
					token: token
				})
			})
			.catch(error => res.status(400).send(error))
	},

	list(req, res) {
		return User.findAll({
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
		})
			.then(tickets => res.status(200).send(tickets))
			.catch(error => res.status(400).send(error))
	},

	retrieve(req, res) {
		return User.findById(req.params.userID, {
			include: [
				{
					model: Ticket,
					as: 'tickets'
				}
			]
		})
			.then(User => {
				if (!User) {
					return res.status(404).send({
						message: 'User Not Found'
					})
				}
				return res.status(200).send(User)
			})
			.catch(error => res.status(400).send(error))
	},

	update(req, res) {
		return User.findById(req.params.userID, {
			include: [
				{
					model: Ticket,
					as: 'tickets'
				}
			]
		})
			.then(User => {
				if (!User) {
					return res.status(404).send({
						message: 'User Not Found'
					})
				}
				return User.update({
					email: req.body.email || User.email
				})
					.then(() => res.status(200).send(User))
					.catch(error => res.status(400).send(error))
			})
			.catch(error => res.status(400).send(error))
	},

	destroy(req, res) {
		return User.findById(req.params.userID)
			.then(User => {
				if (!User) {
					return res.status(400).send({
						message: 'User Not Found'
					})
				}
				return User.destroy()
					.then(() => res.status(204).send())
					.catch(error => res.status(400).send(error))
			})
			.catch(error => res.status(400).send(error))
	}
}
