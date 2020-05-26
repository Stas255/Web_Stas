const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
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

//Дає інформацію про батьків
exports.DbPerent_create_post = function (request, response) {
    if (admin.isParent(request)) {
        var get_id = JSON.parse(localStorage[request.session.id]).id_parent;
        var sel = "SELECT * FROM personal WHERE id = " + get_id+";";
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

//Інформація 
exports.parent_create_get = function (request, response) {
    if (admin.isParent(request) | admin.isAdmin(request)) {
        var data = request.query;
        response.render("parent.hbs",
            {
                IsAdmin: admin.isAdmin(request),
                IsParent: admin.isParent(request),
                parent_name: data.name_parent,
                parentId: data.id_parent
            });
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};


//Знаходить які лекції відвідала дитина
exports.SerchVisit_create_post = function (request, response) {
    if (admin.isParent(request) || admin.isAdmin(request)) {
        var data = request.body.refid;
        var sel = "SELECT l2.less_id, g.name,l2.dt, IF(l2.less_id IN (SELECT l.less_id FROM lesson l LEFT JOIN visit v ON v.v_dt BETWEEN (SELECT dt FROM lesson WHERE less_id = l.less_id limit 1) - INTERVAL 30 minute and (SELECT dt FROM lesson WHERE less_id = l.less_id limit 1) + INTERVAL 90 minute WHERE v.visit_id IS NOT NULL AND v.ref_id = '" + data +"' AND l.gr_id IN (SELECT gr_id FROM child WHERE ref_id = '" + data + "')),1,0) as b FROM lesson l2 LEFT JOIN gr g ON g.gr_id = l2.gr_id WHERE g.gr_id IN (SELECT gr_id FROM child WHERE ref_id = '" + data +"') AND l2.dt <= CURDATE() ORDER BY l2.dt";
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

//Редагує родитиля
exports.editParent_create_post = function (request, response) {
    if (admin.isParent(request) || admin.isAdmin(request)) {
        var data = request.body;
        if (data.childs_ids != null) {
            var sel = "CALL EditParent(" + data.id + ",'" + data.name + "','" + data.login + "','" + data.password + "','" + data.childs_ids + "')";
        }
        else {
            var sel = "CALL EditParent(" + data.id + ",'" + data.name + "','" + data.login + "','" + data.password + "','"+"')";
        }
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

//Редактор родителя 
exports.parent_edit_get = function (request, response) {
    if (admin.isAdmin(request) || admin.isParent(request)) {
        var data = request.query;
        response.render("editparent.hbs",
            {
                IsAdmin: admin.isAdmin(request),
                IsParent: admin.isParent(request),
                idParent: data.id
            });
    }
    else {
        AddIp(request);
        response.redirect("/index");
    }
};

//Додати ip
function AddIp(request) {
    var ip = request.ip;
    if (JSON.parse(localStorage[ip]) != null) {
        var num = JSON.parse(localStorage[ip]);
        localStorage[ip] = JSON.stringify(num + 1);
    } else {
        localStorage[ip] = JSON.stringify(1);
    }
};