const dbConnection = require('../middleware/connection');

//Fetch estimate
exports.getSupplimentry = async(req, res)=>{
        try {
            const jobID = req.params.jobID;
            const supNo = req.params.supNo;
            // const {supNo} =  req.query;
             //Check search bar is filled
             if(!jobID || !supNo){
                return res.status(400).json({Error:"Job no is required"});
             }
             const sql = `SELECT supplimentryID, tableCategory, itemName, itemValue, itemPrice, insurancePrice FROM supplimentry WHERE jobID = ? AND supNo = ?`;
    
             const [result] = await dbConnection.execute(sql, [jobID, supNo]);
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

//Get company price total
exports.getTotalCompanyPrice = async(req, res)=>{
   try {
      const jobID = req.params.jobID;
      const supNo = req.params.supNo;
      const sql = "SELECT SUM(itemPrice) AS totalCompanySupplimentryAmount FROM supplimentry WHERE jobID = ? AND supNo = ?";
      const [result] = await dbConnection.execute(sql, [jobID, supNo]);
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

//Delete Supplimentry from table
exports.deleteSupplimentry = async (req, res) => {
   try {
     const supplimentryID = req.params.supplimentryID;
     const sql = "DELETE FROM supplimentry WHERE supplimentryID = ?";
     const [result] = await dbConnection.execute(sql, [supplimentryID]);
 
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

//Supplimentry Count
exports.getSupplimentryCount = async (req, res) => {
   try {
     const { jobID } = req.query;
     const sql = "SELECT MAX(supNo) AS currentSupNo FROM supplimentrycount WHERE jobID = ?";
     const [result] = await dbConnection.execute(sql, [jobID]);

     if(result.length > 0){
      res.status(200).json({ currentSupplimentry: result[0].currentSupNo });
   }else{
      res.status(404).json({error:"Data fetching error"});
   }
   } catch (error) {
     console.error(error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };

 //Create supplimentry count
 exports.supplimentryNumber= async(req, res)=>{
  try {
    const {jobID} = req.query;
    const sql = "SELECT * FROM supplimentrycount WHERE jobID = ?";
    const [result] = await dbConnection.execute(sql, [jobID]);

    if(result.length > 0){
      const getSupNoSql = "SELECT MAX(supNo) AS currentSupNo FROM supplimentrycount WHERE jobID = ?";
      const [result2] = await dbConnection.execute(getSupNoSql, [jobID]);
      if(result2.length > 0){
        const updatedSupNo = result2[0].currentSupNo + 1;
        const setSupNoSql = "INSERT INTO supplimentrycount (supNo, jobID) VALUES (?, ?)";
        const [result3] = await dbConnection.execute(setSupNoSql, [updatedSupNo, jobID]);
        if (result3.affectedRows > 0) {
          res.status(200).json("suppliment no Successful");
        } else {
          res.status(404).json({ error: "No record found for deletion" });
        }
      }else{
        res.status(404).json({ error: "Max sup no get error" });
      }
    }else{
      const addSql = "INSERT INTO supplimentrycount (supNo, jobID) VALUES (supNo + 1, ?)";
      const [result4] = await dbConnection.execute(addSql, [jobID]);
      if (result4.affectedRows > 0) {
        res.status(200).json("Insertion Successful");
      } else {
        res.status(404).json({ error: "No record found for deletion" });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 }





    