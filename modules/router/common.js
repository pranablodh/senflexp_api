const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../database/common/registration');
const signupRestrictor       = require('../middleware/signupRestrictor');
const login                  = require('../database/common/login');
const logout                 = require('../database/common/logout');
const authentication         = require('../middleware/auth');


router.post('/registration', signupRestrictor.signupRestrictor, userRegistration.newUser);
router.post('/login', login.login);
router.delete('/logout', authentication.authentication, logout.logout);

module.exports = 
{
    router
}