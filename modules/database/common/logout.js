const redis  = require('../../tokenFunction/redis');

const logout = (req, response) =>
{
    const redisResponse = redis.client.del(req.body.token_id);
    
    if(redisResponse)
    {
        return response.status(200).send({'Status':true, 'Message': 'You Have Been Successfully Logged Out.', 'Data': []});
    }

    else
    {
        return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
    }
}

module.exports = 
{
    logout
}