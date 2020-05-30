const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const batchInfo = (req, response) =>
{
    const createQuery = `SELECT service_uuid, battery_service_uuid, die_temperature_uuid, sensor_device_uuid, manufacturer_name,
    manufacture_date, batch_no FROM device_info_master`

    db.pool.query(createQuery, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Batch Info: " + err);
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
            return response.status(200).send({'Status':true, 'Message': 'Batch List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    batchInfo      
}