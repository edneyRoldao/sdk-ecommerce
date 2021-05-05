module.exports = (app) => {

    app.get("/teste", (req, res) => {
        res.json('teste controller');
    });

}
