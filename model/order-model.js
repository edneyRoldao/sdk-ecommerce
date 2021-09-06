const Order = function(response) {
    this.amount = response.amount;
    this.orderId = response.orderId;
    this.storeSite = response.storeSite;
    this.storeFantasyName = response.storeFantasyName;
    this.creationDateTime = response.creationDateTime;
}

module.exports = Order;
