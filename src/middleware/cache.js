const redis = require('redis');
const asyncHandler = require('express-async-handler');
const { responseHandler } = require("express-intercept");

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

client.on('error', (err) => {
    console.error('Redis error:', err);
}).on('connect', () => {
    console.log('Connected to Redis server!');
}).on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
}).connect().catch(err => {
    console.error('Failed to connect to Redis:', err);
});

// Generate consistent cache keys
const generateCacheKey = (req) => {
    const baseUrl = req.baseUrl + req.path;
    const sortedQuery = Object.keys(req.query)
        .sort()
        .reduce((result, key) => {
            result[key] = req.query[key];
            return result;
        }, {});
    
    const queryString = new URLSearchParams(sortedQuery).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const cacheMiddleware = asyncHandler(async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const cacheKey = generateCacheKey(req);
    
    try {
        const data = await client.get(cacheKey);
        if (data !== null) {
            console.log(`Cache hit: ${cacheKey}`);
            return res.json(JSON.parse(data));
        }
        console.log(`Cache miss: ${cacheKey}`);
        next();
    } catch (error) {
        console.error('Cache middleware error:', error);
        // Continue without cache if Redis fails
        next();
    }
});

const cacheInterceptor = (ttl) => responseHandler()
    .for(req => req.method === "GET")
    .if(res => [200, 201].includes(res.statusCode)) // Only cache successful responses
    .getString(async (body, req, res) => {
        const cacheKey = generateCacheKey(req);
        
        try {
            await client.setEx(cacheKey, ttl, body);
            console.log(`Cached: ${cacheKey} for ${ttl}s`);
        } catch (error) {
            console.error('Cache interceptor error:', error);
        }
    });

// Improved cache clearing - supports patterns
const clearCache = async (pattern) => {
    try {
        if (!pattern) {
            console.warn('clearCache called without pattern');
            return;
        }

        // Find all keys matching the pattern
        const keys = await client.keys(`*${pattern}*`);
        
        if (keys.length > 0) {
            await client.del(keys);
            console.log(`Cleared ${keys.length} cache entries for pattern: ${pattern}`);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
};

// Clear cache middleware (for use in routes)
const clearCacheMiddleware = (pattern) => {
    return asyncHandler(async (req, res, next) => {
        const cachePattern = pattern || generateCacheKey(req);
        await clearCache(cachePattern);
        next();
    });
};

// Health check for cache
const cacheHealthCheck = async () => {
    try {
        await client.ping();
        return { status: 'healthy', connected: true };
    } catch (error) {
        return { status: 'unhealthy', connected: false, error: error.message };
    }
};

module.exports = { 
    cacheMiddleware, 
    cacheInterceptor, 
    clearCache,
    clearCacheMiddleware,
    cacheHealthCheck,
    client 
};