function route(app) {
    //app.all("*", auth);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
}

module.exports = route;
