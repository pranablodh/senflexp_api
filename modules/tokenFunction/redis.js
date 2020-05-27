const redis                 = require('redis');
const { infoLog, debugLog } = require('../logger/logger');
const dotenv                = require('dotenv');
dotenv.config();

const client = redis.createClient
({
    host     : process.env.REDIS_HOST, 
    port     : process.env.REDIS_PORT, 
    password : process.env.REDIS_PASSWORD
});

client.on("connect", () => 
{
    console.log("Redis plugged in.");
});

client.on("error", (err) => 
{
    debugLog('REDIS ERROR: ' + err);
});

module.exports = 
{
    client
}