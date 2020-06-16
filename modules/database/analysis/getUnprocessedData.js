const db = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const testDetails = (req, response) =>
{    
    const createQuery = `SELECT ltm.ops_code, ltm.test_data, ltm.ioxy_data, ltm.test_time, ltm.submission_time,
    ltm.lab_test_id, ltm.last_lab_test_id, pm.patient_name, pm.date_of_birth, pm.sex, pm.mobile, pm.email, 
    pm.patient_address, pm.picture as patient_picture, pm.phone_no_verification_flag, cm.lab_name, cm.split_lab_name, cm.lab_logo, ua.address_type, cm.website,
	ua.house_apartment || ', ' || ua.locality as con_adr1, 
	ua.city_village_id || ', ' || state_m.state_name || ', ' || country.nicename || ' - ' || ua.pincode as con_adr2, ucr.primary_email, 
    ucr.primary_mobile, dm.serial_no, um.user_code
    FROM lab_test_master ltm
    INNER JOIN patient_master pm ON pm.patient_id = ltm.patient_id
    INNER JOIN consumer_master cm ON cm.consumer_id = ltm.consumer_id
    INNER JOIN user_address ua ON ua.user_id = ltm.consumer_id
    INNER JOIN user_contact_register ucr ON ucr.user_id = ltm.consumer_id
    INNER JOIN device_master dm ON dm.device_id = ltm.device_id
    INNER JOIN user_master um ON um.user_id = ltm.technician_id
	INNER JOIN state_master state_m ON ua.state_id=state_m.state_id
	INNER JOIN country_master country ON country.country_id=ua.country_id
	--INNER JOIN city_village_master cvm ON cvm.city_village_id=ua.city_village_id
    WHERE ltm.processed_flag = 'N'
    ORDER BY "submission_time" DESC
    LIMIT 1`

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