const admin = require('./admin.js');
const Database = require('../db');

const connectionInfo = {
    host: "91.239.235.7",
    user: "ersesrqr_test",
    database: "ersesrqr_school",
    password: "&;5UPSz(zSL1"
};

Database.execute = function (config, callback) {
    const database = new Database(config);
    return callback(database).then(
        result => database.close().then(() => result),
        err => database.close().then(() => { throw err; })
    );
};

//Створює головне меню
exports.index_create_get = function (request, response) {

    response.render("main.hbs",
        {
            IsAdmin: admin.isAdmin(request)
        });
};

//Створює список груп
exports.infor_create_get = function (request, response) {
    var id = request.query.id;
    response.render("infor_Table.hbs",
        {
            IsAdmin: admin.isAdmin(request)
        });
};

//Створює список уроків по id
exports.lesson_create_get = function (request, response) {
    var grid = request.query.grid;
    response.render("lesson.hbs",
        {
            IsAdmin: admin.isAdmin(request),
            grid: grid
        });
};

//Виходить
exports.logout_create_post = function (request, response, next) {
    var res = admin.logout(request);
    response.redirect(request.get('referer'));
};

//Регистрірує
exports.login_create_post = function (request, response) {
    var data = request.body;
    var res = admin.login(data.login, data.password, request);
    response.redirect(request.get('referer'));
};

//Шукає в базі даних
exports.dbSerch_create_post = function (request, response) {
    var data = request.body;
    var sel;
    sel = "SELECT DISTINCT " + (data.hasOwnProperty("dictinct") ? data.dictinct : "*") + " from " + data.find + " " + (data.hasOwnProperty("where") ? (data.where) : "") + (data.hasOwnProperty("order_by") ? (data.order_by) : "") + ";";
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
};

//Шукає в базі даних для index
exports.dbSerchIndex_create_post = function (request, response) {
    let data = request.body;
    var sel;
    if (data.room != "" || data.group != "") {
        sel = "SELECT l.room,DATE_FORMAT(l.dt , ' %d-%c-%Y %T') as dt, g.name, g.description from lesson l LEFT JOIN gr g ON l.gr_id = g.gr_id WHERE" +
            ((data.room != "") ? (" l.room = '" + data.room + "'" + " and ") : ("")) + ((data.group != "") ? (" l.gr_id = " + data.group + " and ") : ("")) + "l.dt BETWEEN ' " + data.dateNow + " ' AND ' " + data.dateEnd + "'" + (data.hasOwnProperty("order_by") ? (data.order_by) : "") + " ; ";
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
};