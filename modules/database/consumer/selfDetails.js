const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../logger/logger');

const selfDetails = (req, response) =>
{   

    const createQuery = `INSERT INTO consumer_master(consumer_id, lab_name) VALUES(
    (SELECT user_id FROM user_master WHERE user_code = $1 AND role_type_id = '3'), $2)`

    const values = 
    [
        req.body.user_code,
        req.body.lab_name
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Your Profile In Now Ready To Use.', 'Data': []});
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;
            
            if(err.detail.includes('consumer_id'))
            {
                return response.status(405).send({'Status':false, 'Message': 'You Have Already Gone Through This Process.', 
                'Data': []});
            }
        }

        else if(err.routine === 'ExecConstraints')
        {
            db.pool.end;
            
            if(err.detail.includes('Failing row contains'))
            {
                return response.status(401).send({'Status':false, 'Message': 'You Do Not Have The Permission For This.', 
                'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog("Consumer Self Details: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }
    });
}

module.exports = 
{
    selfDetails      
}