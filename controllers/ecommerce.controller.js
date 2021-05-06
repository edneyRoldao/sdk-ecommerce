module.exports = (app) => {

    app.get("/teste", (req, res) => {
        res.json('teste controller');
    });

    app.get("/api/order/:orderID", (req, res) => {
        const orderID = req.params.orderID;
        const token = req.header("Authorization");
        console.log(orderID, token);
        
        const order = {
            codigoPedido: 1234,
            idParceiro: 4545455,
            descricaoSite: 'www.souice.com.br',
            dataPedido: '10/05/2021',
            valorPedido: 125.00
        }
        
        res.status(200).json(order);
    });
    
}
