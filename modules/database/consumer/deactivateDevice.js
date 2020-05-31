const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const deactivateDevice = (req, response) =>
{   
    const createQuery = `UPDATE consumer_device_list SET status_flag = 'I', operational_time = null,
    deactivation_time = CURRENT_TIMESTAMP, technician_id = null WHERE device_id = 
    (SELECT device_id FROM device_master WHERE serial_no = $1 AND active_flag = 'Y'
    AND repair_flag = 'N') AND consumer_id = (SELECT user_id FROM user_master 
    WHERE user_code = $2) RETURNING *`

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
            debugLog("Consumer Deactivate Device: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'Failed To Deactivate This Device.', 'Data': []}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Device Deactivated.', 
            'Data': [{'Status': res.rows[0].status_flag}]});
        }
    });
}

module.exports = 
{
    deactivateDevice      
}