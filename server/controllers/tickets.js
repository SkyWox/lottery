const Ticket = require('../models').Ticket

module.exports = {
	create(req, res) {
		return Ticket.create({
			numbers: req.body.numbers,
			lottoname: req.body.lottoname,
			lottodate: req.body.lottodate,
			winchecked: req.body.winchecked,
			userID: req.params.userID
		})
			.then(Ticket => res.status(201).send(Ticket))
			.catch(error => res.status(400).send(error))
	},

	fetchwinners(req, res) {
		return Ticket.findAll({
			where: {
				numbers: req.body.winningnums,
				lottoname: req.body.lottoname,
				lottodate: req.body.lottodate
			}
		}).then(Ticket => {
			if (!Ticket) {
				return res.status(404).send({
					message: 'Ticket Not Found'
				})
			}
			return res.status(200).send(Ticket)
		})
	},

	retrieve(req, res) {
		return Ticket.findById(req.params.TicketID, {
			include: [
				{
					model: User,
					as: 'user'
				}
			]
		})
			.then(Ticket => {
				if (!Ticket) {
					return res.status(404).send({
						message: 'Ticket Not Found'
					})
				}
				return res.status(200).send(Ticket)
			})
			.catch(error => res.status(400).send(error))
	},

	update(req, res) {
		return Ticket.find({
			where: {
				id: req.params.ticketID,
				userID: req.params.userID
			}
		})
			.then(Ticket => {
				console.log('in traditional update func')
				if (!Ticket) {
					return res.status(404).send({
						message: 'Ticket Not Found'
					})
				}

				return Ticket.update({
					numbers: req.body.numbers || Ticket.numbers,
					lottoname: req.body.lottoname || Ticket.lottoname,
					lottodate: req.body.lottodate || Ticket.lottodate,
					winchecked: req.body.winchecked || Ticket.winchecked,
					userID: req.params.userID || Ticket.userID
				})
					.then(updatedTicket => res.status(200).json(updatedTicket))
					.catch(error => res.status(400).send(error))
			})
			.catch(error => {
				res.status(401).send(error)
				console.log(error)
			})
	},

	destroy(req, res) {
		return Ticket.find({
			where: {
				id: req.params.ticketID,
				userID: req.params.userID
			}
		})
			.then(Ticket => {
				if (!Ticket) {
					return res.status(404).send({
						message: 'Ticket Not Found'
					})
				}

				return Ticket.destroy()
					.then(() => res.status(204).send())
					.catch(error => res.status(400).send(error))
			})
			.catch(error => res.status(400).send(error))
	},

	check(req, res) {
		return Ticket.update(
			{ winchecked: true, winner: true },
			{
				where: {
					lottoname: req.body.lottoname,
					lottodate: req.body.lottodate,
					numbers: req.body.numbers,
					winchecked: false
				}
			}
		)
			.spread(() => {
				return Ticket.findAll({
					where: {
						lottoname: req.body.lottoname,
						lottodate: req.body.lottodate,
						numbers: req.body.numbers,
						winchecked: true,
						winner: true
					}
				})
			})
			.then(updatedTicket => res.status(200).send(updatedTicket))
			.catch(error => res.status(400).send(error))
	},

	email(req) {
		return Ticket.findAll({
			where: {
				winchecked: false,
				winner: false
			}
		})
			.then(Ticket => {
				if (!Ticket) {
					console.log('no ticket')
				}
				return Ticket
			})
			.then(updatedTicket => {
				//return updatedTicket
			})
			.catch(
				error => {
					console.log(error)
				} /*res.status(400).send(error)*/
			)
	}
}
