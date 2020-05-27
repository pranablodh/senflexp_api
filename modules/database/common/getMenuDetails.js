const db = require('../dbConnection/pgPool');

const getMenuDetails = (req, response) =>
{
    const createQuery = `SELECT uri, name, description FROM menu_master WHERE menu_id = ANY(SELECT menu_id FROM role_menu_map
    WHERE role_type_id = (SELECT role_type_id FROM user_master WHERE user_code = $1))`

    const values = 
    [
        req.body.user_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            debugLog('Get Menu List: ', err);
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
            return response.status(200).send({'Status':true, 'Message': 'Menu List Found For User.', 'Data': [res.rows]}); 
        }
    });
}

module.exports = 
{
    getMenuDetails
}