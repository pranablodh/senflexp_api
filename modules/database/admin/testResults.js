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
            let object = [];
            for(var i = 0; i < res.rows.length; i++)
            {
                object.push({   
                                "lab_test_identification": res.rows[i].lab_test_identification,
                                "ops_code": res.rows[i].ops_code,
                                "patient_name": res.rows[i].patient_name,
                                "dob": res.rows[i].dob,
                                "sex": res.rows[i].sex,
                                "mobile": res.rows[i].mobile,
                                "email": res.rows[i].email,
                                "lab_name": res.rows[i].lab_name,
                                "Link":"Download Report",
                                "Link_image":"See Graph",
                                "uri": "https://api.senflex.in/files/report.pdf",
                                "uri_image": "https://api.senflex.in/image/001.jpeg"
                            });
            }
            return response.status(200).send({'Status':true, 'Message': 'Test Result Found.', 'Data': object}); 
        }
    });
}

module.exports = 
{
    testResults
}