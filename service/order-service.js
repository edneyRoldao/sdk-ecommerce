let client; 
let restifyClient = require('restify-clients');

function EcommerceGatewayClient() {
    client = restifyClient.createJsonClient({
        url: process.env.ecommerceGateway.host,
        headers: {
            'sdk-secret-key': process.env.ecommerceSdk.secretKey
        }
    })
}

