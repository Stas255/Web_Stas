const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

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



//Перевірка чи це адмін
exports.isAdmin = function IsAdmin(request) {
    if (localStorage[request.session.id] && JSON.parse(localStorage[request.session.id]).admin) {
        return true;
    } else {
        return false;
    }
}

//Перевірка чи це родитель
exports.isParent = function IsParent(request) {
    if (localStorage[request.session.id] && JSON.parse(localStorage[request.session.id]).parent) {
        return true;
    } else {
        return false;
    }
}

//Регистрація
exports.login = function Login(response, request) {
    var data = request.body;
    var sel = "SELECT id, admin, parent FROM personal WHERE login = '" + data.login + "' AND password = '" +data.password+"'";
    Database.execute(connectionInfo,
        database => database.query(sel)
            .then(rows => {
                if (rows.length !== 0) {
                    CheckAndRegistAdmin(rows[0].admin, request);
                    CheckAndRegistP(rows[0], request);
                }
                response.redirect(request.get('referer'));
            })
    );
}

//Проверка і регистрація адміна
function CheckAndRegistAdmin(result, request) {
    if (result == 1) {
        if (localStorage[request.session.id] == null) {
            var ses = {
                admin: true,
                parent: false,
                id_parent:0
            }
            localStorage[request.session.id] = JSON.stringify(ses);
        }
        else {
            var ses = JSON.parse(localStorage[request.session.id]);
            ses.admin = true;
            localStorage[request.session.id] = JSON.stringify(ses);
        }
    }
};

//Проверка і регистрація родителя
function CheckAndRegistP(result, request) {
    if (result.parent == 1) {
        if (localStorage[request.session.id] == null) {
            var ses = {
                admin: false,
                parent: true,
                id_parent: result.id
            }
            localStorage[request.session.id] = JSON.stringify(ses);
        }
        else {
            var ses = JSON.parse(localStorage[request.session.id]);
            ses.parent = true;
            ses.id_parent = result.id;
            localStorage[request.session.id] = JSON.stringify(ses);
        }
    }
};


//Вихід
exports.logout = function Logout(request) {
    localStorage.removeItem(request.session.id);
    return true;
}