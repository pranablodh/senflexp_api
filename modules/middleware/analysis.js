const redis                 = require('../tokenFunction/redis');
const jwt                   = require('jsonwebtoken');
const { infoLog, debugLog } = require('../logger/logger');
const dotenv                = require('dotenv');
dotenv.config();


const authentication = (req, response, next) =>
{
    const token = req.headers['python-access-token'];
    const staticToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJUMjAxNVAiLCJ0b2tlbl9pZCI6IjYzYzRhZmIzLTZjYTgtNGMzYy1iOTU4LWFjNjEwZGViYjU5ZiIsImlhdCI6MTU5MTc2NjA5MCwiZXhwIjozMzE0OTM2NjA5MCwiaXNzIjoiaHR0cHM6Ly9zZW5mbGV4LmluIn0.w9k5fvF7StbSdvl2Ca8LR65frNvflXXtGBD7gmRgXww'

    if(!token) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Token is Not Provided', 'Data': []});
    }

    jwt.verify(token, process.env.PRIVATE_KEY_REFRESH, function(err, decoded)
    {
        if(err)
        {
            return response.status(401).send({'Status':false, 'Message': 'Access Denied', 'Data': []});
        }

        if(token != staticToken)
        {
            return response.status(401).send({'Status':false, 'Message': 'Access Denied', 'Data': []});
        }

        next();
    });
}

module.exports = 
{
    authentication
}
