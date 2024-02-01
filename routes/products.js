const express = require('express');
const router = express.Router();
const productsController = require('../controller/productsController')

//Fetch vehicles
router.get('/getParts', productsController.getParts);

//Add vehicle
router.post('/addParts', productsController.addParts);

//Update vehicle
router.put('/updatePart/:itemID', productsController.updatePart);

//Delete vehicle
router.delete('/deletePart/:itemID', productsController.deletePart);

//Delete vehicle
router.get('/searchParts', productsController.searchParts);


module.exports = router;