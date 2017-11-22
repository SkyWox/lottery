var fs = require('fs')
var axios = require('axios')
const Powerball = require('../models').Powerball

module.exports = {
	powerball: function() {
		axios({
			method: 'get',
			url: 'http://www.powerball.com/powerball/winnums-text.txt',
			responseType: 'text'
		}).then(tsv => {
			//var tsv is the TSV file with headers
			console.log(tsv.toString())
			var lines = tsv.toString().split('\n')

			var result = []

			var headers = lines[0].split('\t')

			for (var i = 1; i < lines.length; i++) {
				var obj = {}
				var currentline = lines[i].split('\t')

				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j]
				}

				result.push(obj)
			}

			//return result; //JavaScript object
			const final = JSON.stringify(result) //JSON
			console.log(final)
		})
		/*  Powerball.bulkCreate([
  {date: 'programming', numbers: 'executing', powerplay: ''},
  {date: 'programming', numbers: 'executing', powerplay: ''}
  ])*/
	}
}
