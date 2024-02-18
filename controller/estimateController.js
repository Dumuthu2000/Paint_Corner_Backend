const dbConnection = require('../middleware/connection');

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

  // Fetching job details for estimate preview page
exports.searchJobForEstimatePreview = async (req, res) => {
  try {
      const { jobID } = req.params;
      const sql = "SELECT * FROM job WHERE jobID = ?";
      const [result] = await dbConnection.execute(sql, [jobID]);

      if (result.length > 0) {
          const fetchFromEstimateSql = "SELECT jobID FROM estimate";
          const [result1] = await dbConnection.execute(fetchFromEstimateSql);

          // Using some() for cleaner array check
          const existsInEstimate = result1.some(estimate => estimate.jobID === result[0].jobID);

          if (existsInEstimate) {
              res.status(200).json(result);
          } else {
              res.status(404).json({ error: "Estimate Not Created Using This Job Number" });
          }
      } else {
          res.status(404).json({ error: "JobID not found in job table" });
      }
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.searchJobCardForCreateEstimate = async (req,res)=>{
  try {
    const jobID = req.params.jobID;
       const sql = `SELECT * FROM job WHERE jobID = ?`;
       const [result] = await dbConnection.execute(sql, [jobID]);
       if (result.length > 0) {
        const fetchFromEstimateSql = "SELECT jobID FROM `non-insurance-invoice`";
        const [result1] = await dbConnection.execute(fetchFromEstimateSql);

        const isExistInPersonal = result1.some(personal => personal.jobID === result[0].jobID);
        if(!isExistInPersonal){
          const estimateSql = "SELECT jobID FROM estimate";
          const [result2] = await dbConnection.execute(estimateSql);

          const isExistInEstimate = result2.some(personal => personal.jobID === result[0].jobID);

          if(!isExistInEstimate){
            res.status(200).json(result);
          }else{
            res.status(500).json({ error: 'Already having Estimate From This Job Number' });
          }

        }else{
          res.status(500).json({ error: 'Already having Personal Invoice From This Job Number' });
        }
      }
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
  
