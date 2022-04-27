// var fs = require('fs');
// let svgShrimp = fs.readFileSync('./public/images/shrimp.svg', 'utf8');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

// signUp & signIn
router.post('/signUp/checkEmail', userController.emailCheck);
router.get('/signUp', userController.registerPage);
router.post('/signUp', userController.registerRules, userController.register);
router.get('/signIn', userController.loginPage);
router.post('/signIn', userController.login);
router.get('/logout', userController.logout);

// products
router.get('/products', 
  productController.productsCache,
  productController.products);
router.get('/test', 
productController.testCach,
  productController.test
);
router.get('/product', productController.product);


/* GET home page. */
router.get('/', function(req, res, next) {
  let active = {home: true};
  res.render('index', { title: 'Seafood', active});
});


module.exports = router;
