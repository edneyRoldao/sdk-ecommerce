'use strict'

const PORT = process.env.PORT || 3000;
const expressServer = require('./config/express.config');

expressServer().listen(PORT, () => {
    console.log(`the sdk-ecommerce project is working on port: ${PORT}`);    
});
