const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const deviceList = (req, response) =>
{   
    const createQuery = `SELECT cdl.status_flag, cdl.acquire_date, cdl.operational_time,
    cdl.deactivation_time, cdl.operation_cycle, dm.serial_no
    FROM consumer_device_list cdl
    INNER JOIN device_master dm ON cdl.device_id = dm.device_id
    WHERE consumer_id = (SELECT user_id FROM user_master WHERE user_code = $1)`

    const values = 
    [
        req.body.user_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Consumer Device List: " + err);
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
            return response.status(404).send({'Status':true, 'Message': 'Device List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    deviceList      
}