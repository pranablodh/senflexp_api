const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const opsCodeGen = (req, response, next) =>
{    
    const createQuery = `SELECT md5((SELECT consumer_id FROM technician_master WHERE technician_id = (SELECT user_id FROM user_master
    WHERE user_code = $1)) || '-' || (SELECT user_id FROM user_master WHERE user_code = $1) || '-' ||
    (SELECT device_id FROM consumer_device_list WHERE consumer_id = (SELECT consumer_id FROM technician_master WHERE technician_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1))) || '-' || (SELECT coalesce(max(lab_test_id)+1, 1) FROM lab_test_master) 
    || '-' || (SELECT coalesce(max(patient_id)+1, 1) FROM patient_master))
    AS operational_code FROM (VALUES($1)) AS data(userCode)`

    const values = 
    [
        req.body.user_code,
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Ops Code Gen: ', err);
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
            req.body.ops_code = res.rows[0].operational_code;
            next();
        }
    });
}

module.exports = 
{
    opsCodeGen
}