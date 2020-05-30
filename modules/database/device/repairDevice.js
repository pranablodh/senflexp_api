const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const repairDevice = (req, response) =>
{

    const createQuery = `UPDATE device_master SET repair_flag = 'Y', active_flag = 'N', 
    deactivation_time = CURRENT_TIMESTAMP WHERE device_id = $1 RETURNING serial_no`

    const values = 
    [
        req.body.device_id
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Repair Device: " + err);
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
            return response.status(200).send({'Status':true, 'Message': 'Device Added To Repairing List.', 'Data': [res.rows[0]]}); 
        }
    });
}

module.exports = 
{
    repairDevice      
}