function AddSelectGroup(idSelect) {
    let data = JSON.stringify({
        find: "gr",
        element1: "gr_id",
        element2: "name"
    });
    let request = new XMLHttpRequest();
    request.open("POST", "/dbSerch", true);
    request.setRequestHeader("Content-Type", "application/json");
    var result;
    setTimeout(request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        result = receivedUser;
        var x = document.getElementById(idSelect);
        var option = document.createElement("option");
        result.forEach(element => {
            option = document.createElement("option");
            option.text = element.result;
            option.value = element.id;
            x.add(option);
            //CheckGroupAndRoom("gr_id");
        });
    }), 5000);
    request.send(data);

}

function AddSelectRoom() {
    let data = JSON.stringify({
        find: "lesson",
        element1: "room",
        element2: "room",
        dictinct: "room"
    });
    let request = new XMLHttpRequest();
    request.open("POST", "/dbSerch", true);
    request.setRequestHeader("Content-Type", "application/json");
    var result;
    setTimeout(request.addEventListener("load",
            function() {
                // получаем и парсим ответ сервера
                let receivedUser = JSON.parse(request.response);
                result = receivedUser;
                var x = document.getElementById("room");
                var option = document.createElement("option");
                result.forEach(element => {
                    option = document.createElement("option");
                    option.text = element.result;
                    option.value = element.id;
                    x.add(option);
                    //CheckGroupAndRoom("room");
                });
            }),
        5000);
    request.send(data);
}

function AddSelectRef_ID(idSelect) {
    let data = JSON.stringify({
        find: "temp",
        element1: "t",
        element2: "t",
        distinct:"distinct"
    });
    let request = new XMLHttpRequest();
    request.open("POST", "/dbSerch", true);
    request.setRequestHeader("Content-Type", "application/json");
    var result;
    setTimeout(request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        result = receivedUser;
        var x = document.getElementById(idSelect);
        var option = document.createElement("option");
        result.forEach(element => {
            option = document.createElement("option");
            option.text = element.result;
            option.value = element.id;
            x.add(option);
        });
    }), 5000);
    request.send(data);
}

function AddSelectChilds(idSelect) {
    let data = JSON.stringify({
        find: "child"
    });
    let request = new XMLHttpRequest();
    request.open("POST", "/dbSerch", true);
    request.setRequestHeader("Content-Type", "application/json");
    var result;
    setTimeout(request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        result = receivedUser;
        var x = document.getElementById(idSelect);
        result.forEach(element => {
            option = document.createElement("option");
            option.text = element.full_name;
            option.value = element.child_id;
            x.add(option);
        });
    }), 5000);
    request.send(data);
}


function CheckCreateSession(sessionId, sessionAdd) {
    if (sessionStorage.getItem(sessionId) == null) {
        sessionStorage.setItem(sessionId, sessionAdd);
        return sessionAdd;
    } else {
        return sessionStorage.getItem(sessionId);
    }
}

function ReplaceSession(sessionId, sessionReplace) {
    if (sessionStorage.getItem(sessionId) == null) {
        console.log("Error replace session");
    } else {
        sessionStorage.setItem(sessionId, sessionReplace);
    }
}

function CheckTime() {
    var check1 = new Date(document.getElementById("dateTimeNow").value);
    var check2 = new Date(document.getElementById("dateTimeEnd").value);
    if (check1 > check2) {
        document.getElementById("dateTimeEnd").value = document.getElementById("dateTimeNow").value;
    }
    document.getElementById("dateTimeEnd").setAttribute("min", document.getElementById("dateTimeNow").value);
}

function RemoveFromSelect(idSelect, option) {
    var x = document.getElementById(idSelect);
    x.remove(option);
    var option = document.createElement("option");
    option.text = "";
    option.value = "";
    x.insertBefore(option, x.firstChild);
}

function Go(href) {
    document.location.href = href;
}

function Exit() {
    localStorage.removeItem("admin");
    Go("/");
}

function AddTHTextInTr(tr,text) {
    var th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = text;
    tr.appendChild(th);
}

function AddTDTextInTr(tr, text) {
    var td = document.createElement("td");
    td.innerHTML = text;
    tr.appendChild(td);
}

function CreateButton_inforInForm(tr, classButton, valueInput, event, iClass,name,metod) {
    var td = document.createElement("td");
    var form = document.createElement("form");
    form.action = event;
    form.method = metod;
    if (Array.isArray(name)) {
        for (var i = 0; i < name.length; i++) {
            var input = document.createElement("input");
            input.value = valueInput[i];
            input.name = name[i];
            input.type = "hidden";
            form.appendChild(input);
        }
    } else {
        var input = document.createElement("input");
        input.value = valueInput;
        input.name = name;
        input.type = "hidden";
        form.appendChild(input);
    }
    var btn = document.createElement("button");
    var cl = "btn-default " + classButton.toString();
    btn.className += cl;
    btn.type = "submit"
    btn.innerHTML = "<i class = 'fa fa-" + iClass + "' ></i>";
    form.appendChild(btn);
    td.appendChild(form);
    tr.appendChild(td);
}

function AddArrayInTbody_index(tbody, array) {
    var tr = document.createElement("tr");
    AddTDTextInTr(tr, array.dt);
    AddTDTextInTr(tr, array.name);
    AddTDTextInTr(tr, array.description);
    AddTDTextInTr(tr, array.room);
    tbody.appendChild(tr);
}

function CreateTable_index(idDivTable,results){
    var table = document.createElement("table");
    table.classList.add("table");

    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    AddTHTextInTr(tr, "Час");
    AddTHTextInTr(tr, "Група");
    AddTHTextInTr(tr, "Опис");
    AddTHTextInTr(tr, "Кімната");
    thead.appendChild(tr);
    table.appendChild(thead);


    var tbody = document.createElement("tbody");
    results.forEach(function (item) { AddArrayInTbody_index(tbody, item)});
    table.appendChild(tbody);
    document.getElementById(idDivTable).append(table);
}

function GetSelectValues(selectId) {
    var val = document.getElementById(selectId);
    var res = [];
    var opt = val && val.options;
    for (var i = 0; i < opt.length; i++) {
        option = opt[i];
        if (option.selected) {
            if (option.value != '')
                res.push(option.value || option.text);
        }
    }
    return res;
}

function ReturnFormButton_Visit(event, metod, nameInput, valueInput, classButton, textButton) {
    var form = document.createElement("form");
    form.action = event;
    form.method = metod;
    if (Array.isArray(nameInput)) {
        for (var i = 0; i < nameInput.length; i++) {
            var input = document.createElement("input");
            input.value = valueInput[i];
            input.name = nameInput[i];
            input.type = "hidden";
            form.appendChild(input);
        }
    } else {
        var input = document.createElement("input");
        input.value = valueInput;
        input.name = nameInput;
        input.type = "hidden";
        form.appendChild(input);
    }
    var btn = document.createElement("button");
    var cl = "btn btn-" + classButton.toString();
    btn.className += cl;
    btn.type = "submit"
    btn.innerHTML = textButton;
    form.appendChild(btn);
    return form;
}