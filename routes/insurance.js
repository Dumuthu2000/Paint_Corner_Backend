const express = require('express');
const router = express.Router();
const insuranceController = require('../controller/insuranceController')

//Fetch vehicles
router.get('/getInsurance', insuranceController.getInsurance);

//Add vehicle
router.post('/addInsurance', insuranceController.addInsurance);

//Update vehicle
router.put('/updateInsurance/:insuranceID', insuranceController.updateInsurance);

//Delete vehicle
router.delete('/deleteInsurance/:insuranceID', insuranceController.deleteInsurance);

//Delete vehicle
router.get('/searchInsurance', insuranceController.searchParts);


module.exports = router;