//var common_wsUri = "ws://114.55.100.131:51718/stark_la";
var common_wsUri = "ws://114.55.100.131:51717/stark";


//修改ws地址时，页面执行的时候会自动清理掉保存的上一个ws的adminid，防止出现不存在管理员id的提示
var baseUrl = window.location.href;
if(baseUrl.indexOf("i054.html")==-1 && localStorage.getItem("common_wsUri")!=common_wsUri){
    localStorage.clear();
    localStorage.setItem("common_wsUri",common_wsUri);
    location.href="index.html#/main";
}