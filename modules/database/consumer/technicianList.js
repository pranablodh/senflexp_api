const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const technicianList = (req, response) =>
{   
    const createQuery = `SELECT ui.full_name, ui.date_of_birth, um.user_code, uc.primary_email, uc.primary_mobile,
    ua.address_type, ua.house_apartment, ua.locality, ua.pincode, ua.police_station, ua.post_office, ua.district,
    ua.landmark
    FROM user_info ui
    INNER JOIN user_master um ON um.user_id = ui.user_id
    INNER JOIN user_contact_register uc ON uc.user_id = um.user_id
    INNER JOIN user_address ua ON ua.user_id = uc.user_id
    WHERE ui.user_id = ANY(SELECT technician_id FROM technician_master WHERE consumer_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1))`

    const values = 
    [
        req.body.user_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Consumer Device List: " + err);
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
            return response.status(404).send({'Status':true, 'Message': 'Technician List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    technicianList      
}