const db                    = require('../database/dbConnection/pgPool');
const { infoLog, debugLog } = require('../logger/logger');

const empAdminValidator = (req, response, next) =>
{   
    const createQuery = `SELECT role_type_id FROM user_master WHERE user_code = $1`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Emp Admin Validator: " + err);
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

            if(res.rows[0].role_type_id != '1' && res.rows[0].role_type_id != '2')
            {
                return response.status(403).send({'Status':false, 'Message': 'You Are Not Authorized To DO This Operation.',
                'Data': []});
            }

            next();
        }
    });
}

module.exports = 
{
    empAdminValidator
}