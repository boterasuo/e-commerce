var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/box', (req, res, next) => {
  res.render('box', { title: 'box page' });
});

module.exports = router;
