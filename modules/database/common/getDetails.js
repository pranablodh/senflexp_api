const db = require('../dbConnection/pgPool');

const getDetails = (req, response) =>
{
    const createQuery = `SELECT ui.full_name, ui.date_of_birth, um.activation_time, um.user_code, uc.primary_email, uc.primary_mobile,
    ua.address_type, ua.house_apartment, ua.locality, ua.pincode, ua.police_station, ua.post_office, ua.district, ua.landmark 
    FROM user_info ui
    INNER JOIN user_master um ON um.user_id = ui.user_id
    INNER JOIN user_contact_register uc ON uc.user_id = um.user_id
    INNER JOIN user_address ua ON ua.user_id = uc.user_id
    WHERE ui.user_id = (SELECT user_id FROM user_master WHERE user_code = $1)`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Get User Info: ', err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});               
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            console.log(res.rows)
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []}); 
        }
        
        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Status':true, 'Message': 'User Data Found.', 'Data': [res.rows[0]]}); 
        }
    });
}

module.exports = 
{
    getDetails
}