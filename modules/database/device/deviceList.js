const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const deviceList = (req, response) =>
{
    const createQuery = `SELECT serial_no, active_flag FROM device_master`

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
    deviceList      
}