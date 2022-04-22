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

router.get('/box', (req, res, next) => {
  let active = {shop: true};
  res.render('box', { title: 'box page', active});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let active = {home: true};
  let auth = req.session.member;
  res.render('index', { title: 'Seafood', active, auth});
});


module.exports = router;
