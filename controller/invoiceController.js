const dbConnection = require('../middleware/connection');

exports.createEstimateInvoice = async (req, res) => {
    try {
      const { data } = req.body;
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ Error: "Invalid or empty data array" });
      }
  
      const sql = "INSERT INTO invoice (tableCategory, itemName, itemValue, itemPrice, insurancePrice, jobID) VALUES (?, ?, ?, ?, ?, ?)";
  
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

//Get Invoice
exports.getInvoice = async(req, res)=>{
   try {
        const jobID = req.params.jobID;
        const sql = "SELECT invoiceID, tableCategory, itemName, itemValue, itemPrice, insurancePrice FROM invoice WHERE jobID = ?";
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

//Update Insurance
exports.updateInsurancePrice = async(req, res) =>{
    try {
       const invoiceID = req.params.invoiceID;
       const {insurancePrice} = req.body
       const sql = "UPDATE invoice SET insurancePrice = ? WHERE invoiceID = ?";
       const [result] = await dbConnection.execute(sql, [insurancePrice, invoiceID]);
       if(!result){
          res.status(404).json({error:"Data fetching error"});
       }else{
          res.status(200).json("Updation Successfull");
       }
    } catch (error) {
       console.error(error.message);
       res.status(500).json({ error: 'Internal Server Error' });
    }
 }
//Get Insurance price total
exports.getTotalInsurancePrice = async(req, res)=>{
    try {
       const jobID = req.params.jobID;
       const sql = "SELECT SUM(insurancePrice) AS totalInsurance FROM invoice WHERE jobID = ?";
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

 //Add new items to the invoice
 exports.addNewItemsToInvoice= async(req, res)=>{
  try {
    const {tableCategory, itemName, itemValue, insurancePrice, jobID} = req.body;
    const sql = "INSERT INTO invoice (tableCategory, itemName, itemValue, insurancePrice, jobID) VALUES (?, ?, ?, ?, ?)";
    const values = [tableCategory, itemName, itemValue, insurancePrice, jobID]
    const [result] = await dbConnection.execute(sql, values);

    if(result.affectedRows > 0){
      res.status(200).json({ success: true, Message: "Added new item successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 }

 //Delete item from invoice
 exports.deleteItemFromInvoice=async(req, res)=>{
  try {
    const invoiceID = req.params.invoiceID;
    const sql = "DELETE FROM invoice WHERE invoiceID = ?";
    const [result] = await dbConnection.execute(sql,[invoiceID]);

    if(result.affectedRows > 0){
      res.status(200).json("Deletion Successfull")
    }else{
      res.status(500).json("Deletion Failed")
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
 }