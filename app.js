const express = require('express');
const app = express();

// Import Of Routes
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');


// .use is called midleware
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;