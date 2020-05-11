const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

//проверка
const admin= require('./routes/admin.js');
const test = require('./routes/test.js');
const adminController = require('./routes/adminController.js');

// создаем парсер для данных в формате json
const jsonParser = express.json();
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const Database = require('./db');

const connectionInfo = {
    host: "91.239.235.7",
    user: "ersesrqr_test",
    database: "ersesrqr_school",
    password: "&;5UPSz(zSL1"
};

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





app.get(function (request, response, next) {
    if (!request.session.params) {
        var ses = {
            admin: false
        }       
        localStorage[request.session.id] = JSON.stringify(ses);
    }
    var i = JSON.parse(localStorage[request.sessionID]).admin;
    request.session.params = JSON.parse(localStorage[request.sessionID]);
    next();
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})



app.post("/dbSerchIndex", jsonParser, function (request, response) {
    let data = request.body;
    var sel;
    if (data.room != "" || data.group != "") {
        sel = "SELECT l.room,DATE_FORMAT(l.dt , ' %d-%c-%Y %T') as dt, g.name, g.description from lesson l LEFT JOIN gr g ON l.gr_id = g.gr_id WHERE" +
            ((data.room != "") ? (" l.room = '" + data.room + "'" + " and ") : ("")) + ((data.group != "") ? (" l.gr_id = " + data.group + " and ") : ("")) + "l.dt BETWEEN ' " + data.dateNow + " ' AND ' " + data.dateEnd + " '; ";
    } else {
        console.log("not edit");
        response.json("Введіть будь-ласка наступні поля: Група або Аудиторія.");
    }
    var result;
    var table = "";
    Database.execute(connectionInfo,
        database => database.query(sel)
            .then(rows => {
                if (rows.length === 0) {
                    response.json("Невдалось знайти за вказаними параметрами");
                }
                result = rows;
                response.json(result);
            })
    );    
});

app.post("/dbSerch",
    jsonParser,
    function (request, response) {
        var data = request.body;
        if (data.hasOwnProperty("dictinct")) {
            sel = "SELECT DISTINCT " + data.dictinct + " from " + data.find +" "+ (data.hasOwnProperty("where")? (data.where):"" )+ ";";

        } else {
            sel = "SELECT DISTINCT * from " + data.find +" "+ (data.hasOwnProperty("where") ? (data.where) : "") + ";";
        }
        var result = [];
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    if (!data.hasOwnProperty("element1")) {
                        result = rows;
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                            result.push({ id: rows[i][data.element1], result: rows[i][data.element2] });
                        }
                    }
                    response.json(result);
                })
        ); 
    });

app.post("/login",
    jsonParser,
    function (request, response) {
        var data = request.body;
        var res = admin.login(data.login, data.password, request);
        response.redirect(request.get('referer'));
    });

app.post("/logout",
    jsonParser,
    function (request, response, next) {
        var res = admin.logout(request);
        response.redirect(request.get('referer'));
    });

app.post("/AddChild",
    jsonParser,
    function (request, response) {
        var data = request.body;
        var sel = "INSERT INTO child( gr_id, full_name, ref_id) VALUES ( '" + data.group + "', '" + data.name + "', '" + data.id + "')";
        var sel1 = "DELETE FROM temp WHERE t = '" +data.id+"';";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    return database.query(sel1);
                }).then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    });
app.post("/addlesson",
    jsonParser,
    function (request, response) {
        var sess = request.session;
        ses.admin = "admin";
        var data = request.body;
        var sel = "INSERT INTO lesson( gr_id, dt, room) VALUES ( '" + data.gr_id + "', '" + data.date + "', '" + data.room + "')";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    });


app.post("/addgr",
    jsonParser,
    function (request, response) {
        var data = request.body;
        var sel = "CALL AddGr('"+data.name+"','"+data.des+"','"+data.date+"','"+data.room+"',"+data.numb+")";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(result => {
                    response.redirect(request.get('referer'));
                })
        );
    });

//DELETE group
app.post("/dellgroup", adminController.dellgroup_create_post);

// DELETE dellRefId
app.delete("/delleteRefId", /*jsonParser,*/ adminController.delleteRefId_create_delete);

//GET lesson
app.get("/lesson", test.lesson);

// POST updategroup
app.post("/updategroup", adminController.updategroup_create_post);

// POST editgr
app.post("/editgr", adminController.editgroup_create_post);

// GET editgr
app.get("/editgr", adminController.editgroup_create_get);

// Get groups
app.get("/groups", test.infor_create_get);

// GET index
app.get("/index", test.index_create_get);
//app.post("/index", test.index_create_get);


app.get("/", function (request, response) {
    response.redirect("/index")
});
app.listen(1337);

function IsAdmin(request) {
    if (localStorage[request.session.id] && JSON.parse(localStorage[request.session.id]).admin) {
        return true;
    } else {
        return false;
    }
}

function Login(login, password, request) {
    if (admin[0] == login && admin[1] == password) {
        if (localStorage[request.session.id] == null) {
            var ses = {
                admin: true
            }
            localStorage[request.session.id] = JSON.stringify(ses);
        }
        else {
            var ses = JSON.parse(localStorage[request.session.id]);
            ses.admin = true;
            localStorage[request.session.id] = JSON.stringify(ses);
        }
        return true;
    } else {
        return false;
    }
}

function Logout(request) {
    localStorage.removeItem(request.session.id);
}

Database.execute = function (config, callback) {
    const database = new Database(config);
    return callback(database).then(
        result => database.close().then(() => result),
        err => database.close().then(() => { throw err; })
    );
};

function CreateTable(result/*,param*/) {
    var param = [{ Час: "dt", Група: "name", Опис: "description", Кімната: "room" }];
    let table = document.querySelector("table");
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of param[0]) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
    for (let element of param[0]) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
    return table;
}

function CreateInsertLessonArray(data,id) {
    var sel = "";
}