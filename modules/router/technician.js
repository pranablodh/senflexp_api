const express                = require('express');
const router                 = express.Router();
const authentication         = require('../middleware/auth');
const selfDetails            = require('../database/technician/selfDetails');

router.post('/selfDetails', authentication.authentication, selfDetails.selfDetails);

module.exports = 
{
    router
}