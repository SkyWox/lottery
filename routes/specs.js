var express = require('express');
var router = express.Router();

var lottoSpecs = require('../lottoSpecs.js')

router.get('/', (req, res) => {
  //res.json(lottoSpecs(req.query.name))
  res.send(true)
})

module.exports = router;
