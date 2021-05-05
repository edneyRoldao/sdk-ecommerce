'use strict'
const expressServer = require('./config/express.config');

const serverPort = process.env.port || 9010;

expressServer().listen(serverPort, () => {
    console.log('ecommerce-sdk has been started');    
});
