const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');
//Search job card details
router.get('/getJobDetails/:jobID', jobController.getJobDetails);

//Search job 
router.get('/searchJob/:jobID', jobController.searchJob);

//New job 
router.post('/createJob', jobController.newJob);

//Fetching Insurance
router.get('/insurance', jobController.insurance);

//Fetching Vehicle Model
router.get('/vehicle/model', jobController.vehicleModel)

//Fetching Vehicle Make
router.get('/vehicle/make', jobController.vehicleMake)

//Fetching Job Details for Job Card
router.get('/jobCard', jobController.searchJobCard)

module.exports = router;
