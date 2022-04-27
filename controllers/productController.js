const connection = require('../utils/db');
const redis = require('redis');
const client = redis.createClient(6379);
client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})()


const productController = {
    // 產品列表頁
    products: async (req, res, next) => {
        let [products] = await connection.execute(
            'SELECT * FROM products'
        );
        // await client.connect();
        console.log('start to cache', products);
        let cacheProducts = JSON.stringify(products);
        await client.setEx('products', 3600, cacheProducts);
        // console.log('products', products);
        console.log('Redis cached');
        let returnData = {
            title: 'shop',
            active: {shop: true},
            info: products
        };
        res.render('products', returnData);
    },
    // 產品列表 cache
    productsCache: async (req, res, next) => {
        console.log('check if cached')
        let data = await client.get('products');
        console.log('data', data);
        if (data) {
            let returnData = {
                title: 'shop',
                active: {shop: true},
                info: JSON.parse(data)
            };
            res.render('products', returnData); 
        } else {
            console.log('cache not yet exist');
            next();
        }
    },
    product: async (req, res, next) => {
        let returnData = {
            title: 'product'
        }
        res.render('product', returnData);
    },
    // Redis test
    test: async (req, res) => {
        let [products] = await connection.execute(
            'SELECT * FROM products'
        );
        let cacheProducts = JSON.stringify(products);
        await client.setEx('test', 3600, cacheProducts);
        res.send(JSON.stringify(products));
    },
    testCach: async (req, res, next) => {
        let data = await client.get('test');
        if (data) {
            console.log('cached!')
            res.send(data);
        } else {
            console.log('no cache!')
            next();
        }
    }
}

module.exports = productController;