const express = require('express');
const router = express.Router();
const estimatePreviewController = require('../controller/estimatePreviewController');

//Search job
router.get('/getEstimate/:jobID', estimatePreviewController.getEstimate);

//Getting total company price
router.get('/getTotalPrice/:jobID', estimatePreviewController.getTotalCompanyPrice);

//Delete estimate from table
router.delete('/deleteEstimate/:estimateID', estimatePreviewController.deleteEstimate);

module.exports = router;