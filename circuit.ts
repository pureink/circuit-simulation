//从前端中获取json数据
function getJson(){
    const temp = (<HTMLInputElement>document.getElementById("data")).value;
    return JSON.parse(temp);
    
}
class modules{
    m_id:string;
    name:string;
    type:string;
    state:state[];
    func:string;
    ports:ports[];
    ports_in:ports[];
    //不能将类型“null”分配给类型“modules[]”
    lastmdu:modules[];
    nextmdu:modules[];
    input:number;
    // constructor(m_id:string,name:string,type:string,func:string,ports:ports[]){
    //     this.m_id = m_id;
    //     this.name = name;
    //     this.type = type;
    //     this.state = 0;
    //     this.func = func;
        // this.lastmdu=[];
        // this.nextmdul=[];
        // this.ports=[];
    // }
    constructor(module:Imodules){
        this.m_id = module.m_id;
        this.name = module.name;
        this.type = module.type;
        this.func = module.func;
        this.lastmdu=[];
        this.nextmdu=[];
        let p:ports[] = [];
        let p_in:ports[] = [];
        for(let i = 0; i < module.ports.length; i++){
            if(module.ports[i].dire == "out"){
                p.push(new ports(module.ports[i]));
            }
            else{
                p_in.push(new ports(module.ports[i]));
            }
        }
        this.ports = p;
        this.ports_in = p_in;
        let s:state[] = [];
        for(let i = 0; i < p_in.length; i++){
            s.push(new state(p_in[i]));
        }
        this.state = s;
        this.input = 0;
    }
}
class wires{
    w_id:string;
    width:number;
    from:string;
    to:string[];
    // constructor(w_id:string,width:number,from:string,to:string[]){
    //     this.w_id = w_id;
    //     this.width = width;
    //     this.from = from;
    //     this.to = to;
    // }
    constructor(iwires:Iwires){
        this.w_id = iwires.w_id;
        this.width = iwires.width;
        this.from = iwires.from;
        this.to = iwires.to;
    }
}
class ports{
    p_id:string;
    name:string;
    width:number;
    dire:string;
    toname:string[];
    tomodules:modules[];
    // constructor(p_id:string,name:string,width:number,dire:string,toname:string){
    //     this.p_id = p_id;
    //     this.name = name;
    //     this.width = width;
    //     this.dire = dire;
    //     this.toname = toname;
    // }
    constructor(port:Iports){
        this.p_id = port.p_id;
        this.name = port.name;
        this.width = port.width;
        this.dire = port.dire;
        this.toname = [];
        this.tomodules = [];
    }
}

class port_result{
    p_id:string;
    name:string;
    width:number;
    result:number;
    constructor(ports:ports){
        this.p_id = ports.p_id;
        this.width = ports.width;
        this.name = ports.name;
        this.result = 0;
    }
}
class state{
    name:string;
    value:number;
    constructor(ports:ports){
        this.name = ports.name;
        this.value = 0;
    }
}

interface Imodules{
    m_id:string;
    name:string;
    type:string;
    func:string;
    ports:Iports[];
}

interface Iwires{
    w_id:string;
    width:number;
    from:string;
    to:string[];
}

interface Iports{
    p_id:string;
    name:string;
    width:number;
    dire:string
}


interface Ijson{
    modules:Imodules[];
    wires:Iwires[];
}

//这是一个从json文件中，读出多少个modules、wires、ports的函数
 //并返回Imodules[]、Iwires[]、Iports[];
 //被注释掉的部分是我的思路

 function readIModules(json_text:string):Imodules[]{
    const obj:Ijson = JSON.parse(json_text);
    return obj.modules;
}
function readIWires(json_text:string):Iwires[]{
    const obj:Ijson = JSON.parse(json_text);
    return obj.wires;
}
// function readIPorts(json_text:string):Iports[]{
//     const obj:Ijson = JSON.parse(json_text);
//     const allports:Iports[] = [];
//     for(let num = 0;num < obj.modules.length; num++){
//         allports.concat(obj.modules[num].ports);
//     }
//     return allports;
// }

//此时return的modules和ports尚不完整
//需要其他的函数继续修饰
function readModules(imodules:Imodules[]):modules[] {
    const m:modules[] = [];
    for(let i = 0; i < imodules.length;i++){
        m.push(new modules(imodules[i]));
    }
    return m;
}
function readPorts(iports:Iports[]):ports[] {
    const p:ports[] = [];
    for(let i = 0; i < iports.length;i++){
        p.push(new ports(iports[i]));
    }
    return p;
}
function readWires(iwires:Iwires[]):wires[]{
    const w:wires[] = [];
    for(let i = 0; i < iwires.length;i++){
        w.push(new wires(iwires[i]));
    }
    return w;
}
//将readPorts中获得的端口只保留dire为out的端口
//并添加属性toname获取传输后的端口名称
//并添加tomodules保存端口所传输给的模块
// function finalPorts(modules:modules[],ports:ports[],wires:wires[]):ports[]{
//     const p:ports[] = [];
//     for(let i = 0; i < ports.length; i++){
//         if(ports[i].dire == "out")
//         {
//             p.push(ports[i]);
//         }
//     }
//     for(let i = 0; i < p.length; i++){
//         for(let j = 0; j < wires.length; j++){
//             if(p[i].name == wires[j].from){
//                 p[i].toname = wires[j].to;
//             }
//         }
//     }
//     for(let i = 0; i < p.length; i++){
//         for(let j = 0; j < modules.length; j++){
//             for(let k = 0; k < modules[i].ports.length; k++){
//                 for(let m = 0; m < p[i].toname.length; m++){
//                     if(p[i].toname[m] == modules[j].ports[k].name)
//                     {
//                         p[i].tomodules.push(modules[j]);
//                     }
//                 }
//             }
//         }

//     }
//     return p;
// }
function finalPorts(modules:modules[],wires:wires[]){
    for(let i = 0; i < modules.length; i++){
        for(let j = 0; j < modules[i].ports.length; j++){
            for(let k = 0; k < wires.length; k++){
                if(modules[i].ports[j].p_id == wires[k].from){
                    modules[i].ports[j].toname = wires[k].to;
                }
            }
        }
    }
    for(let i = 0; i < modules.length; i++){
        for(let j = 0; j < modules[i].ports.length; j++){
            for(let k = 0; k < modules.length; k++){
                for(let m = 0; m < modules[k].ports_in.length; m++){
                    if(modules[i].ports[j].toname.indexOf(modules[k].ports_in[m].p_id) != -1 ){
                        modules[i].ports[j].tomodules.push(modules[k]);
                    }
                }
            }
        }
    }
}
//需要注意的是，上面的函数尚未保存修改后modules的ports

//获取上面所需的lastmdu/nextmdu/input

function finalModules(modules:modules[]){
    // modules[0].nextmdu.push(modules[0]);
    for(let i = 0; i < modules.length; i++){
        const m_now_nextmdu:modules[] = [];
        for(let j = 0; j < modules[i].ports.length; j++){
            for(let k = 0; k < modules[i].ports[j].tomodules.length; k++){
                if(m_now_nextmdu.indexOf(modules[i].ports[j].tomodules[k]) == -1){
                    m_now_nextmdu.push(modules[i].ports[j].tomodules[k]);
                }
            }
        }
        modules[i].nextmdu = m_now_nextmdu;
    }
    //获取lastmdu
    for(let i = 0; i < modules.length; i++){
        const m_now_lastmdu:modules[] = [];
        for(let j = 0; j < modules.length; j++){
            if(modules[j].nextmdu.indexOf(modules[i]) != -1){
                m_now_lastmdu.push(modules[j]);
            }
        }
        modules[i].lastmdu = m_now_lastmdu;
    }
    //获取input:输入给某模块端口的数量
    for(let i = 0; i < modules.length; i++){
        let number = 0;
        for(let j = 0; j < modules.length; j++){
            for(let k = 0; k < modules[j].ports.length;k++){
                if(modules[j].ports[k].tomodules.indexOf(modules[i]) != -1){
                    number++;
                }
            }
        }
        modules[i].input = number;
    }
}

//生成函数
function getAllMdu(json_text:string):modules[]{
    const imdu:Imodules[] = readIModules(json_text);
    const iwr:Iwires[] = readIWires(json_text);
    let wires:wires[] = readWires(iwr);
    let mdu:modules[] = readModules(imdu);
    finalPorts(mdu,wires);
    finalModules(mdu);
    return mdu;
}
//主函数
let inp:any={
    value:"0101"
}
let out={}
function main(){
    //const json=getJson()
    let sec=document.getElementById("circuit")
console.log(sec)
let test_json_string = JSON.stringify(getJson());
let module = getAllMdu(test_json_string);
console.log(module)
let starts:Array<number>=[]
for(var i = 0; i < module.length;i++){
    if(module[i].lastmdu.length===0)
    starts.push(i)
}
let ends:Array<number>=[]
for(var i = 0; i < module.length;i++){
    if(module[i].ports.length===0)
    ends.push(i)
}
console.log("以下为全局处理内容")
console.log("开始模块为")
for(var i = 0; i < starts.length;i++)
{
    console.log(module[starts[i]].name)
}
console.log("结束模块为")
for(var i = 0; i < ends.length;i++)
{
    console.log(module[ends[i]].name)
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
for(var i = 0; i < module.length;i++)
{
    isvisit.push(0)
}
console.log('backtrack为'+backtrack)
//模块需要满足输入齐全才可以输出，否则回溯添加新输入，modules包含input的参数，构建新数组
let isfull=[]
for(var i = 0; i < module.length;i++)
{
    isfull.push(0)
}
//如果某模块成功获得输入，对应位置的input+1，如果此input小于module数组中的input则回溯
//如果input满足条件则输出后此模块无用进入下一模块 设定为finished

let isfinished:Array<number>=[]
for(var i = 0; i < module.length;i++)
{
    isfinished[i+1]=module[i].nextmdu.length
}
isfinished[0]=starts.length
console.log("isfinished "+isfinished)
//多输入情况下finish为starts数组长度，其他情况下为当前模块的nextmdu长度,创建初始数组[2,2,1,1,0]对应初始和ABCD
let finished:Array<number>=[]
for(var i = 0; i < module.length+1;i++)
{
    finished.push(0)
}
// 回溯数组的处理
//仅多端口输出不同模块时需要回溯，若单端口输出多模块无需回溯，如A-{B-C-D,E-D}，在nextmdu中找到第一个在port.tomdu中匹配相应数组，
//添加回溯，返回过滤后的ports数组，如果两次ports数组大小不同，且当前无回溯添加->添加回溯 如果ports数组相同 且有回溯，删除回溯

//while(finish(isfinished)===false)//如果没有全部遍历完毕,继续遍历
//数据传输和数据处理使用对象进行中转无需考虑端口问题
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
    for(var i=0;i<module[num].nextmdu.length;i++){
if(isvisit[module.indexOf(module[num].nextmdu[i])]===1){
    times++
}
    }
    console.log("下一个模块为")
    console.log(module[num].nextmdu[finished[num+1]])
    console.log("此时backtrack长度为"+backtrack.length)
      return module.indexOf(module[num].nextmdu[times])
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
function gettoname(str:string,mdu:modules[]){
    for(let i=0;i<mdu.length;i++){
        for(let j=0;j<mdu[i].ports_in.length;j++){
            if(mdu[i].ports_in[j].p_id===str){
                return mdu[i].ports_in[j].name
            }
        }
    }
}
console.log("测试我的gettoname函数")
console.log(gettoname("p0009",module))
console.log("以下为循环内输出")
//对模块进行循环遍历
//初始回溯值为-1 检测如果为-1，前往starts的下一位其他时刻nextmdu代替starts
//a模块检查本身输出端口，发现不为1，回溯数组push新值，对初始circuit进行运算，传出对象具有a_out属性，位宽和改名后，查询下一模块数组为[2，3]即CD模块，先C，选择C
//则c的isfull数组自增1，检测发现输入不足（isfull[start]!=xxx.input）则检查回溯，此时为[-1，0]即返回初始多输入和a模块
//先回溯第一个发现是-1，到B模块，运算后得到两个新属性，对模块中每个port进行改名和位宽修改，此时C的isfull自增2次
//a,b都运行完毕，回溯数组弹出-1，保存查找下一模块为C，C模块检测（isfull[start]===xxx.input）满足条件，运行函数
//下一模块为D，检查输入缺失，返回回溯数组第一个[0]即a模块，前往nextmdu[]数组的下一值，即D模块，检查输入完整运行函数，保存，无输出结束循环
//isfull数组用于判断当前模块的输入是否足够（全部输入则执行代码，否则回溯）
//isfinished数组用于判断当前模块是否全部输出（全部输出，则结束此回溯位置）和finished数组进行对比，相等则回溯数组shift()
while(start < module.length){
    out={}
//对输入对象进行转换
//如果该模块输入的input不足够start指针返回回溯上一节点
if(isvisit[start]===0&&module[start].nextmdu.length>1)
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
console.log("module所需输入"+module[start].input)
console.log("isfull特定位置值"+isfull[start])
if(isfull[start]!=module[start].input)
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
    looseJsonParse(b64_to_utf8(module[start].func));//进行运算修改calculate
    inttostr(out);//返回输出的内容，接下来进行位宽和名称修改
    inttostr(inp)
    console.log("修改名称前")
    console.log(out)
    array.push(JSON.stringify(out))
    
    for(let i = 0;i < module[start].ports.length;i++){
   console.log(module[start].ports[i].toname[0])
   let toname=gettoname(module[start].ports[i].toname[0],module)
   if(toname!=undefined)
        out=cvtPortName(out,module[start].ports[i].name,toname)   
    }   
    console.log("修改名称后为")
    console.log(out)
    inp=Object.assign(inp,out)
    //TODO in 和out分别存储 修改名称
    for(var i = 0; i < module[start].ports.length;i++)
    {
        console.log(module[start].ports[i].name)
    }
    console.log(inp)
    console.log(array)

    

}
    //结束当前模块运算，首先找到下一模块
    var currentports=module[start].ports
    //仅保留传输到下一模块的端口
    console.log("当前端口组")
    console.log(currentports)
    let nextports = currentports.filter((item,nextmodule)=>{
        return item.tomodules.indexOf(module[nextmodule])
    });
    console.log("筛选后端口组")
    console.log(nextports)
    
    //进行的一个模块有多少对应的端口，输出的模块的isfull数组中值应添加相应值
var nextmodule=getnextmdu(start)
console.log("下一模块的位置为"+nextmodule)
if(nextmodule===undefined)break;
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

//if(module[nextmodule].ports.length===0&&backtrack.length===0)break;
if(array.length===module.length)break;
console.log("isfull再输出一次"+isfull)
//移除回溯数组中当前模块
if(isfinished[0]===finished[0]){
    removeByValue(backtrack,-1)
}
if(starts.indexOf(start)===-1){
    let times:number=0
    for(var i=0;i<module[start].nextmdu.length;i++){
if(isvisit[module.indexOf(module[start].nextmdu[i])]===1){
    times++;
}
    if(module[start].nextmdu.length===times)
    removeByValue(backtrack,start)
}
    }
isvisit[start]=1;
start=nextmodule



}


console.log(array) 


for(let j = 0;j < array.length;j++){
    if(sec!=null){
        sec.innerHTML+=module[j].name+"模块的输出为"
        sec.innerHTML+=JSON.stringify(array[j]).replace(/[\\]/g,'')+"</br>"
    }

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
const test_json = {
    "modules":[
        {
            "m_id":"m001",
            "type":"comb",
            "name":"A",
            "func":"b3V0LmExX291dCA9IGlucC5hMV9pbiArIDI7DQpvdXQuYTJfb3V0ID0gaW5wLmEyX2luIC0gMTs=",
            "ports":[
                {
                    "p_id":"p0001",
                    "name":"a1_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0002",
                    "name":"a2_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0003",
                    "name":"a1_in",
                    "width":8,
                    "dire":"in"
                },
                {
                    "p_id":"p0004",
                    "name":"a2_in",
                    "width":8,
                    "dire":"in"
                }

            ]
        },
        {
            "m_id":"m002",
            "type":"comb",
            "name":"B",
            "func":"b3V0LmIxX291dCA9IGlucC5iMV9pbiArIGlucC5iMl9pbiArIDE7DQpvdXQuYjJfb3V0ID0gaW5wLmIxX2luIC0gaW5wLmIyX2luOw==",
            "ports":[
                {
                    "p_id":"p0005",
                    "name":"b1_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0006",
                    "name":"b2_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0007",
                    "name":"b1_in",
                    "width":8,
                    "dire":"in"
                },
                {
                    "p_id":"p0008",
                    "name":"b2_in",
                    "width":8,
                    "dire":"in"
                }
            ]
        },
        {
            "m_id":"m003",
            "name":"C",
            "type":"reg",
            "func":"c3RhdGUuYSA9IG91dC5jMV9vdXQ7DQphdGF0ZS5iID0gb3V0LmMyX291dDsNCmluLmMxX2luID0gc3RhdGUuYTsNCmluLmMyX2luID0gc3RhdGUuYjs=",
            "ports":[
                {
                    "p_id":"p0009",
                    "name":"c1_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0010",
                    "name":"c2_out",
                    "width":8,
                    "dire":"out"
                },
                {
                    "p_id":"p0011",
                    "name":"c1_in",
                    "width":8,
                    "dire":"in"
                },
                {
                    "p_id":"p0012",
                    "name":"c2_in",
                    "width":8,
                    "dire":"in"
                }
            ]
        }
    ],
    "wires":[
        {
            "w_id":"w001",
            "width":8,
            "from":"p0009",
            "to":"p0003"
        },
        {
            "w_id":"w002",
            "width":8,
            "from":"p0010",
            "to":"p0004"
        },
        {
            "w_id":"w003",
            "width":8,
            "from":"p0001",
            "to":"p0005"
        },
        {
            "w_id":"w004",
            "width":8,
            "from":"p0002",
            "to":"p0006"
        },
        {
            "w_id":"w005",
            "width":8,
            "from":"p0007",
            "to":"p0011"
        },
        {
            "w_id":"w006",
            "width":8,
            "from":"p0008",
            "to":"p0012"
        }
    ]

};
const testmodules:Array<mdu>=[
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
