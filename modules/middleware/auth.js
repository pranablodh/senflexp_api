const redis                 = require('../tokenFunction/redis');
const jwt                   = require('jsonwebtoken');
const { infoLog, debugLog } = require('../logger/logger');
const dotenv                = require('dotenv');
dotenv.config();

const authentication = (req, response, next) =>
{
    const token = req.headers['x-access-token'];

    if(!token) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Token is Not Provided', 'Data': []});
    }

    jwt.verify(token, process.env.PRIVATE_KEY_ACCESS, function(err, decoded)
    {
        if(err)
        {
            return response.status(401).send({'Status':false, 'Message': 'Invalid Token', 'Data': []});
        }

        redis.client.get(decoded.token_id, function(error_redis, res)
        {
            if(error_redis)
            {
                debugLog('Auth: ' + error_redis);
                return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
            }

            if(res === null)
            {
                return response.status(401).send({'Status':false, 'Message': 'Access Denied', 'Data': []});
            }

            jwt.verify(res, process.env.PRIVATE_KEY_REFRESH, function(error, decoded_token)
            {
                if(error)
                {
                    return response.status(401).send({'Status':false, 'Message': 'Invalid Token', 'Data': []});
                }

                if(decoded.token_id != decoded_token.token_id)
                {
                    return response.status(401).send({'Status':false, 'Message': 'Access Denied', 'Data': []});
                }

                else
                {
                    req.body.user_code = decoded_token.user_code;
                    req.body.token_id  = decoded.token_id;
                    next();
                }
            });
        });
    });
}

module.exports = 
{
    authentication
}