const express = require('express');
const router = express.Router();
const purchaseCompanyController = require('../controller/purchaseCompanyController');

//Create company
router.post('/createPurchaseCompany', purchaseCompanyController.createCompany);

//Fetch all companies
router.get('/companies', purchaseCompanyController.getAllCompanies);

//Update company
router.put('/updatePurchaseCompany/:companyID', purchaseCompanyController.updateCompany);

//Delete company
router.delete('/deletePurchaseCompany/:companyID', purchaseCompanyController.deleteCompany);

module.exports = router;