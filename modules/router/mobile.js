const express                = require('express');
const router                 = express.Router();
const login                  = require('../database/mobile/login');
const logout                 = require('../database/common/logout');
const authentication         = require('../middleware/auth');
const technicianValidator    = require('../middleware/technicianValidator');
const getUserInfo            = require('../database/common/getDetails');
const regenerateAccsessToken = require('../middleware/accessTokenRegeneration');

router.post('/login', login.login);
router.delete('/logout', authentication.authentication, technicianValidator.technicianValidator, logout.logout);
router.get('/userDetails', authentication.authentication, technicianValidator.technicianValidator, getUserInfo.getDetails);
router.post('/newAccessToken', regenerateAccsessToken.accessTokenRegeneration);

module.exports = 
{
    router
}