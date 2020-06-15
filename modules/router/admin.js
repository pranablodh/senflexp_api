const express                = require('express');
const router                 = express.Router();
const auth                   = require('../middleware/admin');
const testResults            = require('../database/admin/testResults');

router.get('/testResults', auth.authentication, testResults.testResults);

module.exports = 
{
    router
}