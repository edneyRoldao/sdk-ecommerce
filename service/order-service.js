let client; 
let restifyClient = require('restify-clients');

function EcommerceGatewayClient() {
    client = restifyClient.createJsonClient(process.env.ecommerceGateway.host);
}

EcommerceGatewayClient.prototype.confirmOrder = (token, orderId, callback) => {
    const options = {
        path: `/ecommerce/orders/${orderId}/confirm`,
        headers: {
            authorization: token,
            'sdk-secret-key': process.env.ecommerceSdk.secretKey
        }
    }

    client.put(options, {}, callback);
}

EcommerceGatewayClient.prototype.getPendingOrder = (token, orderId, callback) => {
    const options = {
        path: `/ecommerce/orders/${orderId}/pending`,
        headers: {
            authorization: token,
            'sdk-secret-key': process.env.ecommerceSdk.secretKey
        }
    }

    client.get(options, callback);
}

module.exports = () => {
    return EcommerceGatewayClient;
};
