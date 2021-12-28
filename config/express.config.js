const express = require('express');
const ecommerceController = require('../controllers/ecommerce.controller');
const secretKeysController = require('../controllers/secret-keys.controller');
const testCorsController = require('../controllers/test-cors.controller');

module.exports = () => {
    const app = express();

    // cors
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", '*');
        res.header("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    })

    app.use(express.json());
    app.use(express.static('./static'));
    
    // controllers
    ecommerceController(app);
    secretKeysController(app);
    testCorsController(app);

    return app;
};
