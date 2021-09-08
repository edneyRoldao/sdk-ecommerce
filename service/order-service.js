let client; 
const config = require('../config/config')();
let restifyClient = require('restify-clients');

function EcommerceGatewayClient() {
    client = restifyClient.createJsonClient(config.ecommerceGateway.host);
}

EcommerceGatewayClient.prototype.confirmOrder = (token, orderId, callback) => {
    const options = {
        path: `/ecommerce/orders/${orderId}/confirm`,
        headers: {
            authorization: token,
            'sdk-secret-key': config.ecommerceSdk.secretKey
        }
    }

    client.put(options, {}, callback);
}

EcommerceGatewayClient.prototype.getPendingOrder = (token, orderId, callback) => {
    const options = {
        path: `/ecommerce/orders/${orderId}/pending`,
        headers: {
            authorization: token,
            'sdk-secret-key': config.ecommerceSdk.secretKey
        }
    }

    client.get(options, callback);
}

module.exports = () => {
    return EcommerceGatewayClient;
};
