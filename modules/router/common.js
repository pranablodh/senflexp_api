const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../database/common/registration');

router.post('/registration', userRegistration.newUser);

module.exports = 
{
    router
}