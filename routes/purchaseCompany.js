const express = require('express');
const router = express.Router();
const purchaseCompanyController = require('../controller/purchaseCompanyController');

//Fetch Items
router.get('/companies', purchaseCompanyController.getAllCompanies);

module.exports = router;