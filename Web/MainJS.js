function Login(login, password) {
    if (admin[0] == login && admin[1] == password) {
        if (localStorage.getItem("admin") == null) {
            localStorage.setItem("admin", "123456");
        }
        return localStorage.getItem("admin");
    } else {
        return "false";
    }
}