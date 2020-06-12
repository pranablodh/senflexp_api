const express                = require('express');
const router                 = express.Router();
const analysisAuth           = require('../middleware/analysis');
const analysisData           = require('../database/analysis/getUnprocessedData');
const saveReport             = require('../database/analysis/saveReport');

router.get('/getTestData', analysisAuth.authentication, analysisData.testDetails);
router.post('/submitReport', analysisAuth.authentication, saveReport.submitReport);

module.exports = 
{
    router
}