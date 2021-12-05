const secretKeysAPIInterceptor = require('../interceptors/secret-keys-api-access');

module.exports = (app) => {

    app.get("/secret-keys/edy/ssh/public", (req, res) => {
        const privateSSH = process.env.EDY_SSH_PUBLIC || 'nao encontrado';
        res.status(200).send(privateSSH);
    })

}
