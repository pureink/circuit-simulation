//从前端中获取json数据
function getJson(){
    const temp = (<HTMLInputElement>document.getElementById("data")).value;
    return JSON.parse(temp);
    
}
function main(){
    //const json=getJson()
    const jsontest='{"name":"hello"}'
    const json=JSON.parse(jsontest)
    alert(json.name)
}
//传入base64字符串转为utf8函数字符串
 function b64_to_utf8( str:string ) {
    return decodeURIComponent(escape(window.atob( str )));
}
//示例base64编码函数字符串
const teststr="aXRlbXNbMl09aXRlbXNbMV0raXRlbXNbMF0NCnJldHVybiBpdGVtcw=="
console.log('测试编码转化'+b64_to_utf8(teststr))
let items=[1,1,1]
//利用Function函数将字符串转换为运行时函数
function looseJsonParse(obj:string){
    return Function('"use strict";'+obj)();
}
console.log(items)
looseJsonParse(b64_to_utf8(teststr))
console.log(items)
