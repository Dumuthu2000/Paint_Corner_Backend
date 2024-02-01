const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController')

//Fetch vehicles
router.get('/getVehicles', vehicleController.getVehicles);

//Add vehicle
router.post('/addVehicle', vehicleController.addVehicle);

//Update vehicle
router.put('/updateVehicle/:vehicleID', vehicleController.updateVehicle);

//Delete vehicle
router.delete('/deleteVehicle/:vehicleID', vehicleController.deleteVehicle);


module.exports = router;