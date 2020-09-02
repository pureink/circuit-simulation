"use strict";
function test() {
    var temp = document.getElementById("data").value;
    var testjson = JSON.parse(temp);
    alert(testjson.name);
}
