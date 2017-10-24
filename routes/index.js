var express = require('express');
var router = express.Router();

router.use('/lottolist', require('./lottolist.js'));
router.use('/getnumbers', require('./getnumbers.js'));
router.use('/specs', require('./specs.js'));

// Catchall
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = router;
