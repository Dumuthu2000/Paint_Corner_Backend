const dbConnection = require('../middleware/connection');

//Fetch estimate
exports.getEstimate = async(req, res)=>{
        try {
            const jobID = req.params.jobID;
             //Check search bar is filled
             if(!jobID){
                return res.status(400).json({Error:"Job no is required"});
             }
             const sql = `SELECT estimateID, tableCategory, itemName, itemValue, itemPrice, insurancePrice FROM estimate WHERE jobID = ?`;
    
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

//Get company price total
exports.getTotalCompanyPrice = async(req, res)=>{
   try {
      const jobID = req.params.jobID;
      const sql = "SELECT SUM(itemPrice) AS totalCompanyAmount FROM estimate WHERE jobID = ?";
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
//Delete Estimate from table
exports.deleteEstimate = async (req, res) => {
   try {
     const estimateID = req.params.estimateID;
     const sql = "DELETE FROM estimate WHERE estimateID = ?";
     const [result] = await dbConnection.execute(sql, [estimateID]);
 
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
 
    