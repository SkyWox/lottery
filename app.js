var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const cronJobs = require('./cronJobs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

var app = express()

app.disable('x-powered-by') //hide server tech
//set security headers
app.use(function(req, res, next) {
  res.header('X-XSS-Protection', '1; mode=block')
  res.header('X-Frame-Options', 'deny')
  res.header('X-Content-Type-Options', 'nosniff')
  next()
})

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
//serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(require('./server/routes'))

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Express server listening on ${port}`)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log(err)
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

//CronJobs
cronJobs.run()

module.exports = app
