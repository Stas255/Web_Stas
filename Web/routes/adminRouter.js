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


//Створює редактор групи
exports.editgroup_create_get = function (request, response) {
    var grid = request.query.grid;
    if (admin.isAdmin(request)) {
        response.render("editgr.hbs",
            {
                IsAdmin: true,
                grid: grid
            });
    }
    else {
        response.redirect("/index");
    }
};

//Створює редактор групи
exports.editgroup_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var grid = request.body;
        var sel = "SELECT * from gr WHERE gr_id = " + grid.grid + ";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.json(rows);
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Обновляє групу
exports.updategroup_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var grid = request.body;
        var sel = "UPDATE gr SET name= '" + grid.name + "', description = '" + grid.des + "' WHERE gr_id = " + grid.id + ";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect("/groups");
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Удаляє ref id
exports.delleteRefId_create_delete = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var ids = "'" + data.id[0] + "'";
        for (var i = 1; i < data.id.length; i++) {
            ids += ",'" + data.id[i] + "'";
        }
        var sel = "DELETE FROM temp WHERE t IN (" + ids + ");";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Удаляє групу
exports.dellgroup_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "CALL DellGr(" + data.grid + ")";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect("/groups");
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Добавляє групу
exports.addgroup_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "CALL AddGr('" + data.name + "','" + data.des + "','" + data.date + "','" + data.room + "'," + data.numb + ")";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(result => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Добавляє урок
exports.addlesson_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "INSERT INTO lesson( gr_id, dt, room) VALUES ( '" + data.gr_id + "', '" + data.date + "', '" + data.room + "')";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        response.redirect("/index");
    }
};

//Добавляє дитину
exports.addchild_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "INSERT INTO child( gr_id, full_name, ref_id) VALUES ( '" + data.group + "', '" + data.name + "', '" + data.id + "')";
        var sel1 = "DELETE FROM temp WHERE t = '" + data.id + "';";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    return database.query(sel1);
                }).then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        response.redirect("/index");
    }
}