const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const { infoLog, debugLog } = require('../../logger/logger');
const tokenGenerator        = require('../../tokenFunction/tokenGenerator');
const redis                 = require('../../tokenFunction/redis');
const dotenv                = require('dotenv');
const { v4: uuidv4 }        = require('uuid');
dotenv.config();
uuidv4();

const login = (req, response) =>
{
    if(!req.body.user || !req.body.password)
    {
        return response.status(400).send({'Status':false, 'Message': 'Some Values Are Missing.', 'Data': []});
    }

    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Please Enter a Valid Email Address or Mobile Number', 'Data': []});
    }

    const createQuery = `SELECT um.user_code, us.user_secret FROM user_master um
    INNER JOIN user_secret us ON us.user_id = um.user_id
    WHERE um.user_id = (SELECT user_id FROM user_contact_register WHERE primary_email = $1 OR primary_mobile = $1)`

    const values = 
    [
        req.body.user
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Login: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'User Not Registered.', 'Data': []}); 
        }

        else if(inputValidator.comparePassword(res.rows[0].user_secret, req.body.password))
        {
            db.pool.end;
            const uuid = uuidv4();
            const refreshToken = tokenGenerator.generateRefreshToken(res.rows[0].user_code, process.env.TOKEN_EXP_REFRESH, uuid);

            const redisResponse = redis.client.set(uuid, refreshToken);

            if(!redisResponse)
            {
                return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
            }

            return response.status(200).send({'Status':true, 'Message': 'User Authorized.',
            'Data': [{'Access_Token': tokenGenerator.generateAccessToken(res.rows[0].user_code, process.env.TOKEN_EXP_ACCESS, uuid),
            'Refresh_Token': refreshToken}]});
        }

        else if(!inputValidator.comparePassword(res.rows[0].user_secret, req.body.password))
        {
            db.pool.end;
            return response.status(403).send({'Status':false, 'Message': 'Wrong Credentials.', 'Data': []});
        }
    });
}

module.exports = 
{
    login
}