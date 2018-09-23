const express = require('express');
const app = express();
const morgan = require('morgan');

// Routes Files
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// Morgan is a logger middleware
app.use(morgan('dev'));

// Route
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Error Handling

// Not Found Error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;