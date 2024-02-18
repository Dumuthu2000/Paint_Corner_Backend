const express = require('express');
const router = express.Router();
const estimateController = require('../controller/estimateController');

//Fetch Items
router.get('/items', estimateController.getItems);


//Creaet new Estimate
router.post('/createEstimate', estimateController.createEstimate);

//Fetch Items
router.get('/getEstimateJobDetails/:jobID', estimateController.searchJobForEstimatePreview);


//Get Insurance Total
router.get('/searchJobCardForCreateEstimate/:jobID', estimateController.searchJobCardForCreateEstimate);
module.exports = router;
