const logs = []
let count = 0;

module.exports = (app) => {

    app.get("/teste-parceiro-sdk", (req, res) => {
        let msg = { message: 'aplicação do parceiro está funcionando' };
        res.status(200).json(msg);
    });
   

    app.get("/logs", (req, res) => {
        count++;
        logs.push({message: 'a request come', count: count})
        res.status(200).json(logs);
    });

}
