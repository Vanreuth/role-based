const redis = require('redis');
const asyncHandler = require('express-async-handler');
const {responseHandler} = require("express-intercept");


const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`
});

client.on('error', (err) => {
    console.error('Redis error:', err);
}).on('connect', () => console.log('Connected to Redis server!')).connect();

const cacheMiddleware = asyncHandler(async (req, res, next) => {
    const { originalUrl } = req;
    const data = await client.get(originalUrl);
    if (data !== null) {
        res.json(JSON.parse(data));
    } else {
        next();
    }
});
const cacheInterceptor = (ttl) => responseHandler()
    .for(req => req.method === "GET")
    .if(res => [200, 201, 203, 204].includes(res.statusCode))
    .getString(async (body, req, res) => {
        const { originalUrl } = res.req;
        await client.set(originalUrl, body, { EX: ttl });
    });
    
module.exports = { cacheMiddleware, cacheInterceptor, client };
