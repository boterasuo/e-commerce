const redis = require('redis');
const client  = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
    await client.set('foo', 'bar');
    let value = await client.get('foo');
    console.log('Redis value', value);
})();