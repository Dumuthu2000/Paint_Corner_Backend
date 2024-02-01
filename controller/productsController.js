const dbConnection = require('../middleware/connection');

//Get Parts
exports.getParts = async(req, res)=>{
   try {
        const sql = "SELECT itemID, itemName FROM items";
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
exports.addParts = async(req, res)=>{
    try {
        const {itemName} = req.body;

        //Check all fields are filled
        if(!itemName){
            return res.status(400).json({Error: "All fields are required"});
        }

        const sql = "INSERT INTO items (itemName) VALUES (?)";

        const [result] = await dbConnection.execute(sql, [itemName]);
        if(result.affectedRows > 0){
            res.status(200).json({success: true, Message: "New vehicle added successfully"})
        }else{
            res.status(500).json({Error: "Insertion error"});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 //Update Part from table
exports.updatePart = async(req, res) =>{
    try {
       const itemID = req.params.itemID;
       const {itemName} = req.body;

       const sql = "UPDATE items SET itemName = ? WHERE itemID = ?";
       const values = [itemName, itemID]
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
 exports.deletePart = async (req, res) => {
    try {
      const itemID = req.params.itemID;
      const sql = "DELETE FROM items WHERE itemID = ?";
      const [result] = await dbConnection.execute(sql, [itemID]);
  
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