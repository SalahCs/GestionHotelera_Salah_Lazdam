/* Librerías */
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const nunjucksFilter = require("nunjucks-date-filter");
const methodOverride = require("method-override");
const session = require("express-session");

dotenv.config();

const habitaciones = require(__dirname + "/routes/habitaciones");
const limpiezas = require(__dirname + "/routes/limpiezas");
const auth = require(__dirname + "/routes/auth");


mongoose.connect(process.env.URLBD);

let app = express();

let env = nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

env.addFilter("date", nunjucksFilter);

app.set("view engine", "njk");

app.use('/public', express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + 3600000),
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
}));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);
app.use("/auth", auth);

app.listen(process.env.PUERTO);