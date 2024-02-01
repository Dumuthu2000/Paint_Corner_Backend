const dbConnection = require('../middleware/connection');

//Search Job no from Estimate table
exports.searchEstimateJob = async (req,res)=>{
    try {
        const jobID = req.params.jobID;
         //Check search bar is filled
         if(!jobID){
            return res.status(400).json({Error:"Job no is required"});
         }
         const sql = `SELECT j.accidentDate, j.vehicleNo, j.vehicleModel, j.customerName, j.customerMobile, j.insuranceName FROM job AS j INNER JOIN estimate AS e ON j.jobID = e.jobID WHERE e.jobID = ?`;

         const [result] = await dbConnection.execute(sql, [jobID]);
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
//Search Job no from job table
exports.searchJob = async (req,res)=>{
    try {
        const jobID = req.params.jobID;
         //Check search bar is filled
         if(!jobID){
            return res.status(400).json({Error:"Job no is required"});
         }
         const sql = `SELECT accidentDate, vehicleNo, vehicleModel, customerName, customerMobile, insuranceName FROM job WHERE jobID = ?`;

         const [result] = await dbConnection.execute(sql, [jobID]);
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

//----------------------------------------------------------------------------------------------------------------------------------------------------------
//Select Items
exports.getItems = async (req, res)=>{
    try {
        const sql = "SELECT itemName FROM items";
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

//Create Estimate
exports.createEstimate = async (req, res) => {
    try {
      const { data } = req.body;
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ Error: "Invalid or empty data array" });
      }
  
      const sql = "INSERT INTO estimate (tableCategory, itemName, itemValue, itemPrice, insurancePrice, jobID) VALUES (?, ?, ?, ?, ?, ?)";
  
      for (const item of data) {
        const {
          tableCategory,
          itemName,
          itemValue,
          itemPrice,
          insurancePrice,
          jobID
        } = item;
  
        // Replace undefined values with null
        const values = [
          tableCategory || null,
          itemName || null,
          itemValue || null,
          itemPrice || null,
          insurancePrice || null,
          jobID || null
        ];
  
        await dbConnection.execute(sql, values);
      }
  
      res.status(200).json({ success: true, Message: "Estimate created successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  //Check already having estimates job no
  exports.checkEstimates = async(req, res)=>{
    try {
        const sql = "SELECT DISTINCT jobID FROM estimate";
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
  
  