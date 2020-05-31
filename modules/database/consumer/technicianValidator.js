const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');
const inputValidator        = require('../../inputValidator/inputValidator');

const technicianValidator = (req, response, next) =>
{   
    const createQuery = `SELECT technician_id FROM technician_master WHERE consumer_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1) AND technician_id = 
    (SELECT user_id FROM user_master WHERE user_code = $2)`

    const values = 
    [
        req.body.user_code,
        req.body.technician_user_code
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog("Technician Validator Consumer: " + err);
            return response.status(500).send({'Status':false, 'Message': 'Internal Server Error.', 'Data': []});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Status':false, 'Message': 'No Data Found, Check Technician Code.', 'Data': []}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            req.body.technician_id = res.rows[0].technician_id;
            next();
        }
    });
}

module.exports = 
{
    technicianValidator      
}