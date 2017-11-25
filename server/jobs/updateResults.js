var axios = require('axios')
const Powerball = require('../models').Powerball

module.exports = {
	powerball: function() {
		return axios({
			method: 'get',
			url: 'http://www.powerball.com/powerball/winnums-text.txt',
			responseType: 'text'
		}).then(tsv => {
			var lines = tsv.data.split('\n')
			const date =
				lines[1].slice(6, 10) +
				'-' +
				lines[1].slice(0, 2) +
				'-' +
				lines[1].slice(3, 5)

			const numbers =
				'{' +
				lines[1].slice(12, 14) +
				', ' +
				lines[1].slice(16, 18) +
				', ' +
				lines[1].slice(20, 22) +
				', ' +
				lines[1].slice(24, 26) +
				', ' +
				lines[1].slice(28, 30) +
				', ' +
				lines[1].slice(32, 34) +
				'}'

			const powerplay = lines[1][36]

			/*Powerball.create({
				date: date,
				numbers: numbers,
				powerplay: powerplay
			})*/

			return numbers
		})
	},
	detectFreq: function() {
		var moment = require('moment')
		return axios({
			method: 'get',
			url: 'http://www.powerball.com/powerball/winnums-text.txt',
			responseType: 'text'
		}).then(tsv => {
			var lines = tsv.data.split('\n')
			if (lines[1][3] === '2') {
				console.log('changed at ' + moment().format('dddd, MMM Do, h:mm:ss a'))
			}
		})
	}
}
