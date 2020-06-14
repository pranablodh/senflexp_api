const express                = require('express');
const router                 = express.Router();
const auth                   = require('../middleware/auth');
const adminValidator         = require('../middleware/empAdminValidator');
const testResults            = require('../database/admin/testResults');
const testReport             = require('../database/admin/testReport');
const login                  = require('../database/admin/login');
const logout                 = require('../database/common/logout');

router.post('/login', login.login);
router.delete('/logout', auth.authentication, adminValidator.empAdminValidator, logout.logout);
router.get('/testResults', auth.authentication, adminValidator.empAdminValidator, testResults.testResults);
router.post('/testReport', auth.authentication, adminValidator.empAdminValidator, testReport.testReport);


module.exports = 
{
    router
}