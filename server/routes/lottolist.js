var express = require('express')
var router = express.Router()

const lottolist = require('../../lottoList.json')

router.get('/', (req, res) => {
	res.send(lottolist)
})

module.exports = router
