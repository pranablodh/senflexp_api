const express                = require('express');
const router                 = express.Router();
const login                  = require('../database/mobile/login');
const logout                 = require('../database/common/logout');
const authentication         = require('../middleware/auth');
const technicianValidator    = require('../middleware/technicianValidator');
const getUserInfo            = require('../database/mobile/getDetails');
const regenerateAccsessToken = require('../middleware/accessTokenRegeneration');
const assignedDevice         = require('../database/mobile/asignedDevice');
const submitTest             = require('../database/mobile/sumbitTest');
const testDetails            = require('../database/mobile/testDetails');

router.post('/login', login.login);
router.delete('/logout', authentication.authentication, technicianValidator.technicianValidator, logout.logout);
router.get('/userDetails', authentication.authentication, technicianValidator.technicianValidator, getUserInfo.getDetails);
router.get('/assignedDevice', authentication.authentication, technicianValidator.technicianValidator, assignedDevice.assignedDevice);
router.post('/newAccessToken', regenerateAccsessToken.accessTokenRegeneration);
router.post('/submitTest', authentication.authentication, technicianValidator.technicianValidator, submitTest.submitTest);
router.post('/testList', authentication.authentication, technicianValidator.technicianValidator, testDetails.testDetails);

module.exports = 
{
    router
}