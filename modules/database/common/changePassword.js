const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const { infoLog, debugLog } = require('../../logger/logger');

const changePassword = (req, response) =>
{
    if(!inputValidator.isValidPassword(req.body.new_password)) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Password Length Should Be In Between 8 to' +  
        ' 15 and Must Contain Atleast One Upper Case, One Lower Case, One Number and One Special Character.', 'Data': []});
    }

    if(inputValidator.comparePassword(req.body.current_secret, req.body.new_password))
    {
        return response.status(403).send({'Status':false, 'Message': 'Old and New Password Can Not Be Same', 'Data': []});
    }

    if(req.body.last_secret != null)
    {
        let count = 0;
        const last_secret = req.body.last_secret;

        for(i = 0; i < last_secret.length; i++)
        {
            if(inputValidator.comparePassword(last_secret[i], req.body.new_password))
            {
                count++;
            }
        }

        if(count != 0)
        {
            return response.status(403).send({'Status':false, 'Message': 'You Have Used This Password Before, Please Use a New One',
            'Data': []});
        }
    }

    const createQuery = `UPDATE user_secret set user_secret = $1, last_secret = ARRAY_APPEND(last_secret, 
    (SELECT user_secret FROM user_secret WHERE user_id = (SELECT user_id FROM user_master WHERE user_code = $2)))
    where user_id = (SELECT user_id FROM user_master WHERE user_code = $2) RETURNING *`

    const values = 
    [
        inputValidator.hashPassword(req.body.new_password),
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            debugLog('Password Change: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});    
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Password Successfully Changed.', 'Data': []});    
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }
    });
}

module.exports = 
{
    changePassword
}