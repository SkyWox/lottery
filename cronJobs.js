var CronJob = require('cron').CronJob
const contact = require('./server/jobs/contact.js')
const updateResults = require('./server/jobs/updateResults.js')
var moment = require('moment')

module.exports = {
	run: function() {
		var today = moment().format('YYYY-MM-DD')
		//override today
		today = '2017-11-08'
		updateResults.powerball()
		//was the jackpot won?
		var potwon = true
		contact.email('powerball', today, '{55, 55, 55, 55, 55, 55}', potwon)

		var fetchLottoResults = new CronJob(
			'* * * * * *',
			function() {
				//fetch
				fetchResults.logger()
			},
			function() {
				//callback - mark lottery as checked
			},
			false, //don't start job now
			'America/Los_Angeles' //timezone
		)
	}
}
