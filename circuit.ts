function test(){
    const temp = (<HTMLInputElement>document.getElementById("data")).value;
    const testjson=JSON.parse(temp);
    alert(testjson.name)
 }