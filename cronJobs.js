var CronJob = require('cron').CronJob
const contact = require('./server/jobs/contact.js')
const updateResults = require('./server/jobs/updateResults.js')
var moment = require('moment')

module.exports = {
  loadFromTxt() {
    // Only needed if loading in scores from txt file
    updateResults.pullFromText().then(res => {
      updateResults.updatePBDB(res)
    })
  },
  run() {
    var today = moment().format('YYYY-MM-DD')
    var updated = false

    var fetchLottoResults = new CronJob(
      '00 */1 19-23 * * 3,6',
      //drawing at 8pm PST
      function() {
        if (updated === false) {
          updateResults.mostRecent().then(currentDate => {
            updateResults.scrapePBASP().then(scraped => {
              if (scraped.dates.indexOf(currentDate) !== 0) {
                updateResults.updatePBDB(scraped, true).then(() => {
                  console.log(
                    'updated scores at ' +
                      moment().format('MMM Do YYYY, h:mm:ss a')
                  )
                  updated = true
                  contact.email(
                    'powerball',
                    today,
                    scraped.numbers[0],
                    scraped.winner
                  )
                })
              } else console.log('no updated score available')
            })
          })
        }
      },
      true, //start job now?
      'America/Los_Angeles' //timezone
    )
  }
}
