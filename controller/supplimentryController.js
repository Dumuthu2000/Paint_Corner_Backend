const dbConnection = require('../middleware/connection');

exports.createSupplimentry = async(req, res) =>{
    try {
        const { data } = req.body;
    
        if (!data || !Array.isArray(data) || data.length === 0) {
          return res.status(400).json({ Error: "Invalid or empty data array" });
        }
    
        const sql = "INSERT INTO supplimentry (tableCategory, itemName, itemValue, itemPrice, insurancePrice, supNo, jobID) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
        for (const item of data) {
          const {
            tableCategory,
            itemName,
            itemValue,
            itemPrice,
            insurancePrice,
            supNo,
            jobID
          } = item;
    
          // Replace undefined values with null
          const values = [
            tableCategory || null,
            itemName || null,
            itemValue || null,
            itemPrice || null,
            insurancePrice || null,
            supNo || null,
            jobID || null
          ];
    
          await dbConnection.execute(sql, values);
        }
    
        res.status(200).json({ success: true, Message: "Supplimentry created successfully" });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}