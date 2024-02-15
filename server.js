const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
const authRoute = require('./routes/auth');
const jobRoute = require('./routes/job');
const estimateRoute = require('./routes/estimate');
const supplimentryRoute = require('./routes/supplimentry')
const estimatePreviewRoute = require('./routes/estimatePreview');
const supplimentryPreviewRoute = require('./routes/supplimentryPreview');
const invoiceRoute = require('./routes/invoice');
const vehicleRoute = require('./routes/vehicles');
const productsRoute = require('./routes/products');
const insuranceRoute = require('./routes/insurance');
const personalInvoiceRoute = require('./routes/personalInvoice');


app.use('/api/user', authRoute);
app.use('/api/job', jobRoute);
app.use('/api/estimate', estimateRoute);
app.use('/api/supplimentry', supplimentryRoute);
app.use('/api/estimatePreview', estimatePreviewRoute);
app.use('/api/supplimentryPreview', supplimentryPreviewRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/vehicles', vehicleRoute);
app.use('/api/parts', productsRoute);
app.use('/api/insurance', insuranceRoute);
app.use('/api/personalInvoice', personalInvoiceRoute);

//Server configuration
const port = 8000;
app.listen(process.env.PORT || port, ()=>{
    try {
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log('server configuration error');
    }
});
