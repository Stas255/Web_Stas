const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path');

//проверка
const main = require('./routes/main.js');
const adminRouter = require('./routes/adminRouter.js');
const parent = require('./routes/parent.js');

const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

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
            admin: false,
            parent: false,
            id_parent:0
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
app.use("/groups", main.infor_create_get);

// GET index
app.get("/index", main.index_create_get);

//GET lesson
app.get("/lesson", main.lesson_create_get);

//GET lesson
app.get("/pupils", main.pupils_create_get);

//GET visit
app.get("/visit", main.visit_create_get)

/// ADMIN ROUTES ///

//POST addchild
app.post("/addchild", adminRouter.addchild_create_post);

//POST addlesson
app.post("/addlesson", adminRouter.addlesson_create_post);

//POST addgroup
app.post("/addgroup", adminRouter.addgroup_create_post);

//DELETE group
app.post("/dellgroup", adminRouter.dellgroup_create_post);

//DELETE dellRefId
app.delete("/delleteRefId", adminRouter.delleteRefId_create_delete);

//POST updategroup
app.post("/updategroup", adminRouter.updategroup_create_post);

//POST editgr
app.post("/editgr", adminRouter.editgroup_create_post);

//GET editgr
app.get("/editgr", adminRouter.editgroup_create_get);

//GET editchild
app.get("/editchild", adminRouter.editchild_create_get);

//POST updatchild
app.post("/updatchild", adminRouter.updatchild_create_post);

//DELETE child
app.post("/dellchild", adminRouter.dellchild_create_post);

//POST addvisit
app.post("/addvisit", adminRouter.addvisit_create_post);

//POST dellvisit
app.post("/dellvisit", adminRouter.dellvisit_create_post);

//GET updatlesson
app.get("/editlesson", adminRouter.editlesson_create_get);

//POST updatlesson
app.post("/editlesson", adminRouter.editlesson_create_post);

//POST deletelesson
app.post("/deletelesson", adminRouter.deletelesson_create_post);

//POST getPerent
app.post("/createparent", adminRouter.createparent_create_post);

/// PERENT ROUTES ///

//POST getPerent
app.post("/getPerent", parent.DbPerent_create_post);

//GET parent
app.get("/parent", parent.parent_create_get);

//POST getPerent
app.post("/SerchVisit", parent.SerchVisit_create_post);


app.get("/", function (request, response) {
    response.redirect("/index")
});
app.listen(1337);

