'use strict'
const expressServer = require('./config/express.config');

const serverPort = process.env.PORT || 9010;

expressServer().listen(serverPort, () => {
    console.log(`the sdk-ecommerce project is working on port: ${serverPort}`);    
});
