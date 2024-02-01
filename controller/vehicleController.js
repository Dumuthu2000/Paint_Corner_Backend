const dbConnection = require('../middleware/connection');

//Get Vehicles
exports.getVehicles = async(req, res)=>{
   try {
        const sql = "SELECT vehicleID, model, make FROM vehicle";
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

//Add Vehicle
exports.addVehicle = async(req, res)=>{
    try {
        const {model, make} = req.body;

        //Check all fields are filled
        if(!model || !make){
            return res.status(400).json({Error: "All fields are required"});
        }

        const sql = "INSERT INTO vehicle (model, make) VALUES (?, ?)";
        const values = [model, make];

        const [result] = await dbConnection.execute(sql, values);
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

 //Update Vehicle from table
exports.updateVehicle = async(req, res) =>{
    try {
       const vehicleID = req.params.vehicleID;
       const {model, make} = req.body;

       const sql = "UPDATE vehicle SET model = ?, make = ? WHERE vehicleID = ?";
       const values = [model, make, vehicleID]
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
 exports.deleteVehicle = async (req, res) => {
    try {
      const vehicleID = req.params.vehicleID;
      const sql = "DELETE FROM vehicle WHERE vehicleID = ?";
      const [result] = await dbConnection.execute(sql, [vehicleID]);
  
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