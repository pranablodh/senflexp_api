const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const repairRequest = (req, response) =>
{   
    const createQuery = `WITH
    upd1 AS(UPDATE consumer_device_list SET status_flag = 'I', deactivation_time = CURRENT_TIMESTAMP,
    operational_time = null, technician_id = null
    WHERE device_id = (SELECT device_id FROM device_master WHERE serial_no = $1)
    AND consumer_id = (SELECT user_id FROM user_master WHERE user_code = $2))
    UPDATE device_master SET repair_flag = 'Y', active_flag = 'N', 
    deactivation_time = CURRENT_TIMESTAMP WHERE serial_no = $1 RETURNING serial_no`

    const values = 
    [
        req.body.serial_no,
        req.body.user_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Consumer Repair Request: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'Failed To Generate Repair Request.', 'Data': []}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Repair Request Generated.', 
            'Data': [res.rows]});
        }
    });
}

module.exports = 
{
    repairRequest      
}