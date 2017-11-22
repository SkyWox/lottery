var express = require('express')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load()
}
const sendmail = require('../funcs/sendmail')
const Ticket = require('../models').Ticket
const User = require('../models').User
const Op = require('sequelize').Op

module.exports = {
	logger: function() {
		console.log('fetchResults')
	},
	email: function(lottoname, lottodate, winningnums, potwon) {
		Ticket.findAll({
			where: {
				lottoname: lottoname,
				lottodate: lottodate,
				numbers: winningnums,
				contacted: false
			}
		}).then(ticket => {
			if (!ticket) {
				console.log('no tickets')
			}
			var result = ticket.map(r => r.toJSON())
			result.forEach(function(tick, i) {
				User.findById(tick.userID).then(user => {
					var userr = user.get({ plain: true })
					sendmail
						.send(
							userr.email,
							userr.username,
							tick.lottoname,
							winningnums,
							tick.numbers,
							potwon
						)
						.then(resp => {
							if (resp) {
								console.log(i + 1 + ' emails sent to winners')
								Ticket.update({ contacted: true }, { where: { id: tick.id } })
							}
						})
						.catch(error => console.log(error.message))
				})
			})
		})
		Ticket.findAll({
			where: {
				lottoname: lottoname,
				lottodate: lottodate,
				numbers: { [Op.ne]: winningnums },
				contacted: false
			}
		}).then(ticket => {
			if (!ticket) {
				console.log('no tickets')
			}
			var result = ticket.map(r => r.toJSON())
			result.forEach(function(tick, i) {
				User.findById(tick.userID).then(user => {
					var userr = user.get({ plain: true })
					sendmail
						.send(
							userr.email,
							userr.username,
							tick.lottoname,
							winningnums,
							tick.numbers,
							potwon
						)
						.then(resp => {
							if (resp) {
								console.log(i + 1 + ' losing emails sent')
								Ticket.update({ contacted: true }, { where: { id: tick.id } })
							}
						})
						.catch(error => console.log(error.message))
				})
			})
		})
	}
}
