const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const assignedDeviceList = (req, response) =>
{   
    const createQuery = `SELECT cdl.operational_time, dm.serial_no, um.user_code, ui.full_name
    FROM consumer_device_list cdl
    INNER JOIN user_master um ON um.user_id = cdl.technician_id
    INNER JOIN user_info ui ON ui.user_id = um.user_id
    INNER JOIN device_master dm ON dm.device_id = cdl.device_id
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
            debugLog("Consumer Assigned Device List: " + err);
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
            return response.status(404).send({'Status':true, 'Message': 'Assigned Device List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    assignedDeviceList      
}