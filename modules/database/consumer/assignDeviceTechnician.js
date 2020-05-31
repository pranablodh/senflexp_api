const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const assignToTechnician = (req, response) =>
{   
    const createQuery = `UPDATE consumer_device_list SET technician_id = $1, status_flag = 'O', 
    operational_time = CURRENT_TIMESTAMP WHERE device_id = (SELECT device_id FROM device_master WHERE
    serial_no = $2 AND active_flag = 'Y' AND repair_flag = 'N') AND status_flag != 'I' 
    AND consumer_id = (SELECT user_id FROM user_master WHERE user_code = $3)
    RETURNING operational_time`

    const values = 
    [
        req.body.technician_id,
        req.body.serial_no,
        req.body.user_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Assign Device to Technician: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'Failed To Assign This Device.', 'Data': []}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Device Successfully Assigned.', 
            'Data': [res.rows]});
        }
    });
}

module.exports = 
{
    assignToTechnician      
}