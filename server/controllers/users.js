const User = require('../models').User
const Ticket = require('../models').Ticket

module.exports = {
	create(req, res) {
		return User.create({
			username: req.body.username,
			email: req.body.email
		})
			.then(User => res.status(201).send(User))
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
			.then(todos => res.status(200).send(todos))
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
					username: req.body.username || User.username,
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
