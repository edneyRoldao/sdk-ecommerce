module.exports = function() {
    return require(`./environments/${process.env.SDK_ECOMMERCE_ENV}-application.js`);
};
