const express = require('express');
const router = express.Router();
const quotationController = require('../controller/QuotationController');

//Create Quotations order
router.post('/createQuotation', quotationController.creatQuotation);

//Fetch Quotations order
router.get('/getQuotation', quotationController.getQuotation);

//Fetch Quotations order by ID
router.get('/getQuotation/:quotationID', quotationController.getQuotationById);

//Fetch all purchase orders
router.get('/quotations', quotationController.allQuotations);

//Update Quotation
router.put('/updatequotation/:quotationID', quotationController.updateQuotation);

//Fetch all purchase orders
router.delete('/deleteQuotation/:quotationID', quotationController.deleteItemFromQuotation);

//Fetch items from estimate
router.post('/getItems', quotationController.getItemsFromEstimate);
module.exports = router;