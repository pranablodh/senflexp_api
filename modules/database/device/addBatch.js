const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const { infoLog, debugLog } = require('../../logger/logger');
const { v5:uuidv5 }        = require('uuid');

const addbatch = (req, response) =>
{
    
    const createQuery = `INSERT INTO device_info_master(device_info_id, service_uuid, battery_service_uuid, die_temperature_uuid,
    sensor_device_uuid, device_id_uuid, manufacturer_name, batch_no)VALUES((SELECT coalesce(max(device_info_id)+1, 1) FROM 
    device_info_master), $1, $2, $3, $4, $5, $6, $7) RETURNING service_uuid, battery_service_uuid, die_temperature_uuid,
    sensor_device_uuid, device_id_uuid`

    const values = 
    [
        uuidv5('https://senflex.in/service/' + Date.now(), uuidv5.URL),
        uuidv5('https://senflex.in/battery/' + Date.now(), uuidv5.URL),
        uuidv5('https://senflex.in/temperature/' + Date.now(), uuidv5.URL),
        uuidv5('https://senflex.in/sensor/' + Date.now(), uuidv5.URL),
        uuidv5('https://senflex.in/device_id' + Date.now(), uuidv5.URL),
        req.body.manufacturer_name,
        req.body.batch_no
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Batch Successfully Added.', 'Data': [res.rows[0]]});
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;
            
            if(err.detail.includes('batch_no'))
            {
                return response.status(405).send({'Status':false, 'Message': 'This Batch Number Already Exists.', 'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog("Add Batch: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }
    });
}

module.exports = 
{
    addbatch      
}