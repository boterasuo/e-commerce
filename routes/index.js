// var fs = require('fs');
// let svgShrimp = fs.readFileSync('./public/images/shrimp.svg', 'utf8');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// signUp & signIn
router.post('/signUp/checkEmail', userController.emailCheck);
router.get('/signUp', userController.registerPage);
router.post('/signUp', userController.registerRules, userController.register);
router.get('/signIn', userController.loginPage);
router.post('/signIn', userController.login);
router.get('/logout', userController.logout);

router.get('/product', (req, res, next) => {
  let active = {shop: true};
  res.render('box', { title: 'box page', active});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let active = {home: true};
  res.render('index', { title: 'Seafood', active});
});


module.exports = router;