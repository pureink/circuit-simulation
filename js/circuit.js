"use strict";
//从前端中获取json数据
function getJson() {
    var temp = document.getElementById("data").value;
    return JSON.parse(temp);
}
//主函数
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
//利用Function函数将字符串转换为运行时函数
function looseJsonParse(obj) {
    return Function('"use strict";' + obj)();
}
console.log(items);
looseJsonParse(b64_to_utf8(teststr));
console.log(items);
var modules = [
    {
        "m_id": "m001",
        "type": "comb",
        "name": "A",
        "func": "Y2lyY3VpdC5hX291dCA9IGNpcmN1aXQudmFsdWUrMTsNCnJldHVybiBjaXJjdWl0Ow==",
        "lastmdu": null,
        "nextmdu": [2, 3],
        "input": null,
        "ports": [
            {
                "p_id": "p0001",
                "name": "a_out",
                "toname": "a_in",
                "width": 4,
                "dire": "out"
            }
            //仅保留dire为out的端口，添加熟悉toname获取传输后的端口名称      
        ]
    },
    {
        "m_id": "m0002",
        "type": "comb",
        "name": "B",
        "func": "Y2lyY3VpdC5iMV9vdXQgPSBjaXJjdWl0LnZhbHVlIC8gMjsNCmNpcmN1aXQuYjJfb3V0ID0gY2lyY3VpdC52YWx1ZSAtIDIgKiBjaXJjdWl0LmIxX291dDsNCnJldHVybiBjaXJjdWl0Ow==",
        "lastmdu": null,
        "nextmdu": [2],
        "input": null,
        "ports": [
            {
                "p_id": "p0002",
                "name": "b1_out",
                "toname": "b1_in",
                "width": 1,
                "dire": "out"
            },
            {
                "p_id": "p0003",
                "name": "b2_out",
                "toname": "b2_in",
                "width": 4,
                "dire": "out"
            }
        ]
    },
    {
        "m_id": "m0003",
        "type": "comb",
        "name": "C",
        "func": "",
        "lastmdu": [0, 1],
        "nextmdu": [3],
        "input": 3,
        "ports": [
            {
                "p_id": "p0007",
                "name": "c_out",
                "toname": "c_in",
                "width": 4,
                "dire": "out"
            }
        ]
    },
    {
        "m_id": "m0004",
        "type": "comb",
        "name": "D",
        "func": "",
        "input": 2,
        "lastmdu": [0, 2],
        "nextmdu": null,
        "ports": []
    }
];
var wires = [
    {
        "w_id": "w0001",
        "width": 4,
        "from": "p0001",
        "to": [
            "p0004",
            "p0009"
        ]
    },
    {
        "w_id": "w0002",
        "width": 1,
        "from": "p0002",
        "to": [
            "p0005"
        ]
    },
    {
        "w_id": "w0003",
        "width": 4,
        "from": "p0003",
        "to": [
            "p0006"
        ]
    },
    {
        "w_id": "w0004",
        "width": 4,
        "from": "p0007",
        "to": [
            "p0008"
        ]
    }
];
//声明一个数组，如果哪个模块没有输入说明为开始模块，添加进数组
var starts = [];
for (var i = 0; i < modules.length; i++) {
    if (modules[i].lastmdu === null)
        starts.push(i);
}
console.log("开始模块为");
for (var i = 0; i < starts.length; i++) {
    console.log(modules[starts[i]].name);
}
//模块运行时会遇到多输出参数和多输出模块和多输入情况
//如果遇到多输入模块需要返回上一个分支数组
//如果模块多输出或者starts数组长度大于1，构建回溯数组[]并添加分支位置，遇到多输入模块缺少参数，由此数组从后向前返回
//若模块的每个输出都有记录则删除此分支位置。
var backtrack = []; //回溯数组
var currentModule = starts[0]; //
var currentWire = 0;
if (starts.length !== 1) {
    backtrack.push(0);
}
console.log('backtrack为' + backtrack);
//模块数组和导线数组，从starts数组中第一个开始运行
//模块需要满足输入齐全才可以输出，否则回溯添加新输入，modules包含input的参数，构建新数组
var isfull = [];
for (var i = 0; i < modules.length; i++) {
    isfull.push(0);
}
//如果某模块成功获得输入，对应位置的input+1，如果此input小于module数组中的input则回溯
console.log("输出isfull数组" + isfull);
//如果input满足条件则输出后此模块无用进入下一模块 设定为finished
var isfinished = [];
for (var i = 0; i < modules.length; i++) {
    isfinished.push(0);
}
function finish(isfinished) {
    var finish = true;
    for (var i = 0; i < isfinished.length; i++) {
        if (isfinished[i] === 0)
            finish = false;
    }
    return finish;
}
//while(finish(isfinished)===false)//如果没有全部遍历完毕,继续遍历
//数据传输和数据处理使用对象进行中转无需考虑端口问题
var circuit = {
    value: "0101"
};
//将对象的所有属性转化为10进制的number类型进行运算
function strtoint(calculate) {
    for (var key in calculate) {
        calculate[key] = parseInt(calculate[key], 2);
    }
    return calculate;
}
//将对象的所有属性由十进制转为string类型，根据位宽需求进行输入输出
function inttostr(calculate) {
    for (var key in calculate) {
        calculate[key] = calculate[key].toString(2);
    }
}
var start = starts[0];
var array = [];
//对模块进行循环遍历
//while(start < modules.length){
//对输入对象进行转换
strtoint(circuit);
looseJsonParse(b64_to_utf8(modules[start].func)); //进行运算修改calculate
console.log(start);
inttostr(circuit); //返回输出的内容，接下来进行位宽和名称修改
for (var i = 0; i < modules[start].ports.length; i++) {
    var port = modules[start].ports[i];
    var portname = port.name;
    console.log(portname);
}
array.push(JSON.stringify(circuit));
console.log(circuit);
console.log(array);
var next = modules[start].nextmdu;
if (next != null) {
    start = 1;
}
strtoint(circuit);
looseJsonParse(b64_to_utf8(modules[start].func)); //进行运算修改calculate
inttostr(circuit); //返回输出的内容，接下来进行位宽和名称修改
for (var i = 0; i < modules[start].ports.length; i++) {
    var port = modules[start].ports[i];
    var portname = port.name;
    console.log(portname);
}
console.log(circuit);
array.push(JSON.stringify(circuit));
console.log(array);
//}
