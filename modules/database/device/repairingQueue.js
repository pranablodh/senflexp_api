const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const repairingQueue = (req, response) =>
{
    const createQuery = `SELECT device_id, serial_no FROM device_master WHERE repair_flag = 'Y'`

    db.pool.query(createQuery, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Device Lits: " + err);
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
            return response.status(200).send({'Status':true, 'Message': 'Device List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    repairingQueue      
}