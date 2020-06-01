const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testDetails = (req, response) =>
{
    const createQuery = `SELECT ltm.lab_test_identification as test_id, ltm.test_time, ltm.patient_name, 
    ltm.date_of_birth, ltm.sex, ltm.mobile, ltm.email, ltm.picture, ltm.processed_flag, ltm.comment, 
    um.user_code as technician_code, ui.full_name as technician_name, dm.serial_no as device_serial
    FROM lab_test_master ltm
    INNER JOIN device_master dm ON dm.device_id = ltm.device_id
    INNER JOIN user_master um ON um.user_id = ltm.technician_id
    INNER JOIN user_info ui ON ui.user_id = ltm.technician_id
    WHERE consumer_id = (SELECT user_id FROM user_master WHERE user_code = $1)`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Consumer Get Test Info: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            console.log(res.rows)
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }
        
        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Test Data Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    testDetails
}