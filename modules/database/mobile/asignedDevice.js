const db = require('../dbConnection/pgPool');

const assignedDevice = (req, response) =>
{
    const createQuery = `SELECT serial_no FROM device_master WHERE device_id = 
    (SELECT device_id FROM consumer_device_list WHERE technician_id = 
    (SELECT user_id FROM user_master WHERE user_code = $1))`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Mobile Get User Info: ', err);
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
            return response.status(200).send({'Status':true, 'Message': 'Device Assigned To You.', 'Data': [res.rows[0]]}); 
        }
    });
}

module.exports = 
{
    assignedDevice
}