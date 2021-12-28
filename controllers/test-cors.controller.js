module.exports = (app) => {

    app.get("/test-cors", (req, res) => {
        res.status(200).json({message: 'cors test'});
    })

}
