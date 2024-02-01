const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoiceController');

//Get Invoice
router.post('/createEstimateInvoice', invoiceController.createEstimateInvoice);

//Get Invoice
router.get('/getInvoice/:jobID', invoiceController.getInvoice);

//Update Insurance Price in invoice table
router.put('/updateInvoice/:invoiceID', invoiceController.updateInsurancePrice);

// //Get Company Total
// router.get('/itemTotal/:jobID', invoiceController.getTotalCompanyPrice);

//Get Insurance Total
router.get('/insuranceTotal/:jobID', invoiceController.getTotalInsurancePrice);

module.exports = router;
