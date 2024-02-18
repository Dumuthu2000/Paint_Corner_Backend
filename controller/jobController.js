const dbConnection = require('../middleware/connection');
require('dotenv').config();

exports.getJobDetails = async(req, res)=>{
    try {
        const {jobID} = req.params;
        const sql = "SELECT * FROM job WHERE jobID = ?";
        const [result] = await dbConnection.execute(sql, [jobID]);

        if(result.length > 0){
            res.status(200).json(result);
        }else{
            res.status(404).json({Error: "Job details fetching error"})
        }
    } catch (error) {
        
    }
}

// Fetching job details for personal invoice create page
exports.searchJob = async (req, res) => {
    try {
        const { jobID } = req.params;
        const sql = "SELECT * FROM job WHERE jobID = ?";
        const [result] = await dbConnection.execute(sql, [jobID]);

        if (result.length > 0) {
            const fetchFromEstimateSql = "SELECT jobID FROM estimate";
            const [result1] = await dbConnection.execute(fetchFromEstimateSql);

            // Using some() for cleaner array check
            const existsInEstimate = result1.some(estimate => estimate.jobID === result[0].jobID);

            if (!existsInEstimate) {
                const fetchFromPersonalSql = "SELECT jobID FROM `non-insurance-invoice`";
                const [result2] = await dbConnection.execute(fetchFromPersonalSql);

                // Using some() for cleaner array check
                const existsInPersonal = result2.some(personal => personal.jobID === result[0].jobID);
                if(!existsInPersonal){
                    res.status(200).json(result);
                }else{
                    res.status(404).json({ error: "Already Created Personal Invoice From This Job Number" });
                }
                
            } else {
                res.status(404).json({ error: "Already having Estimate from this job no" });
            }
        } else {
            res.status(404).json({ error: "JobID not found in job table" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




//Create new Job
exports.newJob = async (req, res)=>{
    try {
        const {vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, inDate, accidentDate} = req.body;
        const convertedDate = new Date(inDate).toISOString().split('T')[0];
        const convertedAccidentDate = new Date(accidentDate).toISOString().split('T')[0];

        //Check all fields are filled
        if(!vehicleNo || !insuranceName || !vehicleMake || !vehicleModel || !customerName || !customerAddress || !customerMobile || !convertedDate || !convertedAccidentDate){
            return res.status(400).json({Error: "All fields are required"});
        }

        const sql = "INSERT INTO job (vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, inDate, accidentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [vehicleNo, insuranceName, vehicleMake, vehicleModel, customerName, customerAddress, customerMobile, convertedDate, convertedAccidentDate];

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
