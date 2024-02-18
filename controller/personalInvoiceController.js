const dbConnection = require('../middleware/connection');

exports.createPersonalInvoice = async (req, res) => {
    try {
      const { data } = req.body;
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ Error: "Invalid or empty data array" });
      }
  
      const sql = "INSERT INTO `non-insurance-invoice` (tableCategory, itemName, itemValue, itemPrice, jobID) VALUES (?, ?, ?, ?, ?)";
  
      for (const item of data) {
        const {
          tableCategory,
          itemName,
          itemValue,
          itemPrice,
          jobID
        } = item;
  
        // Replace undefined values with null
        const values = [
          tableCategory || null,
          itemName || null,
          itemValue || null,
          itemPrice || null,
          jobID || null
        ];
  
        await dbConnection.execute(sql, values);
      }
  
      res.status(200).json({ success: true, Message: "Personal Invoice created successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//Get Invoice
exports.getPersonalInvoice = async(req, res)=>{
   try {
        const jobID = req.params.jobID;
        const sql = "SELECT invoiceID, tableCategory, itemName, itemValue, itemPrice FROM `non-insurance-invoice` WHERE jobID = ?";
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

exports.getTotalItemPrice = async(req, res)=>{
    try {
       const jobID = req.params.jobID;
       const sql = "SELECT SUM(itemPrice) AS totalItemPrice FROM `non-insurance-invoice` WHERE jobID = ?";
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
exports.deletePersonalInvoice = async (req, res) => {
    try {
      const invoiceID = req.params.invoiceID;
      const sql = "DELETE FROM `non-insurance-invoice` WHERE invoiceID = ?";
      const [result] = await dbConnection.execute(sql, [invoiceID]);
  
      // Check if affectedRows is greater than 0 to ensure that a record was deleted
      if (result.affectedRows > 0) {
        res.status(200).json("Deletion Successful");
      } else {
        res.status(404).json({ error: "No record found for deletion" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  //Search Job for report
exports.searchJobCardForPersonalPreview = async (req,res)=>{
  try {
    const jobID = req.params.jobID;
       const sql = `SELECT * FROM job WHERE jobID = ?`;
       const [result] = await dbConnection.execute(sql, [jobID]);
       if (result.length > 0) {
        const fetchFromEstimateSql = "SELECT jobID FROM `non-insurance-invoice`";
        const [result1] = await dbConnection.execute(fetchFromEstimateSql);

        const isExist = result1.some(personal => personal.jobID === result[0].jobID);
        if(!isExist){
          res.status(500).json({ error: 'Not Personal Invoice From This Job Number' });

        }else{
          res.status(200).json(result);
        }
      }
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}
