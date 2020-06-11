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

    if(req.body.sex != 'Male' & req.body.sex != 'Female' & req.body.sex != 'Other')
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Gender.', 'Data': []});
    }

    const createQuery = `WITH
    data(patient_name, date_of_birth, sex, mobile, email, address, picture, phone_no_verification_flag, test_id, device_id, test_time, 
    test_data, ioxy_data, last_lab_test_id, ops_code, user_code)
    AS(VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)),
    upd AS(UPDATE consumer_device_list SET operation_cycle = (SELECT coalesce(max(operation_cycle)+1, 1) FROM consumer_device_list
    WHERE device_id = (SELECT device_id FROM consumer_device_list WHERE device_id = (SELECT device_id FROM device_master
    WHERE serial_no = $2)))),
    ins1 AS(INSERT INTO patient_master(patient_id, patient_name, date_of_birth, sex, mobile, email, patient_address, picture, 
    phone_no_verification_flag) SELECT(SELECT coalesce(max(patient_id)+1, 1) FROM patient_master), patient_name, CAST(date_of_birth AS 
    DATE), sex, mobile, email, address, picture, phone_no_verification_flag FROM data)
    INSERT INTO lab_test_master(lab_test_id, lab_test_identification, device_id, consumer_id, technician_id, test_time,
    submission_time, ops_code, patient_id, test_data, ioxy_data, last_lab_test_id)
    SELECT (SELECT coalesce(max(lab_test_id)+1, 1) FROM lab_test_master), test_id, (SELECT device_id FROM consumer_device_list WHERE
    technician_id = (SELECT user_id FROM user_master WHERE user_code = $15)
    AND device_id = (SELECT device_id FROM device_master WHERE serial_no = $10)), (SELECT consumer_id FROM consumer_master WHERE 
    consumer_id = (SELECT consumer_id FROM technician_master WHERE technician_id = (SELECT user_id FROM user_master WHERE 
    user_code = $15))), (SELECT technician_id FROM technician_master WHERE technician_id = (SELECT user_id FROM user_master WHERE 
    user_code = $15)), test_time::timestamp, CURRENT_TIMESTAMP, $16, (SELECT coalesce(max(patient_id)+1, 1) 
    FROM patient_master), test_data, ioxy_data, last_lab_test_id FROM data RETURNING *`

    const values = 
    [
        req.body.patient_name,
        req.body.dob,
        req.body.sex,
        req.body.mobile,
        req.body.email,
        req.body.address,
        req.body.picture,
        req.body.veri_flag,
        req.body.test_id,
        req.body.device_id,
        req.body.test_time,
        req.body.test_data,
        req.body.ioxy_data,
        req.body.last_lab_test_id,
        req.body.user_code,
        req.body.ops_code
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

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;

            if(err.detail.includes('ops_code'))
            {
                return response.status(405).send({'Status':false, 'Message': 'Duplicate Entry, Please Check the Inputs.', 'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog('Mobile Submit Test: ', err);
            console.log(err)
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }
    });
}

module.exports = 
{
    submitTest
}