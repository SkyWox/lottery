var express = require('express');
var router = express.Router();

var lottoGen = require('../lottoGen.js');
var lottoSpecs = require('../lottoSpecs.js');

router.get('/', (req, res) => {
    //successfully getting fresh number
    success = false;
    const mint = req.query.mint;
    const name = req.query.name;
    const date = req.query.date;

    const specs = lottoSpecs(name)

    //keep getting new numbers until mint is happy
    while (success == false){
      numbers = lottoGen(specs)
      //success = freshCheck(numbers, mint)
      success = true;
    }

    res.json(numbers);
})

module.exports = router;
