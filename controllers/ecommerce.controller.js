module.exports = (app) => {

    app.get("/teste-parceiro-sdk", (req, res) => {
        let msg = { message: 'aplicação do parceiro está funcionando' };
        res.status(200).json(msg);
    });
   
}
