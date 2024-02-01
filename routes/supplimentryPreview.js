const express = require('express');
const router = express.Router();
const supplimentryPreviewController = require('../controller/supplimentryPreviewController');

//Search job
router.get('/getSupplimenrty/:jobID/:supNo', supplimentryPreviewController.getSupplimentry);

//Getting total company price
router.get('/getSupplimentryTotalPrice/:jobID/:supNo', supplimentryPreviewController.getTotalCompanyPrice);

//Delete estimate from table
router.delete('/deleteSupplimentry/:supplimentryID', supplimentryPreviewController.deleteSupplimentry);

//Create supplimentry count
router.get('/updateSupplimentryCount', supplimentryPreviewController.supplimentryNumber);

//Fetch supplimentry count
router.get('/getSupplimentryCount', supplimentryPreviewController.getSupplimentryCount);

module.exports = router;