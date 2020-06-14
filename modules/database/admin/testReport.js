const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testReport = (req, response) =>
{    
    const createQuery = `SELECT processed_data, roi_data, report, test_result, report_generation_time
    FROM report_master WHERE lab_test_id = (SELECT lab_test_id FROM lab_test_master WHERE ops_code = $1)`

    const values =
    [
        req.body.ops_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Get Test Report: ', err);
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
            return response.status(200).send({'Status':true, 'Message': 'Test Report Found.', 'Data': res.rows}); 
        }
    });
}

module.exports = 
{
    testReport
}