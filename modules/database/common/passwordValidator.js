const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const { infoLog, debugLog } = require('../../logger/logger');

const passwordValidator = (req, response, next) =>
{
    if(!req.body.password)
    {
        return response.status(400).send({'Status':false, 'Message': 'Password is Missing.', 'Data': []});
    }

    const createQuery = `SELECT user_secret, last_secret FROM user_secret WHERE user_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1)`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Password Validator: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }

        else if(inputValidator.comparePassword(res.rows[0].user_secret, req.body.password))
        {
            db.pool.end;
            req.body.last_secret = res.rows[0].last_secret;
            req.body.current_secret = res.rows[0].user_secret;
            next();
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
    passwordValidator
}