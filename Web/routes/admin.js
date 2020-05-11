const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var admin = ["admin", "1"];

//Перевірка чи це адмін
exports.isAdmin = function IsAdmin(request) {
    if (localStorage[request.session.id] && JSON.parse(localStorage[request.session.id]).admin) {
        return true;
    } else {
        return false;
    }
}

//Регистрація
exports.login = function Login(login, password, request) {
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
    }
    return false;
}

//Вихід
exports.logout = function Logout(request) {
    localStorage.removeItem(request.session.id);
    return true;
}