const express                = require('express');
const router                 = express.Router();
const authentication         = require('../middleware/auth');
const empAdminValidator      = require('../middleware/empAdminValidator');
const addBatch               = require('../database/device/addBatch');
const addDevice              = require('../database/device/addDevice');
const batchInfo              = require('../database/device/batchInfo');
const deviceInfo             = require('../database/device/deviceInfo');
const deviceList             = require('../database/device/deviceList');
const activeInactiveDevice   = require('../database/device/activeInactiveDevice');
const activateDevice         = require('../database/device/activateDevice');
const deactivateDevice       = require('../database/device/deactivateDevice');
const repairDevice           = require('../database/device/repairDevice');
const repairedDevice         = require('../database/device/repairedDevice');
const reparingQueue          = require('../database/device/repairingQueue');


router.post('/addBatch', authentication.authentication, empAdminValidator.empAdminValidator, addBatch.addbatch);
router.post('/addDevice', authentication.authentication, empAdminValidator.empAdminValidator, addDevice.addDevice);
router.get('/batchInfo', authentication.authentication, empAdminValidator.empAdminValidator, batchInfo.batchInfo);
router.get('/deviceInfo', authentication.authentication, empAdminValidator.empAdminValidator, deviceInfo.deviceInfo);
router.get('/deviceList', authentication.authentication, empAdminValidator.empAdminValidator, deviceList.deviceList);
router.get('/activeInactiveDevice', authentication.authentication, empAdminValidator.empAdminValidator, activeInactiveDevice.activeInactiveList);
router.put('/activateDevice', authentication.authentication, empAdminValidator.empAdminValidator, activateDevice.activateDevice);
router.put('/deactivateDevice', authentication.authentication, empAdminValidator.empAdminValidator, deactivateDevice.deactivateDevice);
router.put('/addToRepairList', authentication.authentication, empAdminValidator.empAdminValidator, repairDevice.repairDevice);
router.put('/repairedDevice', authentication.authentication, empAdminValidator.empAdminValidator, repairedDevice.repairedDevice);
router.get('/reparingQueue', authentication.authentication, empAdminValidator.empAdminValidator, reparingQueue.repairingQueue);

module.exports = 
{
    router
}