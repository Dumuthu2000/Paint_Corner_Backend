const express = require('express');
const router = express.Router();
const estimateController = require('../controller/estimateController');

//Search job from job table
router.get('/searchEstimateJob/:jobID', estimateController.searchJob);

//Search job from estimate table
router.get('/searchJob/:jobID', estimateController.searchEstimateJob);

//Fetch Items
router.get('/items', estimateController.getItems);

//Creaet new Estimate
router.post('/createEstimate', estimateController.createEstimate);

//Check available Estimates job no
router.get('/availableEstimates', estimateController.checkEstimates);

module.exports = router;