const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../database/common/registration');
const signupRestrictor       = require('../middleware/signupRestrictor');
const login                  = require('../database/common/login');
const logout                 = require('../database/common/logout');
const authentication         = require('../middleware/auth');
const getUserInfo            = require('../database/common/getDetails');
const getMenuDetails         = require('../database/common/getMenuDetails');
const getRoleList            = require('../database/common/getRoleList');
const regenerateAccsessToken = require('../middleware/accessTokenRegeneration');
const passwordValidator      = require('../database/common/passwordValidator');
const changePassword         = require('../database/common/changePassword');


router.post('/registration', authentication.authentication, signupRestrictor.signupRestrictor, userRegistration.newUser);
router.post('/login', login.login);
router.delete('/logout', authentication.authentication, logout.logout);
router.get('/userDetails', authentication.authentication, getUserInfo.getDetails);
router.get('/menuList', authentication.authentication, getMenuDetails.getMenuDetails);
router.get('/roleList', getRoleList.getRoleList);
router.post('/newAccessToken', regenerateAccsessToken.accessTokenRegeneration);
router.post('/changePassword', authentication.authentication, passwordValidator.passwordValidator, changePassword.changePassword);

module.exports = 
{
    router
}