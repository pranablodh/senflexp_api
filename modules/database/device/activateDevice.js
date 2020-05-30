const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const activateDevice = (req, response) =>
{

    const createQuery = `UPDATE device_master SET active_flag = 'Y', activation_time = CURRENT_TIMESTAMP
    WHERE device_id = $1 RETURNING activation_time`

    const values = 
    [
        req.body.device_id
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Activate Device: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Device Activated.', 'Data': [res.rows[0]]}); 
        }
    });
}

module.exports = 
{
    activateDevice      
}