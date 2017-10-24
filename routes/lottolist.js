var express = require('express');
var router = express.Router();

const lottolist = require('../lottolist.json')

router.get('/', (req, res) => {
  res.send(lottolist)
})

module.exports = router;
