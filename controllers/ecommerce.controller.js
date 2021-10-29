const crypto = require('crypto');
let logId = 0;
const logs = [];
const key = "";

module.exports = (app) => {

    app.post("/webhook-test", (req, res) => {
        logId++;

        const requestBody = req.body;
        const signature = req.header("abasteceai-signature");

        const hash = crypto
            .createHmac('sha256', key)
            .update(JSON.stringify(requestBody))
            .digest('hex');

        const isEqual = signature == hash;

        logs.push({
            id: logId,
            key: key,
            requestBody: requestBody,
            requestSignature: signature,
            generatedSignature: hash,
            isEqual: isEqual
        })
        
        const httpStatus = isEqual ? 200 : 400;

        res.status(httpStatus).json({});
    });

    app.get("/teste-parceiro-sdk", (req, res) => {
        let msg = { message: 'aplicação do parceiro está funcionando' };
        res.status(200).json(msg);
    });
   
    app.get("/webhook-logs", (req, res) => {        
        res.status(200).json(logs);
    });

    app.get("/webhook-logs/:id", (req, res) => {
        const logId = req.params.id;
        const log = logs.find(l => l.id == logId);
        res.status(200).json(log);
    });

}
