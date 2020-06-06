const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const submitTest = (req, response) =>
{

    if(!inputValidator.isValidDate(req.body.dob))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Date.', 'Data': []});
    }

    if(!inputValidator.isValidEmail(req.body.email))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Email ID.', 'Data': []});
    }

    if(!inputValidator.isValidMobileNumber(req.body.mobile))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Mobile Number.', 'Data': []});
    }

    if(!inputValidator.isValidString(req.body.patient_name))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Name.', 'Data': []});
    }    

    if(!req.body.device_id)
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Device ID.', 'Data': []});
    }

    if(!req.body.address)
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Address.', 'Data': []});
    }

    if(!inputValidator.isVaidBase64String(req.body.test_data))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Test Data.', 'Data': []});
    }

    if(!inputValidator.isVaidBase64String(req.body.picture))
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Picture Data.', 'Data': []});
    }

    if(req.body.sex != 'Male' & req.body.sex != 'Female' & req.body.sex != 'Other')
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Gender.', 'Data': []});
    }

    const createQuery = `WITH
    upd AS(UPDATE consumer_device_list SET operation_cycle = (SELECT coalesce(max(operation_cycle)+1, 1) FROM consumer_device_list
    WHERE device_id = (SELECT device_id FROM consumer_device_list WHERE device_id = (SELECT device_id FROM device_master
    WHERE serial_no = $2))))
    INSERT INTO lab_test_master(lab_test_id, lab_test_identification, consumer_id, technician_id, device_id, test_time, 
    patient_name, date_of_birth, sex, mobile, patient_address, email, picture, test_data, ioxy_data) VALUES((SELECT coalesce(max(lab_test_id)+1, 1)
    FROM lab_test_master), $1, (SELECT consumer_id FROM consumer_master WHERE consumer_id = (SELECT consumer_id FROM technician_master
    WHERE technician_id = (SELECT user_id FROM user_master WHERE user_code = $10))),
    (SELECT technician_id FROM technician_master WHERE technician_id = (SELECT user_id FROM user_master WHERE user_code = $10)),
    (SELECT device_id FROM consumer_device_list WHERE technician_id = (SELECT user_id FROM user_master WHERE user_code = $10)
    AND device_id = (SELECT device_id FROM device_master WHERE serial_no = $2)), CURRENT_TIMESTAMP, $3, $4, $5, $6, $11, $7, $8, $9, 
    $12) RETURNING *`

    const values = 
    [
        req.body.test_id,
        req.body.device_id,
        req.body.patient_name,
        req.body.dob,
        req.body.sex,
        req.body.mobile,
        req.body.email,
        req.body.picture,
        req.body.test_data,
        req.body.user_code,
        req.body.address,
        req.body.ioxy_data
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {

        if(!err && res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'Test Data Saved.',
            'Data': [res.rows[0].lab_test_identification]}); 
        }

        else if(err.routine === 'ExecConstraints')
        {
            db.pool.end;

            if(err.detail.includes('Failing row contains'))
            {
                return response.status(401).send({'Status':false, 'Message': 'You Are Not Authorized To Test With This Device.', 
                'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog('Mobile Submit Test: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }
    });
}

module.exports = 
{
    submitTest
}