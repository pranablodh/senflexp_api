const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const randomMac             = require('random-mac');
const { infoLog, debugLog } = require('../../logger/logger');

const addDevice = (req, response) =>
{
    const createQuery = `INSERT INTO device_master(device_id, mac_address, device_info_id, serial_no)
    VALUES((SELECT coalesce(max(device_id)+1, 1) FROM device_master), $2, (SELECT device_info_id FROM
    device_info_master WHERE batch_no = $1), $3) RETURNING device_id, mac_address`

    const values = 
    [
        req.body.batch_no,
        randomMac('00:05'),
        req.body.serial_no
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Device Successfully Added.', 'Data': [res.rows[0]]});
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;
            
            if(err.detail.includes('serial_no'))
            {
                return response.status(405).send({'Status':false, 'Message': 'Device with that Serial Number Already Exists.', 'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog("Add Device: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }
    });
}

module.exports = 
{
    addDevice      
}