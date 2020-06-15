const express                = require('express');
const router                 = express.Router();
const auth                   = require('../middleware/admin');
const adminValidator         = require('../middleware/empAdminValidator');
const testResults            = require('../database/admin/testResults');
const testReport             = require('../database/admin/testReport');

router.get('/testResults', auth.authentication, testResults.testResults);
//router.post('/testReport', auth.authentication, testReport.testReport);


module.exports = 
{
    router
}