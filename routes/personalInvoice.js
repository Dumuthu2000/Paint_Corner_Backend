const express = require('express');
const router = express.Router();
const personalController = require('../controller/personalInvoiceController')

//Fetch vehicles
router.post('/createPersonalInvoice', personalController.createPersonalInvoice);

//Search job
router.get('/searchJobForPersonalPreview/:jobID', personalController.searchJobCardForPersonalPreview);
//Add vehicle
router.get('/getPersonalInvoice/:jobID', personalController.getPersonalInvoice);

//Get total price
router.get('/getTotalItemPrice/:jobID', personalController.getTotalItemPrice);

//Delete vehicle
router.delete('/deletePersonalInvoice/:invoiceID', personalController.deletePersonalInvoice);


module.exports = router;
