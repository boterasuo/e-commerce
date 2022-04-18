// var fs = require('fs');
// let svgShrimp = fs.readFileSync('./public/images/shrimp.svg', 'utf8');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signUp', (req, res, next) => {
  res.render('register', { title: 'sign up' })
});
router.post('signUp', (req, res, next) => {
  let signUp = req.body;
  console.log(signUp);
})

router.get('/box', (req, res, next) => {
  let active = {shop: true};
  res.render('box', { title: 'box page', active});
});

router.get('/', function(req, res, next) {
  let active = {home: true};
  res.render('index', { title: 'Seafood', active});
});


module.exports = router;
