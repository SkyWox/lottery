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
	},
	scrapePBASP() {
		const cheerio = require('cheerio')
		return axios
			.get('http://www.powerball.com/powerball/pb_nbr_history.asp')
			.then(res => {
				let $ = cheerio.load(res.data)

				var scores = []
				var drawing = []
				var row = 0

				$('tr[valign=middle]')
					.find('td')
					.each((i, elm) => {
						let txt = $(elm).text()
						if (txt.indexOf('/') !== -1) {
							drawing = []
							row = 0
							dateSplit = txt.split('/')
							if (dateSplit[1].length === 1) dateSplit[1] = '0' + dateSplit[1]
							drawing[row] =
								dateSplit[2] + '-' + dateSplit[0] + '-' + dateSplit[1]
						} else if (Number(txt) !== 0) {
							row++
							drawing[row] = Number(txt)
							if (row === 6) scores.push(drawing)
						}
					})
				var winner = true
				if (
					$('td[bgcolor=#6699cc]')
						.html()
						.search('There were no jackpot winners') !== -1
				) {
					winner = false
				}
				return (answer = { winner: winner, scores: scores })
			})
	},

	updatePBDB(results) {
		return Powerball.upsert({
			date: results.scores[0][0],
			numbers: results.scores[0].splice(1),
			powerplay: 10,
			hadwinner: results.winner
		})
		for (var i = 1; i < results.scores.length; i++) {
			return Powerball.upsert({
				date: results.scores[i][0],
				numbers: results.scores[i].splice(1),
				powerplay: 10
			})
		}
	}
}
