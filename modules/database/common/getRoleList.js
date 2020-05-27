const db = require('../dbConnection/pgPool');

const getRoleList = (req, response) =>
{
    const createQuery = `SELECT role_type FROM role_master`

    db.pool.query(createQuery, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Get Role List: ', err);
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
            var role_type = []

            for(i = 0; i < res.rows.length; i++)
            {
                role_type.push(res.rows[i].role_type);
            }

            return response.status(200).send({'Status':true, 'Message': 'Role List Found.', 'Data': [{Role_Type: role_type}]}); 
        }
    });
}

module.exports = 
{
    getRoleList
}