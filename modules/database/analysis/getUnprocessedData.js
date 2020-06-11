const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testDetails = (req, response) =>
{    
    const createQuery = `SELECT lab_test_identification as test_id, consumer_id, technician_id, test_data, ioxy_data
    FROM lab_test_master WHERE processed_flag = 'N' LIMIT 1`

    db.pool.query(createQuery, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Analysis Get Test Data: ', err);
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