const dbConnection = require('../middleware/connection');

exports.createCompany = async (req, res)=>{
    try {
        const {companyName, contactNumber} = req.body;
        const sql = "INSERT INTO purchase_company (companyName, contactNumber) VALUES (?, ?)";
        const [result] = await dbConnection.execute(sql, [companyName, contactNumber]);

        if(!result){
            return res.status(500).json({ error: "Not company data in the table" });
        }else{
            res.status(200).json("New company created successfully");
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getAllCompanies = async (req, res) => {
    try {
        const sql = "SELECT * FROM purchase_company";
        const [result] = await dbConnection.execute(sql);

        if(!result){
            return res.status(500).json({ error: "Not company data in the table" });
        }else{
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error });
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const { companyID } = req.params;
        const { companyName, contactNumber } = req.body;

        const sql = "UPDATE purchase_company SET companyName=?, contactNumber=? WHERE companyID = ?";
        const [result] = await dbConnection.execute(sql, [companyName, contactNumber, companyID]);

        // Check if any rows were affected
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Company is updated" });
        } else {
            res.status(404).json({ error: "Company not found or no changes applied" });
        }
    } catch (error) {
        // Handle any caught errors
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const { companyID } = req.params;

        const sql = "DELETE FROM purchase_company WHERE companyID = ?";
        const [result] = await dbConnection.execute(sql, [companyID]);

        // Check if any rows were affected
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Company is Deleted" });
        } else {
            res.status(404).json({ error: "Company not found or no changes applied" });
        }
    } catch (error) {
        // Handle any caught errors
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


