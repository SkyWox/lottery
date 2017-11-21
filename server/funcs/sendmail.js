const http = require('http')
var requireText = require('require-text')
const ticketController = require('../controllers').tickets
const someoneElseWon = requireText(
	'../../emails/SorrySomeoneElseWon.html',
	require
)

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load()
}
const api_key = process.env.MAILGUN_SANDBOX_API_KEY
const DOMAIN = process.env.MAILGUN_SANDBOX_DOMAIN

var mailgun = require('mailgun-js')
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN })

module.exports = {
	send: function() {
		var data = {
			from: 'Excited User <me@samples.mailgun.org>',
			to: 'lenin1916@gmail.com',
			subject: 'Hello',
			html: someoneElseWon
		}

		mailgun.messages().send(data, function(error, body) {
			console.log(body)
			if (error) {
				res.status(400).send(error.message)
			} else if (!error) {
				res.status(200).send({
					message: 'email sent'
				})
			}
		})
	}
}
