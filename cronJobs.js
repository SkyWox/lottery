var CronJob = require('cron').CronJob
const contact = require('./server/jobs/contact.js')
const updateResults = require('./server/jobs/updateResults.js')
var moment = require('moment')

module.exports = {
	run: function() {
		/* Only needed to load in scores from txt file
		updateResults.pullFromText().then(res => {
			updateResults.updatePBDB(res)
		})*/

		var today = moment().format('YYYY-MM-DD')
		//override today
		today = '2017-11-08'
		/*updateResults.powerball().then(winningnums => {
			var potwon = true
			contact.email('powerball', today, winningnums, potwon)
		})*/

		var fetchLottoResults = new CronJob(
			'0 0/1 19-23 ? * 3,6',
			//drawing at 8pm PST
			function() {
				updateResults.mostRecent().then(currentDate => {
					updateResults.scrapePBASP().then(answer => {
						if (answer.dates.indexOf(currentDate) === -1) {
							updateResults.updatePBDB(answer, true).then(() => {
								console.log(
									'updated scores at ' +
										moment().format('MMM Do YYYY, h:mm:ss a')
								)
								updated = true
							})
						} else console.log('no updated score available')
					})
				})
			},
			true, //start job now?
			'America/Los_Angeles' //timezone
		)
	}
}
