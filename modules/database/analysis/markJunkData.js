const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const markJunk = (req, response) =>
{
    const createQuery = `UPDATE lab_test_master ltm SET processed_flag = 'Z' WHERE ltm.ops_code = $1 AND processed_flag='N'`

    const values = 
    [
        req.body.ops_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {

        if(!err && res.rowCount == 1)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Junk Data Marked.', 'Data': []}); 
        }

        else if(!err && res.rowCount == 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Data Already Marked.', 'Data': []}); 
        }

        else
        {
            db.pool.end;
            debugLog('Junk Data: ', err);
            console.log(err)
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }
    });
}

module.exports = 
{
    markJunk
}