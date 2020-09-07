"use strict";
//从前端中获取json数据
function getJson() {
    var temp = document.getElementById("data").value;
    return JSON.parse(temp);
}
function main() {
    //const json=getJson()
    var jsontest = '{"name":"hello"}';
    var json = JSON.parse(jsontest);
    alert(json.name);
}
//传入base64字符串转为utf8函数字符串
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
//示例base64编码函数字符串
var teststr = "aXRlbXNbMl09aXRlbXNbMV0raXRlbXNbMF0NCnJldHVybiBpdGVtcw==";
console.log('测试编码转化' + b64_to_utf8(teststr));
var items = [1, 1, 1];
function looseJsonParse(obj) {
    return Function('"use strict";' + obj)();
}
console.log(items);
looseJsonParse(b64_to_utf8(teststr));
console.log(items);
