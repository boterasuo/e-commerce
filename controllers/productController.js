const connection = require('../utils/db');

const productController = {
    // 產品列表頁
    products: async (req, res, next) => {
        let [products] = await connection.execute(
            'SELECT * FROM products'
        );
        console.log('products', products);
        let data = {
            title: 'shop',
            active: {shop: true},
            info: products
        };
        res.render('products', data);
    }
}

module.exports = productController;