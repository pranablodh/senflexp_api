const db                    = require('../dbConnection/pgPool');
const inputValidator        = require('../../inputValidator/inputValidator');
const { infoLog, debugLog } = require('../../logger/logger');

const getPincode = (req, response) =>
{

    if(!inputValidator.isvalidPinCode(req.body.pincode)) 
    {
        return response.status(400).send({'Status':false, 'Message': 'Invalid Pincode.', 'Data': []});
    }
    
    const createQuery = ``

    const values = 
    [
        req.body.pincode
    ];
}

module.exports = 
{
    getPincode
}