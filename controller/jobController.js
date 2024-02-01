const dbConnection = require('../middleware/connection');
require('dotenv').config();
const jwt = require('jsonwebtoken');

//Fetching Insurance Companies
// Fetching Insurance Companies
exports.searchJob = async (req, res) => {
    try {
        const { jobID } = req.params; // Correct destructuring
        const sql = "SELECT * FROM job WHERE jobID = ?";
        const [result] = await dbConnection.execute(sql, [jobID]);
        if (!result) {
            res.status(404).json({ error: "Data fetching error" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//Create new Job
exports.newJob = async (req, res)=>{
    try {
        const {vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, inDate, accidentDate} = req.body;

        //Check all fields are filled
        if(!vehicleNo || !insuranceName || !vehicleMake || !vehicleModel || !customerName || !customerAddress || !customerMobile || !inDate || !accidentDate){
            return res.status(400).json({Error: "All fields are required"});
        }

        const sql = "INSERT INTO job (vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, inDate, accidentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, inDate, accidentDate];

        const [result] = await dbConnection.execute(sql, values);
        if(result.affectedRows > 0){
            res.status(200).json({success: true, Message: "Job created successfully"})
        }else{
            res.status(500).json({Error: "Insertion error"});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Fetching Insurance Companies
exports.insurance = async (req, res)=>{
    try {
        const sql = "SELECT insuranceName FROM insurance";
        const [result] = await dbConnection.execute(sql);
        if(!result){
            res.status(404).json({error:"Data fetching error"});
         }else{
            res.status(200).json(result);
         }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Fetching Insurance Companies
exports.vehicleMake = async (req, res)=>{
    try {
        const sql = "SELECT DISTINCT make FROM vehicle";
        const [result] = await dbConnection.execute(sql);
        if(!result){
            res.status(404).json({error:"Data fetching error"});
         }else{
            res.status(200).json(result);
         }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Fetching Insurance Companies
exports.vehicleModel = async (req, res)=>{
    try {
        const sql = "SELECT model FROM vehicle";
        const [result] = await dbConnection.execute(sql);
        if(!result){
            res.status(404).json({error:"Data fetching error"});
         }else{
            res.status(200).json(result);
         }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Search Job for report
exports.searchJobCard = async (req,res)=>{
    try {
         const sql = `SELECT jobID, vehicleNo, insuranceName, vehicleMake, vehicleModel, customerAddress, customerMobile, inDate FROM job WHERE jobID = (SELECT MAX(jobID) FROM job)`;

         const [result] = await dbConnection.execute(sql);
         if(!result){
            res.status(404).json({error:"Data fetching error"});
         }else{
            res.status(200).json(result);
         }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}