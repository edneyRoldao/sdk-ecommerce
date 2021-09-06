const Order = require('../model/order-model');

module.exports = (app) => {

    // get pre order detail
    app.get("/order-info", (req, res) => {
        const token = req.header("partnerToken");
        const orderID = req.header("partnerOrderId");
        
        if (!token || !orderID) {
            return res.status(404).json("order id or token invalid");
        }

        // todo - chamar o api-gateway
        

        const order = {
            codigoPedido: 1234,
            idParceiro: 4545455,
            descricaoSite: 'www.souice.com.br',
            dataPedido: '10/05/2021',
            valorPedido: '125,00'
        }
        
        res.status(200).json(order);
    });

    // create order
    app.post("/confirm-order", (req, res) => {

        // todo chamar o api gateway

        res.status(200).json('sucesso');
    });

    
}
