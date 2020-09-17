//从前端中获取json数据
function getJson(){
    const temp = (<HTMLInputElement>document.getElementById("data")).value;
    return JSON.parse(temp);
    
}
//主函数
function main(){
    //const json=getJson()
    let sec=document.getElementById("circuit")
console.log(sec)
for(let j = 0;j < array.length;j++){
    if(sec!=null)
sec.innerHTML+=JSON.stringify(array[j]).replace(/[\\]/g,'')+"</br>"
}
}
//传入base64字符串转为utf8函数字符串
 function b64_to_utf8( str:string ) {
    return decodeURIComponent(escape(window.atob( str )));
}
//示例base64编码函数字符串

//利用Function函数将字符串转换为运行时函数
function looseJsonParse(obj:string){
    return Function('"use strict";'+obj)();
}
function looseParse(obj:object,str:string){
    return Function('"use strict";'+str)(obj);
}
let testjson="let out="
let test={
    a:2,
    b:3
}
//拥有两个数组包括模块和导线的集合
//模块记录id 类型 名称 函数 上下链接模块位置，输入端口个数 输出端口（位宽和名称信息）
//对每个模块先判断输入是否足够，足够的话输入对象转换为数字类型进行函数运算，转换为string类型根据位宽进行修整(同时根据port的toname修改对象属性名称)，转递给下一个
//模块作为输入，若输出多个，记录分支用于回溯
interface pt{
    "p_id":string,
    "name":string,
    "toname":string,
    "tomdu":number[],
    "width":number,
    "dire":string
}
interface mdu{
    "m_id":string,
    "type":string,
    "name":string,
    "func":string,
    "lastmdu":number[],
    "nextmdu":number[],
    "input":number,
    "ports":Array<pt>,

}
const modules:Array<mdu>=[
    {
        "m_id":"m001",
        "type":"comb",
        "name":"A",
        "func":"b3V0LmFfb3V0ID0gaW5wLnZhbHVlICsrOw==",
        "lastmdu":[],
        "nextmdu":[2,3],
        "input":0,
        "ports":[
            {
                "p_id":"p0001",
                "name":"a_out",
                "toname":"a_in",
                "tomdu":[2,3],
                "width":4,
                "dire":"out"
            }
            //仅保留dire为out的端口，添加熟悉toname获取传输后的端口名称      
        ]
    },
    {
        "m_id":"m0002",
        "type":"comb",
        "name":"B",
        "func":"b3V0LmIxX291dCA9IGlucC52YWx1ZSAvIDI7DQpvdXQuYjJfb3V0ID0gaW5wLnZhbHVlIC0gMiAqIG91dC5iMV9vdXQ7DQo=",
        "lastmdu":[],
        "nextmdu":[2],
        "input":0,
        "ports":[
            {
                "p_id":"p0002",
                "name":"b1_out",
                "toname":"b1_in",
                "tomdu":[2],
                "width":1,
                "dire":"out"
            },
            {
                "p_id":"p0003",
                "name":"b2_out",
                "toname":"b2_in",
                "tomdu":[2],
                "width":4,
                "dire":"out"
            }
        ]
        
    },
    {
        "m_id":"m0003",
        "type":"comb",
        "name":"C",
        "func":"aWYoaW5wLmIxX2luKSAgb3V0LmNfb3V0ID0gaW5wLmIxX2luICsgaW5wLmFfaW47DQplbHNlIG91dC5jX291dCA9IGlucC5hX2luIC0gaW5wLmIxX2luOw0K",
        "lastmdu":[0,1],
        "nextmdu":[3],
        "input":3,
        "ports":[
            {
                "p_id":"p0007",
                "name":"c_out",
                "toname":"c_in",
                "tomdu":[3],
                "width":4,
                "dire":"out"
            }
        ]
        
    },
    {
        "m_id":"m0004",
        "type":"comb",
        "name":"D",
        "func":"b3V0LmRfb3V0ID0gaW5wLmNfaW4gKyBpbnAuYV9pbjs=",
        "input":2,
        "lastmdu":[0,2],
        "nextmdu":[],
        "ports":[
        ]
        
    }
]
//起手准备
//声明一个数组，如果哪个模块没有输入说明为开始模块，添加进数组
let starts:Array<number>=[]
for(var i = 0; i < modules.length;i++){
    if(modules[i].lastmdu.length===0)
    starts.push(i)
}
let ends:Array<number>=[]
for(var i = 0; i < modules.length;i++){
    if(modules[i].ports.length===0)
    ends.push(i)
}
console.log("以下为全局处理内容")
console.log("开始模块为")
for(var i = 0; i < starts.length;i++)
{
    console.log(modules[starts[i]].name)
}
console.log("结束模块为")
for(var i = 0; i < ends.length;i++)
{
    console.log(modules[ends[i]].name)
}

function isend(ends:Array<number>){
for(var i=0;i<ends.length;i++){
if(isvisit[ends[i]]===0){
    return false
}
return true
}

}
//模块运行时会遇到多输出参数和多输出模块和多输入情况
//如果遇到多输入模块需要返回上一个分支数组
//如果模块多输出或者starts数组长度大于1，构建回溯数组[]并添加分支位置，遇到多输入模块缺少参数，由此数组从后向前返回
//若模块的每个输出都有记录则删除此分支位置。
let backtrack:Array<number>=[]//回溯数组
if(starts.length!==1){
backtrack.push(-1)
}
let isvisit:Array<number>=[]
for(var i = 0; i < modules.length;i++)
{
    isvisit.push(0)
}
console.log('backtrack为'+backtrack)
//模块需要满足输入齐全才可以输出，否则回溯添加新输入，modules包含input的参数，构建新数组
let isfull=[]
for(var i = 0; i < modules.length;i++)
{
    isfull.push(0)
}
//如果某模块成功获得输入，对应位置的input+1，如果此input小于module数组中的input则回溯
//如果input满足条件则输出后此模块无用进入下一模块 设定为finished

let isfinished:Array<number>=[]
for(var i = 0; i < modules.length;i++)
{
    isfinished[i+1]=modules[i].nextmdu.length
}
isfinished[0]=starts.length
console.log("isfinished "+isfinished)
//多输入情况下finish为starts数组长度，其他情况下为当前模块的nextmdu长度,创建初始数组[2,2,1,1,0]对应初始和ABCD
let finished:Array<number>=[]
for(var i = 0; i < modules.length+1;i++)
{
    finished.push(0)
}
// 回溯数组的处理
//仅多端口输出不同模块时需要回溯，若单端口输出多模块无需回溯，如A-{B-C-D,E-D}，在nextmdu中找到第一个在port.tomdu中匹配相应数组，
//添加回溯，返回过滤后的ports数组，如果两次ports数组大小不同，且当前无回溯添加->添加回溯 如果ports数组相同 且有回溯，删除回溯

//while(finish(isfinished)===false)//如果没有全部遍历完毕,继续遍历
//数据传输和数据处理使用对象进行中转无需考虑端口问题
let inp:any={
    value:"0101"
}
//修改对象名称
function cvtPortName(before:object,name1:string,name2:string){
    let after = JSON.parse(JSON.stringify(before).replace(name1,name2));
    return after
}
//将对象的所有属性转化为10进制的number类型进行运算
function strtoint(calculate: { [x: string]: any; }){
for(let key in calculate){
    calculate[key]=parseInt(calculate[key],2)
}
return calculate
}
//将对象的所有属性由十进制转为string类型，根据位宽需求进行输入输出
function inttostr(calculate: { [x: string]: any; }){
    for(let key in calculate){
        calculate[key]=calculate[key].toString(2)
    }

}
function removeByValue(arr:Array<number>, val:number) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }
var start:number=starts[0];
var array:Array<string> =[]
function getnextmdu(num:number){
    console.log("运行getnextmdu函数")
    let times:number=0
    for(var i=0;i<modules[num].nextmdu.length;i++){
if(isvisit[modules[num].nextmdu[i]]===1){
    times++
}
    }
    console.log("下一个模块为"+modules[num].nextmdu[finished[num+1]])
    console.log("此时backtrack长度为"+backtrack.length)
     return modules[num].nextmdu[times]
}
function getbackmdu(num:number){
    //给出回溯数组中的值获取回溯的模块
    if(num===-1){
        //回溯到初始模块
        return starts[finished[num+1]]
    }
    //如果不是初始模块直接返回指示的模块即可
    return num
}
console.log("以下为循环内输出")
let out={}
//对模块进行循环遍历
//初始回溯值为-1 检测如果为-1，前往starts的下一位其他时刻nextmdu代替starts
//a模块检查本身输出端口，发现不为1，回溯数组push新值，对初始circuit进行运算，传出对象具有a_out属性，位宽和改名后，查询下一模块数组为[2，3]即CD模块，先C，选择C
//则c的isfull数组自增1，检测发现输入不足（isfull[start]!=xxx.input）则检查回溯，此时为[-1，0]即返回初始多输入和a模块
//先回溯第一个发现是-1，到B模块，运算后得到两个新属性，对模块中每个port进行改名和位宽修改，此时C的isfull自增2次
//a,b都运行完毕，回溯数组弹出-1，保存查找下一模块为C，C模块检测（isfull[start]===xxx.input）满足条件，运行函数
//下一模块为D，检查输入缺失，返回回溯数组第一个[0]即a模块，前往nextmdu[]数组的下一值，即D模块，检查输入完整运行函数，保存，无输出结束循环
//isfull数组用于判断当前模块的输入是否足够（全部输入则执行代码，否则回溯）
//isfinished数组用于判断当前模块是否全部输出（全部输出，则结束此回溯位置）和finished数组进行对比，相等则回溯数组shift()
while(start < modules.length){
    out={}
//对输入对象进行转换
//如果该模块输入的input不足够start指针返回回溯上一节点
if(isvisit[start]===0&&modules[start].nextmdu.length>1)
{
    backtrack.push(start)
}
console.log("isvisit"+isvisit)
console.log("backtrack为"+backtrack)
console.log("回溯数组为"+backtrack)
console.log("isfull数组为"+isfull)
console.log("isfinished"+isfinished)
console.log("finished"+finished)
console.log("当前模块为 "+start)
console.log("module所需输入"+modules[start].input)
console.log("isfull特定位置值"+isfull[start])
if(isfull[start]!=modules[start].input)
{
    console.log("输入不足够，进行回溯")
//返回上一回溯位置进行函数,start赋予新值
var back=backtrack[0];
start=getbackmdu(back)
console.log("回溯到"+start)

continue;
}
//仅第一次访问时进行运算
if(isvisit[start]===0){
    console.log("输入足够，开始运行")
    console.log("运算对象inp为")
    console.log(inp)
    strtoint(inp);
    looseJsonParse(b64_to_utf8(modules[start].func));//进行运算修改calculate
    inttostr(out);//返回输出的内容，接下来进行位宽和名称修改
    inttostr(inp)
    console.log("修改名称前")
    console.log(out)
    array.push(JSON.stringify(out))
    for(let i = 0;i < modules[start].ports.length;i++){
        out=cvtPortName(out,modules[start].ports[i].name,modules[start].ports[i].toname)   
    }   
    console.log("修改名称后为")
    console.log(out)
    inp=Object.assign(inp,out)
    //TODO in 和out分别存储 修改名称
    for(var i = 0; i < modules[start].ports.length;i++)
    {
        console.log(modules[start].ports[i].name)
    }
    console.log(inp)
    console.log(array)

    

}
    //结束当前模块运算，首先找到下一模块
    var currentports=modules[start].ports
    //仅保留传输到下一模块的端口
    console.log("当前端口组")
    console.log(currentports)
    let nextports = currentports.filter((item,nextmodule)=>{
        return item.tomdu.indexOf(nextmodule)
    });
    console.log("筛选后端口组")
    console.log(nextports)
    
    //进行的一个模块有多少对应的端口，输出的模块的isfull数组中值应添加相应值
var nextmodule=getnextmdu(start)
if(nextmodule===undefined)break;
console.log("next mdu is "+modules[nextmodule].name)
if(starts.indexOf(nextmodule)===-1){
        
    isfull[nextmodule]+=nextports.length;
}
//TODO 回溯时返回错误的分支，本来从A应返回到D 但是去了C，此时的finished数组不正确
//isfinished[2,2,1,1,0] finished[2,0,0,1,0]

console.log("符合条件的端口数量"+nextports.length)
//完成当前运算，当前模块finished数组改变，下一模块input属性即isfull数组发生改变
if(starts.indexOf(start)!=-1){
    finished[0]++;
}
else{
    finished[start+1]++;
}

//if(modules[nextmodule].ports.length===0)break;
if(isend(ends)===true)break;
console.log("isfull再输出一次"+isfull)
//移除回溯数组中当前模块
if(isfinished[0]===finished[0]){
    removeByValue(backtrack,-1)
}
if(starts.indexOf(start)===-1){
    let times:number=0
    for(var i=0;i<modules[start].nextmdu.length;i++){
if(isvisit[modules[start].nextmdu[i]]===1){
    times++;
}
    if(modules[start].nextmdu.length===times)
    removeByValue(backtrack,start)
}
    }
isvisit[start]=1;
start=nextmodule



}


console.log(array) 