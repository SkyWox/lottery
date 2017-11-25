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
	}
}
