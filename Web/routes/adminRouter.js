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
                IsParent: admin.isParent(request),
                grid: grid
            });
    }
    else {
        AddIp(request);
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
        AddIp(request);
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
        AddIp(request);
        response.redirect("/index");
    }
};

//Видаляє ref id
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
        AddIp(request);
        response.redirect("/index");
    }
};

//Видаляє групу
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
        AddIp(request);
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
        AddIp(request);
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
        AddIp(request);
        response.redirect("/index");
    }
};

//Добавляє дитину
exports.addchild_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "CALL AddChild('" + data.gr + "','" + data.name + "','"+data.ref+"')";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect("/index");
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
}

//Добавляє дитину
exports.editchild_create_get = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.query;
        response.render("editchild.hbs",
            {
                IsAdmin: true,
                IsParent: admin.isParent(request),
                grid: data.gr_id,
                childid: data.child_id,
                namegr: data.namegr
            });
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
}


//Обновляє дитину
exports.updatchild_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "UPDATE child SET gr_id= "+data.gr_id+", full_name = '"+data.full_name+"', ref_id = '"+data.ref_id+"' WHERE id = "+data.id+";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect("/groups");
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Видаляє дитину
exports.dellchild_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "DELETE FROM child WHERE id = " + data.child_id+";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Добавляє відвідання
exports.addvisit_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "INSERT INTO visit (v_dt, ref_id) VALUES ((SELECT dt FROM lesson WHERE less_id = " + data.less + " limit 1), '" + data.ref + "' ); ";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Видаляє відвідання
exports.dellvisit_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "DELETE FROM visit WHERE ref_id = '" + data.ref + "' AND v_dt BETWEEN(SELECT dt - INTERVAL 30 minute from lesson WHERE less_id = " + data.less + ") AND(SELECT dt + INTERVAL 90 minute from lesson WHERE less_id = " + data.less+");";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Створює редактор уроку
exports.editlesson_create_get = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.query;
        response.render("editlesson.hbs",
            {
                IsAdmin: true,
                IsParent: admin.isParent(request),
                lessid: data.lessid,
                date: data.dt,
                grname: data.grname
            });
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Редагує урок
exports.editlesson_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "UPDATE lesson SET dt= '" + data.date + "',  room= '" + data.room + "'  WHERE less_id= " + data.id +";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect("/groups");
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};


//Удаляє урок
exports.deletelesson_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "DELETE FROM lesson WHERE less_id = " + data.lessid+";";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    response.redirect(request.get('referer'));
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Створює батьків
exports.createparent_create_post = function (request, response) {
    if (admin.isAdmin(request)) {
        var data = request.body;
        var sel = "CALL CreateParent('" + data.name + "','" + data.login + "','" + data.password + "','" + data.ids + "');";
        Database.execute(connectionInfo,
            database => database.query(sel)
                .then(rows => {
                    var r = rows[0][0].res;
                    response.json(r);
                })
        );
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Розблоковує ip
exports.unblockip_create_post = function (request, response) {
    var ip = request.body;
    localStorage[ip.ip] = JSON.stringify(0);
    if (ip.index) {
        response.redirect("/index");
    }
};

//Створює сайт з блокировкой
exports.blockip_create_get = function (request, response) {
        response.render("blockIp.hbs",
            {
                IP: request.ip
            });
};

//Додати ip
function AddIp (request) {
    var ip = request.ip;
    if (JSON.parse(localStorage[ip]) != null) {
        var num = JSON.parse(localStorage[ip]);
        localStorage[ip] = JSON.stringify(num + 1);
    } else {
        localStorage[ip] = JSON.stringify(1);
    }
};