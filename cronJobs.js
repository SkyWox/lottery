var CronJob = require('cron').CronJob
const contact = require('./server/jobs/contact.js')
const updateResults = require('./server/jobs/updateResults.js')
var moment = require('moment')

module.exports = {
	run: function() {
		var today = moment().format('YYYY-MM-DD')
		//override today
		today = '2017-11-08'
		/*updateResults.powerball().then(winningnums => {
			var potwon = true
			contact.email('powerball', today, winningnums, potwon)
		})*/
		updateResults.mostRecent().then(res => console.log(res))
		updateResults.scrapePBASP().then(answer => {
			updateResults
				.updatePBDB(answer)
				.then(res => console.log('Updated successfully'))
				.catch(err => console.log('Error in update'))
		})

		var fetchLottoResults = new CronJob(
			'0,5,10,15,20,25,30,35,40,45,50,55 * * * * *',
			//drawing at 8pm
			function() {
				//fetch
				updateResults.detectFreq()
			},
			function() {
				//callback
			},
			false, //start job now?
			'America/Los_Angeles' //timezone
		)
	}
}
