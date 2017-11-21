var express = require('express')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load()
}
const Ticket = require('../models').Ticket
const TicketController = require('../controllers').tickets

module.exports = {
	logger: function() {
		console.log('fetchResults')
	},
	callModel: function(lottoname, lottodate, winningnums) {
		TicketController.email().then(resp => console.log(resp))
		Ticket.findAll({
			where: {
				lottoname: lottoname,
				lottodate: lottodate,
				numbers: winningnums
			}
		}).spread(function(item, created) {
			console.log(item.get({ plain: true }))
			console.log('usernumber ' + item.get({ plain: true }).userID)
		})
		/*.then(Ticket => {
			if (!Ticket) {
				console.log('no tickets found')
			} else {
				console.log('normal ticket return')
				//console.log(Ticket)
			}
			/*return Ticket.update({
				winner: true || Ticket.winner
			})
		})*/
	}
}
