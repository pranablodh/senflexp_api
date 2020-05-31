const express                = require('express');
const router                 = express.Router();
const authentication         = require('../middleware/auth');
const consumerValidator      = require('../middleware/consumerValidator');
const selfTechValidator      = require('../database/consumer/technicianValidator');
const selfDetails            = require('../database/consumer/selfDetails');
const assignDevice           = require('../database/consumer/assignDeviceTechnician');
const revokeDevice           = require('../database/consumer/revokeDevice');
const deviceList             = require('../database/consumer/deviceList');
const techList               = require('../database/consumer/technicianList');
const assignedDeviceList     = require('../database/consumer/assignedDeviceList');
const repairRequest          = require('../database/consumer/repairRequest');
const activateDevice         = require('../database/consumer/activateDevice');
const deactivateDevice       = require('../database/consumer/deactivateDevice');

router.post('/selfDetails', authentication.authentication, selfDetails.selfDetails);
router.put('/assignDevice', authentication.authentication, consumerValidator.consumerValidator, selfTechValidator.technicianValidator, assignDevice.assignToTechnician);
router.put('/revoke', authentication.authentication, consumerValidator.consumerValidator, selfTechValidator.technicianValidator, revokeDevice.revokeDevice);
router.get('/deviceList', authentication.authentication, deviceList.deviceList);
router.get('/techList', authentication.authentication, techList.technicianList);
router.get('/assignedDevice', authentication.authentication, assignedDeviceList.assignedDeviceList);
router.put('/repairRequest', authentication.authentication, repairRequest.repairRequest);
router.put('/activateDevice', authentication.authentication, activateDevice.activateDevice);
router.put('/deactivateDevice', authentication.authentication, deactivateDevice.deactivateDevice);

module.exports = 
{
    router
}