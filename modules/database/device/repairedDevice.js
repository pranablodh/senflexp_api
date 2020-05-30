const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const repairedDevice = (req, response) =>
{
    const createQuery = `UPDATE device_master SET repair_flag = 'N', active_flag = 'Y', 
    activation_time = CURRENT_TIMESTAMP, deactivation_time = null WHERE serial_no = $1 RETURNING serial_no`

    const values = 
    [
        req.body.serial_no
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
            return response.status(200).send({'Status':true, 'Message': 'Device Repaired, Ready To Use Again.', 'Data': [res.rows[0]]}); 
        }
    });
}

module.exports = 
{
    repairedDevice      
}