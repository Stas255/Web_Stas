var isAdmin;

exports.admin = function(admin) {
        isAdmin = admin;
};

//������� ������� ����
exports.index_create_get = function (request, response) {
    response.render("main.hbs",
        {
            IsAdmin: isAdmin
        });
};

//������� ������ ����
exports.infor_create_get = function (request, response) {
    var id = request.query.id;
    response.render("infor_Table.hbs",
        {
            IsAdmin: isAdmin
        });
};
