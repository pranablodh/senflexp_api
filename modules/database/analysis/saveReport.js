const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const submitReport = (req, response) =>
{
    console.log(req.body.test_graph)
    const createQuery = `WITH
    upd AS(UPDATE lab_test_master SET processed_flag = 'Y' WHERE ops_code = $1)
    INSERT INTO report_master(lab_test_id, roi_data, report, test_graph, test_result) VALUES
    ((SELECT patient_id FROM lab_test_master WHERE ops_code = $1), $2, $3, $4, $5) RETURNING report`

    const values = 
    [
        req.body.ops_code,
        req.body.roi_data,
        req.body.report,
        req.body.test_graph,
        req.body.test_result
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {

        if(!err && res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Report Generated.', 'Data': []}); 
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;

            if(err.detail.includes('lab_test_id'))
            {
                return response.status(405).send({'Status':false, 'Message': 'Report Already Generated.', 'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog('Report Generation: ', err);
            console.log(err)
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }
    });
}

module.exports = 
{
    submitReport
}