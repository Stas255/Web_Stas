const admin = require('./admin.js');

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
exports.lesson = function (request, response) {
    var grid = request.query.grid;
    response.render("lesson.hbs",
        {
            IsAdmin: admin.isAdmin(request),
            grid: grid
        });
};