const redis                 = require('../tokenFunction/redis');
const jwt                   = require('jsonwebtoken');
const { infoLog, debugLog } = require('../logger/logger');
const tokenGenerator        = require('../tokenFunction/tokenGenerator'); 
const dotenv                = require('dotenv');
dotenv.config();

const accessTokenRegeneration = (req, response) =>
{
    const refreshToken = req.headers['x-refresh-token'];
    const accessToken  = req.headers['x-access-token'];

    if(!refreshToken) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Refresh Token is Not Provided', 'Data': []});
    }

    if(!accessToken) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Access Token is Not Provided', 'Data': []});
    }

    jwt.verify(accessToken, process.env.PRIVATE_KEY_ACCESS, function(err, decoded)
    {
        if(!err)
        {
            return response.status(406).send({'Status':false, 'Message': 'Valid Access Token, Please Use it.', 'Data': []});
        }

        if(err.name === 'TokenExpiredError')
        {
            jwt.verify(refreshToken, process.env.PRIVATE_KEY_REFRESH, function(err_rt, decoded_rt)
            {
                if(err_rt)
                {
                    return response.status(401).send({'Status':false, 'Message': 'Invalid Token', 'Data': []});
                }

                redis.client.get(decoded_rt.token_id, function(error_redis, res)
                {
                    if(error_redis)
                    {
                        debugLog('AT Regeneration: ' + error_redis);
                        return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
                    }

                    if(res === null)
                    {
                        return response.status(401).send({'Status':false, 'Message': 'Access Denied', 'Data': []});
                    }

                    console.log(decoded_rt.user_code);
                    console.log()

                    const newAccessToken = tokenGenerator.generateAccessToken(decoded_rt.user_code, decoded_rt.token_id);

                    return response.status(200).send({'Status':true, 'Message': 'New Access Token Generated.',
                    'Data': [{'Access_Token': newAccessToken}]});
                });
            });
        }

        else
        {
            return response.status(401).send({'Status':false, 'Message': 'Invalid Token', 'Data': []});
        }
    });
}

module.exports = 
{
    accessTokenRegeneration
}