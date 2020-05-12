const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path');

//проверка
const main = require('./routes/main.js');
const adminController = require('./routes/adminRouter.js');


const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const Database = require('./db');

const expressHbs = require("express-handlebars");
const hbs = require("hbs");
app.use(express.static(path.join(__dirname, '/public')));
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs(
    {
        layoutsDir: __dirname + "/views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
));



app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true
}));

app.use(function (request, response, next) {
    if (!request.session.params) {
        var ses = {
            admin: false
        }       
        localStorage[request.session.id] = JSON.stringify(ses);
    }
    request.session.params = JSON.parse(localStorage[request.sessionID]);
    next();
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

/// MAIN ROUTES ///

//POST dbSerchIndex
app.post("/dbSerchIndex", main.dbSerchIndex_create_post);

//POST dbSerch
app.post("/dbSerch", main.dbSerch_create_post);

//POST login
app.post("/login", main.login_create_post);

//POST logout
app.post("/logout", main.logout_create_post);

// Get groups
app.get("/groups", main.infor_create_get);

// GET index
app.get("/index", main.index_create_get);

//GET lesson
app.get("/lesson", main.lesson_create_get);

/// ADMIN ROUTES ///

//POST addchild
app.post("/addchild", adminController.addchild_create_post);

//POST addlesson
app.post("/addlesson", adminController.addlesson_create_post);

//POST addgroup
app.post("/addgroup", adminController.addgroup_create_post);

//DELETE group
app.post("/dellgroup", adminController.dellgroup_create_post);

// DELETE dellRefId
app.delete("/delleteRefId", adminController.delleteRefId_create_delete);

// POST updategroup
app.post("/updategroup", adminController.updategroup_create_post);

// POST editgr
app.post("/editgr", adminController.editgroup_create_post);

// GET editgr
app.get("/editgr", adminController.editgroup_create_get);




app.get("/", function (request, response) {
    response.redirect("/index")
});
app.listen(1337);


Database.execute = function (config, callback) {
    const database = new Database(config);
    return callback(database).then(
        result => database.close().then(() => result),
        err => database.close().then(() => { throw err; })
    );
};
