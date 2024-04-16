const dbConnection = require('../middleware/connection');

exports.createPurchaseOrder = async (req, res) => {
    try {
        const { vehicleNo, vehicleMake, vehicleModel, issuedDate, companyName, purchaseTableData } = req.body;

        // Insert data into purchaseOrder table
        const sql = "INSERT INTO purchaseorder (vehicleNo, vehicleMake, vehicleModel,  companyName, issuedDate) VALUES (?, ?, ?, ?, ?)";
        const [result] = await dbConnection.execute(sql, [vehicleNo, vehicleMake, vehicleModel, companyName, issuedDate]);
        if (!result) {
            return res.status(500).json({ error: "Failed to create purchaseOrder table" });
        }
        console.log(result)
        const order_id = result.insertId;
        // Insert data into purchase_item table
        const errors = [];
        for (const order of purchaseTableData) {
            console.log(purchaseTableData)
            const sql = "INSERT INTO purchaseitem (order_id, item_id, itemName, itemPrice, itemQty) VALUES (?, ?, ?, ?, ?)";
            try {
                await dbConnection.execute(sql, [order_id, order.item_id, order.itemName, order.itemPrice, order.itemQty]);
            } catch (error) {
                errors.push(error.message);
            }
        }
        

        if (errors.length > 0) {
            return res.status(500).json({ error: "Failed to create purchase_item table", details: errors });
        }

        return res.status(201).json({ message: "Purchase order created successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getPurchaseOrder = async (req, res) => {
    try {
        // Step 1: Fetch the latest purchase order
        const sql = "SELECT * FROM purchaseorder WHERE poID = (SELECT MAX(poID) FROM purchaseOrder)";
        const [purchaseOrderResult] = await dbConnection.execute(sql);

        if (purchaseOrderResult.length === 0) {
            return res.status(404).json({ error: "Purchase order not found" });
        }

        const latestPurchaseOrder = purchaseOrderResult[0];
        const orderID = latestPurchaseOrder.poID;

        // Step 2: Fetch purchase items associated with the latest purchase order
        const sql2 = `SELECT * FROM purchaseItem WHERE order_id = ?`;
        const [purchaseItemResult] = await dbConnection.execute(sql2, [orderID]);

        // Prepare response with both purchase order and its items
        const responseData = {
            purchaseOrder: latestPurchaseOrder,
            purchaseItems: purchaseItemResult
        };

        // Send response with the combined data
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPurchaseOrderById = async (req, res) => {
    try {
        const {poID} = req.params
        const sql = "SELECT * FROM purchaseorder WHERE poID = ?";
        const [purchaseOrderResult] = await dbConnection.execute(sql, [poID]);

        if (purchaseOrderResult.length === 0) {
            return res.status(404).json({ error: "Purchase order not found" });
        }

        const latestPurchaseOrder = purchaseOrderResult[0];
        const orderID = latestPurchaseOrder.poID;

        // Step 2: Fetch purchase items associated with the latest purchase order
        const sql2 = `SELECT * FROM purchaseItem WHERE order_id = ?`;
        const [purchaseItemResult] = await dbConnection.execute(sql2, [orderID]);

        // Prepare response with both purchase order and its items
        const responseData = {
            purchaseOrder: latestPurchaseOrder,
            purchaseItems: purchaseItemResult
        };

        // Send response with the combined data
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Getting all purchase orders
exports.allPurchaseOrders=async(req, res)=>{
    try {
        const sql = "SELECT * FROM purchaseorder"
        const [result] =  await dbConnection.execute(sql);
        if(result.length == 0){
            res.status(401).json({Error: "Purchase orders are not available"})
        }
        res.status(200).json(result)
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const { vehicleNo, vehicleMake, vehicleModel, issuedDate, companyName, purchaseTableData } = req.body;
        const { poID } = req.params;

        // Update purchaseOrder table
        const updateOrderSql = "UPDATE purchaseorder SET vehicleNo=?, vehicleMake=?, vehicleModel=?, companyName=?, issuedDate=? WHERE poID=?";
        const updateOrderParams = [vehicleNo, vehicleMake, vehicleModel, companyName, issuedDate, poID];
        const [updateOrderResult] = await dbConnection.execute(updateOrderSql, updateOrderParams);

        if (updateOrderResult.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update purchaseOrder" });
        }

        // Update or Insert purchaseitem table
        const errors = [];
        for (const order of purchaseTableData) {
            const { item_id, itemName, itemPrice, itemQty } = order;

            // Check if the record exists
            const checkExistingSql = "SELECT * FROM purchaseitem WHERE order_id=? AND item_id=?";
            const [existingRows] = await dbConnection.execute(checkExistingSql, [poID, item_id]);

            if (existingRows.length > 0) {
                // Record exists, perform UPDATE
                const updateItemSql = "UPDATE purchaseitem SET itemName=?, itemPrice=?, itemQty=? WHERE order_id=? AND item_id=?";
                const updateItemParams = [itemName, itemPrice, itemQty, poID, item_id];
                await dbConnection.execute(updateItemSql, updateItemParams);
            } else {
                // Record does not exist, perform INSERT
                const insertItemSql = "INSERT INTO purchaseitem (order_id, item_id, itemName, itemPrice, itemQty) VALUES (?, ?, ?, ?, ?)";
                const insertItemParams = [poID, item_id, itemName, itemPrice, itemQty];
                try {
                    await dbConnection.execute(insertItemSql, insertItemParams);
                } catch (error) {
                    errors.push(error.message);
                }
            }
        }

        if (errors.length > 0) {
            return res.status(500).json({ error: "Failed to update purchaseitem table", details: errors });
        }

        return res.status(200).json({ message: "Purchase order updated successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Delete Item
exports.deleteItemFromPurchaseOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { item_id } = req.body;

        // Validate input parameters
        if (!order_id || !item_id) {
            return res.status(400).json({ error: "Both order_id and item_id are required" });
        }

        const sql = "DELETE FROM purchaseItem WHERE order_id = ? AND item_id = ?";
        const [result] = await dbConnection.execute(sql, [order_id, item_id]);

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
