'use strict'

const config = require('./config/config')()
const expressServer = require('./config/express.config');

expressServer().listen(config.port, () => {
    console.log(`the sdk-ecommerce project is working on port: ${config.port}`);    
});
