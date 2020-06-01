const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testDetails = (req, response) =>
{
    const createQuery = `SELECT ltm.lab_test_identification as test_id, ltm.test_time, ltm.patient_name, ltm.picture,
    ltm.processed_flag, dm.serial_no
    FROM lab_test_master ltm
    INNER JOIN device_master dm ON dm.device_id = ltm.device_id
    WHERE technician_id = (SELECT user_id FROM user_master WHERE user_code = $1)
    AND consumer_id = (SELECT consumer_id FROM technician_master WHERE technician_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1))`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Mobile Get Test Info: ', err);
            console.log(err);
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