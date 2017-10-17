const lottoList = require('./lottoList.json')

var lottoSpecs = function (name) {
  var specs = {}
    for (var i in lottoList){
      if (lottoList[i].name == name){
        specs = lottoList[i]
      }
    }
    return specs
}

module.exports = lottoSpecs;
