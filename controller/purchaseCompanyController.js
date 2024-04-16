const dbConnection = require('../middleware/connection');

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

