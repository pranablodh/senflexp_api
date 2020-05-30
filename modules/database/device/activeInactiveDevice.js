const db                    = require('../dbConnection/pgPool');
const { infoLog, debugLog } = require('../../logger/logger');

const activeInactiveList = (req, response) =>
{
    if(req.body.active_flag != 'Y' &&  req.body.active_flag != 'N')
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Choice.', 'Data': []});
    }

    const createQuery = `SELECT device_id, serial_no, active_flag FROM device_master WHERE active_flag = $1`

    const values = 
    [
        req.body.active_flag
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            //debugLog("Add Device: " + err);
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
            return response.status(200).send({'Status':true, 'Message': 'Device List Found.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    activeInactiveList      
}