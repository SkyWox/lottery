const http = require('http')
const ticketController = require('../controllers').tickets
const constructHTML = require('./constructHTML')

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load()
}
const api_key = process.env.MAILGUN_SANDBOX_API_KEY
const DOMAIN = process.env.MAILGUN_SANDBOX_DOMAIN

var mailgun = require('mailgun-js')
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN })

module.exports = {
	send: function(email, username, lottoname, winningnums, yournums, potwon) {
		return new Promise(function(resolve, reject) {
			var template = ''
			var subject = ''
			if (!potwon) {
				template = 'potincrease'
				subject = username + ', you won the jackpot!'
			} else if (winningnums === yournums) {
				template = 'youwon'
				subject = username + ', you won the jackpot!'
			} else {
				template = 'someoneElseWon'
				subject = username + ', someone else won the jackpot '
			}
			var data = {
				from: 'Excited User <me@samples.mailgun.org>',
				to: email,
				subject: subject,
				html: constructHTML.build(
					template,
					username,
					lottoname,
					winningnums,
					yournums
				)
			}
			resolve(true)
			/*mailgun.messages().send(data, function(error, body) {
				console.log(body)
				if (error) {
					reject(error)
				} else {
					resolve(true)
				}
			})*/
		})
	}
}
