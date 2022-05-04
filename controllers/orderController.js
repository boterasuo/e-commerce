const connection = require('../utils/db');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');

const orderController = {
    getCart: (req, res) => {
        res.render('cart', {title: 'cart details'});
    }
}

module.exports = orderController;