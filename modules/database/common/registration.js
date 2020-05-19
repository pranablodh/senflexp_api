const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');

const newUser = (req, response) =>
{
    // if(!req.body.company_name || !req.body.registration_number || !req.body.address_1 
    //     || !req.body.address_2 || !req.body.address_3 || !req.body.district)
    // {
    //     return response.status(400).send({'Message': 'Some Values Are Missing.'});
    // }

    // if(!inputValidator.isValidMobileNumber(req.body.contact_number)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid Mobile Number.'});
    // }

    // if(!inputValidator.isValidEmail(req.body.email)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid Email Address.'});
    // }

    // if(!inputValidator.isValidPassword(req.body.password)) 
    // {
    //     return response.status(400).send({'Message': 'Password Length Should Be In Between 8 to 15 and Must Contain Atleast' + 
    //    ' One Upper Case, One Lower Case, One Number and One Special Character.'});
    // }

    // if(!inputValidator.isvalidGSTIN(req.body.gstin)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid GSTIN.'});
    // }

    // if(!inputValidator.isValidString(req.body.owner_name)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid Name.'});
    // }

    // if(!inputValidator.isValidString(req.body.city)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid City Name.'});
    // }

    // if(!inputValidator.isValidString(req.body.state)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Valid State Name.'});
    // }

    // if(!inputValidator.isvalidPinCode(req.body.pin_code)) 
    // {
    //     return response.status(400).send({'Message': 'Please Enter a Pin Code.'});
    // }


    const createQuery = `WITH data(first_name, middle_name, last_name, date_of_birth, honorifics, user_secret, primary_email, 
    primary_mobile, address_type, house_apartment, locality, pincode, police_station, district, landmark, post_office, role_type,
    state_name, country_name)
    AS(VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)),
    ins1 AS(INSERT INTO user_master(user_id, role_type_id, role_serial, user_code)
    SELECT (SELECT coalesce(max(user_id)+1, 1) FROM user_master), (SELECT role_type_id FROM role_master WHERE role_type = $17), 
    (SELECT coalesce(max(role_serial)+1, (SELECT serial FROM role_master WHERE role_type = $17)) FROM user_master), 
    (SELECT role_type_value || to_char(now(), 'YY') || (SELECT coalesce(max(role_serial)+1, 
    (SELECT serial FROM role_master WHERE role_type = $17)) FROM user_master) || serial FROM role_master WHERE role_type = $17)),
    ins2 AS(INSERT INTO user_address(user_id, slno, address_type, house_apartment, locality, pincode,
    police_station, post_office, district, state_id, country_id, landmark)
    SELECT (SELECT coalesce(max(user_id)+1, 1) FROM user_master), (SELECT coalesce(max(slno)+1, 1) FROM user_address), 
    address_type, house_apartment, locality, pincode, police_station, post_office, district, 
    (SELECT state_id FROM state_master WHERE state_name = $18),
    (SELECT country_id FROM country_master WHERE country_name = $19), landmark FROM data),
    ins3 AS(INSERT INTO user_contact_register(user_id, primary_email, primary_mobile) 
    SELECT (SELECT coalesce(max(user_id)+1, 1) FROM user_master), primary_email, primary_mobile FROM data),
    ins4 AS(INSERT INTO user_secret(user_id, user_secret, last_secret, last_reset_time) SELECT 
    (SELECT coalesce(max(user_id)+1, 1) FROM user_master), user_secret, ARRAY[user_secret]::TEXT[], 
    current_timestamp FROM data)
    INSERT INTO user_info(user_id, first_name, middle_name, last_name, date_of_birth, honorifics, full_name) 
    SELECT (SELECT coalesce(max(user_id)+1, 1) FROM user_master), first_name, middle_name, last_name, CAST(date_of_birth AS DATE), 
    honorifics, CONCAT(honorifics, ' ', first_name, ' ', middle_name, ' ', last_name) FROM data RETURNING user_id`

    const values = 
    [
        req.body.first_name,
        req.body.middle_name,
        req.body.last_name,
        req.body.date_of_birth,
        req.body.honorifics,
        inputValidator.hashPassword(req.body.password),
        req.body.primary_email,
        req.body.primary_mobile,
        req.body.address_type,
        req.body.house_apartment,
        req.body.locality,
        req.body.pincode,
        req.body.police_station,
        req.body.district,
        req.body.landmark,
        req.body.post_office,
        req.body.role_type,
        req.body.state_name, 
        req.body.country_name
    ];


    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
            return response.status(400).send({'Message': 'Error'});
        }

        else
        {
            //console.log(res.rows);
            return response.status(400).send({'Message': res.rows});
        }
    });
}

module.exports = 
{
    newUser      
}