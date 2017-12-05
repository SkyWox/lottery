var axios = require('axios')
const Powerball = require('../models').Powerball

module.exports = {
	mostRecent() {
		var moment = require('moment')
		return Powerball.findAll({
			limit: 1,
			plain: true,
			attributes: ['date'],
			order: [['date', 'DESC']]
		}).then(entry => {
			return moment
				.utc(entry.get({ plain: true }).date.toGMTString())
				.format('YYYY-MM-DD')
		})
	},
	pullFromText() {
		return axios({
			method: 'get',
			url: 'http://www.powerball.com/powerball/winnums-text.txt',
			responseType: 'text'
		}).then(tsv => {
			var lines = tsv.data.split('\n')
			var numbers = []
			var dates = []
			var powerplay = []
			for (var i = 1; i < lines.length - 1; i++) {
				var subNumbers = []
				for (var j = 12; j < 36; j = j + 4) {
					subNumbers.push(Number(lines[i].slice(j, j + 2)))
				}

				numbers.push(subNumbers)
				dates.push(
					lines[i].slice(6, 10) +
						'-' +
						lines[i].slice(0, 2) +
						'-' +
						lines[i].slice(3, 5)
				)
				if (lines[i][36]) powerplay.push(Number(lines[i][36]))
				else powerplay.push(0)
			}

			return (answer = { dates: dates, numbers: numbers, powerplay: powerplay })
		})
	},
	detectFreq() {
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

				var dates = []
				var numbers = []
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
							dates.push(dateSplit[2] + '-' + dateSplit[0] + '-' + dateSplit[1])
						} else if (Number(txt) !== 0) {
							drawing[row] = Number(txt)
							if (row === 5) numbers.push(drawing)
							row++
						}
					})

				var powerplay = []
				$('td[colspan=8]')
					.find('span[class=cssNumber-18]')
					.each((i, elm) => {
						let txt = $(elm).text()
						powerplay.push(txt[0])
					})

				var winner = true
				if (
					$('td[bgcolor=#6699cc]')
						.html()
						.search('There were no jackpot winners') !== -1
				) {
					winner = false
				}
				return (answer = {
					winner: winner,
					dates: dates,
					numbers: numbers,
					powerplay: powerplay
				})
			})
	},

	updatePBDB(results, hasWinner) {
		return new Promise(function(resolve, reject) {
			var int = 0
			if (hasWinner) {
				Powerball.upsert({
					date: results.dates[0],
					numbers: results.numbers[0],
					powerplay: results.powerplay[0],
					hadwinner: results.winner
				})
				int = 1
			}
			for (var i = int; i < results.numbers.length; i++) {
				Powerball.upsert({
					date: results.dates[i],
					numbers: results.numbers[i],
					powerplay: results.powerplay[i]
				})
			}
			resolve(true)
		})
	}
}
