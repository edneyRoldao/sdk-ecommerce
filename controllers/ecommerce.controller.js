const crypto = require('crypto');
let logId = 0;
const logs = [];
let key = "STO-1345c94c-0a29-49b4-9ff3-dc5544ef42ba";

module.exports = (app) => {
    app.get("/webhook/change-store/:storeId", (req, res) => {
        const storeId = req.params.storeId;
        key = storeId;

        res.status(200).json({message: 'webhook teve o storeId alterado.'});
    })

    app.post("/webhook-test", (req, res) => {
        logId++;

        const requestBody = req.body;
        const signature = req.header("abasteceai-signature");

        let hash = crypto
            .createHmac('sha256', key)
            .update(JSON.stringify(requestBody))
            .digest('hex');

        // if (hash.length > signature.length) {
        //     hash = hash.substring(1);
        // }

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
        if (!logs.length) {
            return res
            .status(200)
            .json({message: "nao existe logs para apresentar."});
        }
        
        res.status(200).json(logs);
    });

    app.get("/webhook-logs/:id", (req, res) => {
        const logId = req.params.id;
        const log = logs.find(l => l.id == logId);

        if (!log) {
            return res
            .status(200)
            .json({message: `nao existe log para o id: ${logId}`});
        }

        res.status(200).json(log);
    });
}
