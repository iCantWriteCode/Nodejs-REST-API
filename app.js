const express = require('express');
const app = express();

// .use is called midleware
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It Works!'
    });
});

module.exports = app;