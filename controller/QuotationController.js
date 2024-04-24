const dbConnection = require('../middleware/connection');

exports.creatQuotation = async (req, res) => {
    try {
        const { vehicleNo, vehicleMake, vehicleModel, insuranceName, companyName, companyMobile, quotationTableData } = req.body;

        // Insert data into purchaseOrder table
        const sql = "INSERT INTO quotation (vehicleNo, vehicleMake, vehicleModel, insuranceName, companyName, companyMobile) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await dbConnection.execute(sql, [vehicleNo, vehicleMake, vehicleModel, insuranceName, companyName, companyMobile]);
        if (!result) {
            return res.status(500).json({ error: "Failed to create quotation table" });
        }
        console.log(result)
        const quotationID = result.insertId;
        // Insert data into quotation_item table
        const errors = [];
        for (const quotation of quotationTableData) {
            console.log(quotationTableData)
            const sql = "INSERT INTO quotation_item (quotationID, itemID, itemName, amount) VALUES (?, ?, ?, ?)";
            try {
                await dbConnection.execute(sql, [quotationID, quotation.itemID, quotation.itemName, quotation.amount]);
            } catch (error) {
                errors.push(error.message);
            }
        }
        if (errors.length > 0) {
            return res.status(500).json({ error: "Failed to create quotation_item table", details: errors });
        }
        return res.status(201).json({ message: "Quotation created successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getQuotation = async (req, res) => {
    try {
        // Step 1: Fetch the latest Quotations
        const sql = "SELECT * FROM quotation WHERE quotationID = (SELECT MAX(quotationID) FROM quotation)";
        const [quotationResult] = await dbConnection.execute(sql);

        if (quotationResult.length === 0) {
            return res.status(404).json({ error: "Quotation not found" });
        }

        const latestQuotation = quotationResult[0];
        const quotationID = latestQuotation.quotationID;

        // Step 2: Fetch purchase items associated with the latest purchase order
        const sql2 = `SELECT * FROM quotation_item WHERE quotationID = ?`;
        const [quotationItemResult] = await dbConnection.execute(sql2, [quotationID]);

        // Prepare response with both Quotations and its items
        const responseData = {
            quotation: latestQuotation,
            quotationItems: quotationItemResult
        };

        // Send response with the combined data
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getQuotationById = async (req, res) => {
    try {
        const {quotationID} = req.params
        const sql = "SELECT * FROM quotation WHERE quotationID = ?";
        const [quotationResult] = await dbConnection.execute(sql, [quotationID]);

        if (quotationResult.length === 0) {
            return res.status(404).json({ error: "Quotation not found" });
        }

        const latestQuotation = quotationResult[0];
        const orderID = latestQuotation.quotationID;
        const sql2 = `SELECT * FROM quotation_item WHERE quotationID = ?`;
        const [quotationItemResult] = await dbConnection.execute(sql2, [orderID]);

        const responseData = {
            quotation: latestQuotation,
            quotationItems: quotationItemResult
        };

        // Send response with the combined data
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching quotation:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Getting all Quotations
exports.allQuotations=async(req, res)=>{
    try {
        const sql = "SELECT * FROM quotation"
        const [result] =  await dbConnection.execute(sql);
        if(result.length == 0){
            res.status(401).json({Error: "Quotations are not available"})
        }
        res.status(200).json(result)
    } catch (error) {
        console.error("Error fetching quotation:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//Update Quotation
exports.updateQuotation = async (req, res) => {
    try {
        const { vehicleNo, vehicleMake, VehicleModel, insuranceName, companyName, companyMobile, quotationTableData } = req.body;
        const { quotationID } = req.params;

        // Update purchaseOrder table
        const updateQuotationSql = "UPDATE quotation SET vehicleNo=?, vehicleMake=?, VehicleModel=?, insuranceName=?, companyName=?, companyMobile=? WHERE quotationID=?";
        const updateQuotation = [vehicleNo, vehicleMake, VehicleModel, insuranceName, companyName, companyMobile, quotationID];
        const [updateOrderResult] = await dbConnection.execute(updateQuotationSql, updateQuotation);

        if (updateOrderResult.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update Quotation" });
        }

        // Update or Insert purchaseitem table
        const errors = [];
        for (const order of quotationTableData) {
            const { itemID, itemName, amount } = order;

            // Check if the record exists
            const checkExistingSql = "SELECT * FROM quotation_item WHERE quotationID=? AND itemID=?";
            const [existingRows] = await dbConnection.execute(checkExistingSql, [quotationID, itemID]);

            if (existingRows.length > 0) {
                // Record exists, perform UPDATE
                const updateItemSql = "UPDATE quotation_item SET itemName=?, amount=? WHERE quotationID=? AND itemID=?";
                const updateItemParams = [itemName, amount, quotationID, itemID];
                await dbConnection.execute(updateItemSql, updateItemParams);
            } else {
                // Record does not exist, perform INSERT
                const insertItemSql = "INSERT INTO quotation_item (quotationID, itemID, itemName, amount) VALUES (?, ?, ?, ?)";
                const insertItemParams = [quotationID, itemID, itemName, amount];
                try {
                    await dbConnection.execute(insertItemSql, insertItemParams);
                } catch (error) {
                    errors.push(error.message);
                }
            }
        }

        if (errors.length > 0) {
            return res.status(500).json({ error: "Failed to update quotation item table", details: errors });
        }

        return res.status(200).json({ message: "Quotation updated successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Delete Item
exports.deleteItemFromQuotation = async (req, res) => {
    try {
        const { quotationID } = req.params;
        const { itemID } = req.body;

        // Validate input parameters
        if (!quotationID || !itemID) {
            return res.status(400).json({ error: "Both quotationID and itemID are required" });
        }

        const sql = "DELETE FROM quotation_item WHERE quotationID = ? AND itemID = ?";
        const [result] = await dbConnection.execute(sql, [quotationID, itemID]);

        if (result && result.affectedRows > 0) {
            // Item successfully deleted
            return res.status(200).json({ message: "Item deleted successfully" });
        } else {
            // No item was deleted (could be because the item was not found)
            return res.status(404).json({ error: "No item found to delete" });
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//Get quotation items from job Number from estimate and supplimentry tables
exports.getItemsFromEstimate = async (req, res) => {
    try {
        const { tableCategory, jobID } = req.body;

        if (!jobID) {
            return res.status(400).json({ error: "Both jobID and tableCategory are required" });
        }

        // Query the 'estimate' table
        const estimateSql = "SELECT i.itemID, i.itemName FROM items i JOIN estimate e ON i.itemName = e.itemName WHERE e.tableCategory = ? AND e.jobID = ?";
        const [estimateResult] = await dbConnection.execute(estimateSql, [tableCategory, jobID]);

        if (!estimateResult || estimateResult.length === 0) {
            return res.status(404).json({ error: 'No items found in estimate for this jobID' });
        }

        // Query the 'supplimentry' table
        const supplimentrySql = `SELECT items.itemID, TRIM(SUBSTRING_INDEX(supplimentry.itemName, '(Supplimentry', 1)) AS itemName
        FROM items, supplimentry
        WHERE items.itemName = TRIM(SUBSTRING_INDEX(supplimentry.itemName, '(Supplimentry', 1))
          AND supplimentry.tableCategory = ?
          AND supplimentry.jobID = ?`
        const [supplimentryResult] = await dbConnection.execute(supplimentrySql, [tableCategory, jobID]);
        console.log(estimateResult)
        console.log(supplimentryResult)

        // Prepare response data
        const responseData = {
            estimateItems: estimateResult,
            supplimentryItems: supplimentryResult
        };

        // Send the combined response
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error retrieving items:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

