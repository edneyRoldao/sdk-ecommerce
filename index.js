'use strict'
const expressServer = require('./config/express.config');

const serverPort = process.env.PORT || 9010;

expressServer().listen(serverPort, () => {
    console.log('ecommerce-sdk has been started');    
});
