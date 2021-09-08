module.exports = {
    env: 'development',
    port: process.env.PORT || 3000,
    ecommerceSdk: {
        host: 'http://localhost:3000',
        secretKey: '2CBFC726557285319794A5B6E49EC'
    },
    ecommerceGateway: {
        host: 'http://localhost:9010',
        secretKey: ''        
    }
}
