const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testResults = (req, response) =>
{    
    const createQuery = `SELECT ltm.lab_test_identification, ltm.ops_code, pm.patient_name,
    to_char(pm.date_of_birth, 'MM-DD-YYYY') as dob, pm.sex, pm.mobile, pm.email, cm.lab_name
    FROM lab_test_master ltm
    INNER JOIN patient_master pm ON pm.patient_id = ltm.patient_id
    INNER JOIN consumer_master cm ON cm.consumer_id = ltm.consumer_id
    WHERE ltm.processed_flag = 'Y'
    ORDER BY "test_time" DESC`

    db.pool.query(createQuery, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Get Test Results: ', err);
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
            return response.status(200).send({'Status':true, 'Message': 'Test Result Found.', 'Data': res.rows}); 
        }
    });
}

module.exports = 
{
    testResults
}