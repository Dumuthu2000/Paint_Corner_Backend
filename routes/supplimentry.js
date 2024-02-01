const express = require('express');
const router = express.Router();
const supplimentryController = require('../controller/supplimentryController');

//Create new Estimate
router.post('/createSupplimentry', supplimentryController.createSupplimentry);

module.exports = router;