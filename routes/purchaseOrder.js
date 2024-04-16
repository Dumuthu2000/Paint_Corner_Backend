const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controller/purchaseOrderController');

//Create purchase order
router.post('/createPurchaseOrder', purchaseOrderController.createPurchaseOrder);

//Fetch purchase order
router.get('/getPurchaseOrder', purchaseOrderController.getPurchaseOrder);

//Fetch purchase order by ID
router.get('/getPurchaseOrder/:poID', purchaseOrderController.getPurchaseOrderById);

//Fetch all purchase orders
router.get('/purchaseOrders', purchaseOrderController.allPurchaseOrders);

//Update purchase order
router.put('/updatePurchaseOrder/:poID', purchaseOrderController.updatePurchaseOrder);

//Update purchase order
router.delete('/deletePurchaseOrder/:order_id', purchaseOrderController.deleteItemFromPurchaseOrder);

module.exports = router;