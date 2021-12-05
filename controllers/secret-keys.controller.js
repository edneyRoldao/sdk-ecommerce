module.exports = (app) => {

    app.get("/secret-keys/test", (req, res) => {
        const test = process.env.EDY_TEST || 'nao encontrado';
        res.status(200).json({message: test});
    })

}
