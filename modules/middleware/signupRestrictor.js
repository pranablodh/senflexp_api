const db                    = require('../database/dbConnection/pgPool');
const { infoLog, debugLog } = require('../logger/logger');

const signupRestrictor = (req, response, next) =>
{   
    const createQuery = `SELECT * FROM (SELECT privilege FROM role_master WHERE role_type_id = 
    (SELECT role_type_id FROM user_master WHERE user_code = $1)) a CROSS JOIN (SELECT role_type_value 
    FROM role_master WHERE role_type = $2) b`

    const values = 
    [
        req.body.user_code,
        req.body.role_type
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Signup Restrictor: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'No Data Found.', 'Data': []});
        }

        else
        {
            db.pool.end;
            var count = 0;
            for(i = 0; i < res.rows[0].privilege.length; i++)
            {
                if(res.rows[0].privilege[i] === res.rows[0].role_type_value)
                {
                    count++;
                }
            }

            if(count === 0)
            {
                return response.status(401).send({'Status':false, 'Message': 'Access Denied.', 'Data': []});
            }

            else
            {
                next();
            }
        }
    });
}

module.exports = 
{
    signupRestrictor
}