const express                = require('express');
const router                 = express.Router();
const analysisAuth           = require('../middleware/analysis');
const analysisData           = require('../database/analysis/getUnprocessedData');

router.get('/getTestData', analysisAuth.authentication, analysisData.testDetails);

module.exports = 
{
    router
}