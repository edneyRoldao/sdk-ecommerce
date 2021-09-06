const OrderService = require('../service/order-service')();

module.exports = (app) => {

    app.get("/:orderId/order-info", (req, res) => {
        const token = req.header("token");
        const orderId = req.params.orderId;
        const orderService = new OrderService();

        orderService.getPendingOrder(token, orderId, (error, request, response, result) => {
            if (error) {
                console.log(error);
                console.log('RESPONSE:', response);
                console.log('REQUEST:', request);
                
                return res.status(400).json({message: 'Ocorreu um erro ao obter os dados do pedido.'})
            }            

            res.status(200).json(result);
        })
    });

    app.put("/:orderId/confirm-order", (req, res) => {        
        const token = req.header("token");
        const orderId = req.params.orderId;
        const orderService = new OrderService();
        
        orderService.confirmOrder(token, orderId, (error, request, response, result) => {
            if (error) {
                console.log(error);
                console.log('RESPONSE:', response);
                console.log('REQUEST:', request);
                
                return res.status(400).json({message: 'Ocorreu um erro ao confirmar o pedido.'})
            }            

            res.status(200).json(result);
        })
    });
   
}
