const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testDetails = (req, response) =>
{    
    const createQuery = `SELECT ltm.lab_test_identification as test_id, ltm.test_time, ltm.submission_time,
    ltm.processed_flag, pm.picture, pm.patient_name, dm.serial_no
    FROM lab_test_master ltm
    INNER JOIN patient_master pm ON pm.patient_id = ltm.patient_id
    INNER JOIN device_master dm ON dm.device_id = ltm.device_id
    WHERE technician_id = (SELECT user_id FROM user_master WHERE user_code = $1)
    AND consumer_id = (SELECT consumer_id FROM technician_master WHERE technician_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1)) AND pm.patient_name LIKE $2
    ORDER BY "test_time" DESC
    LIMIT 10 OFFSET $3`

    const values = 
    [
        req.body.user_code,
        `%${req.body.name}%`,
        req.body.offset
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
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }
        
        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Test Data Found.', 'Data': res.rows}); 
        }
    });
}

module.exports = 
{
    testDetails
}