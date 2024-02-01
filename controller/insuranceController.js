const dbConnection = require('../middleware/connection');

//Get Parts
exports.getInsurance = async(req, res)=>{
   try {
        const sql = "SELECT insuranceID, insuranceName, insuranceMobile FROM insurance";
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

//Add Part
exports.addInsurance = async(req, res)=>{
    try {
        const {insuranceName, insuranceMobile} = req.body;

        //Check all fields are filled
        if(!insuranceName || !insuranceMobile){
            return res.status(400).json({Error: "All fields are required"});
        }

        const sql = "INSERT INTO insurance (insuranceName, insuranceMobile) VALUES (?, ?)";

        const [result] = await dbConnection.execute(sql, [insuranceName, insuranceMobile]);
        if(result.affectedRows > 0){
            res.status(200).json({success: true, Message: "New Insurance Company added successfully"})
        }else{
            res.status(500).json({Error: "Insertion error"});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 //Update Part from table
exports.updateInsurance = async(req, res) =>{
    try {
       const insuranceID = req.params.insuranceID;
       const {insuranceName, insuranceMobile} = req.body;

       const sql = "UPDATE insurance SET insuranceName = ?, insuranceMobile = ? WHERE insuranceID = ?";
       const values = [insuranceName, insuranceMobile, insuranceID]
       const [result] = await dbConnection.execute(sql, values);
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
 
 //Delete Vehicle from table
 exports.deleteInsurance = async (req, res) => {
    try {
      const insuranceID = req.params.insuranceID;
      const sql = "DELETE FROM insurance WHERE insuranceID = ?";
      const [result] = await dbConnection.execute(sql, [insuranceID]);
  
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

  //Search Parts
exports.searchParts = async(req, res)=>{
    try {
        const {searchWord} = req.body
         const sql = "SELECT itemID, itemName FROM items WHERE itemName LIKE ?";
         const [result] = await dbConnection.execute(sql, [`%${searchWord}%`]);
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