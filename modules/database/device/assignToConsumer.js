const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const assignToConsumer = (req, response) =>
{   
    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Please Enter a Valid Email Address or Mobile Number', 'Data': []});
    }

    const createQuery = `INSERT INTO consumer_device_list(consumer_id, device_id) VALUES(
    (SELECT consumer_id FROM consumer_master WHERE consumer_id = (SELECT user_id FROM 
    user_master WHERE user_code = $1 AND role_type_id = '3')), (SELECT device_id FROM 
    device_master WHERE serial_no = $2 AND active_flag = 'Y' AND repair_flag = 'N')) RETURNING *`

    const values = 
    [
        req.body.user_code,
        req.body.serial_no
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(201).send({'Status':true, 'Message': 'Device Successfully Assigned.', 
            'Data': [res.rows.acquire_date]});
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;

            if(err.detail.includes('Key (device_id)'))
            {
                return response.status(405).send({'Status':false, 'Message': 'Device With That Serial Number Is Already Assigned To Someone.', 
                'Data': []});
            }
        }

        else if(err.routine === 'ExecConstraints')
        {
            db.pool.end;
            
            if(err.detail.includes('Failing row contains'))
            {
                return response.status(401).send({'Status':false, 'Message': 'This Device Can Not Be Assigned To This User.', 
                'Data': []});
            }
        }

        else
        {
            db.pool.end;
            debugLog("Assign Device to Consumer: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }
    });
}

module.exports = 
{
    assignToConsumer      
}