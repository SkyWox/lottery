var express = require('express');
var router = express.Router();

const lottoList = require('../lottoList.json')

router.get('/'), (req, res) => {
  var nameRes = []
  switch (req.query.name) {
    case 'name':
        for (var i in lottoList){
          nameRes[i] = lottoList.name[i]
        }
      break;
      case 'proper':
        console.log('in proper')
        for (var i in lottoList){
          nameRes[i] = lottoList.proper[i]
        }
      break;
  }
  console.log(nameRes[0])
  res.json(nameRes)

}

module.exports = router;
