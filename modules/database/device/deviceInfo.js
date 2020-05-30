const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const deviceInfo = (req, response) =>
{
    const createQuery = `SELECT dm.mac_address, dm.active_flag, dm.activation_time, dm.deactivation_time, dm.repair_flag,
    dm.serial_no, dim.service_uuid, dim.battery_service_uuid, dim.die_temperature_uuid, dim.sensor_device_uuid,
    dim.manufacturer_name, dim.manufacture_date, dim.batch_no FROM device_master dm
    INNER JOIN device_info_master dim ON dim.device_info_id = dm.device_info_id
    WHERE dm.device_id = $1`

    const values = 
    [
        req.body.device_id
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Device Info: " + err);
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
            return response.status(200).send({'Status':true, 'Message': 'Information Found For This Device.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    deviceInfo      
}