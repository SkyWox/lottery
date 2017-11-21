var CronJob = require('cron').CronJob
const fetchResults = require('./server/jobs/fetchResults.js')
var moment = require('moment')

module.exports = {
	run: function() {
		var today = moment().format('YYYY-MM-DD')
		//override today
		today = '2017-11-08'
		fetchResults.callModel('powerball', today, '{55, 55, 55, 55, 55, 55}')
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
