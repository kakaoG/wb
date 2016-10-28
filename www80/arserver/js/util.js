var istouch="ontouchstart" in window;
var mousedown=istouch ? "touchstart" : "mousedown";
var mousemove=istouch ? "touchmove" : "mousemove";
var mouseup=istouch ? "touchend" : "mouseup";
var clicks=mouseup;
var $=function(id,isTag){
    var dom= isTag ? document.querySelectorAll(id) : document.querySelector(id);
    if(!dom){
        console.info(id,"不存在");
    }
    return dom;
}
var tapBind=function(dom,call){
    dom.addEventListener(mousedown,function(){
        this.setAttribute("isMove","ok");
        this.setAttribute("moveNum","1");
    },false);
    dom.addEventListener(mousemove,function(){
        var moveNum=this.getAttribute("moveNum");
        this.setAttribute("moveNum",parseInt(moveNum)+1);
    },false);
    dom.addEventListener(mouseup,function(e){
        var isMove=this.getAttribute("isMove");
        var moveNum=this.getAttribute("moveNum");
        if(isMove=="ok"){
            if(parseInt(moveNum)<=2){
                if(call){
                    call(e,this);
                }
            }
        }
        this.setAttribute("moveNum",10);
    },false);
}
var $bind=function(id,call){
    tapBind($(id),call);
}

var $css=function(id,attr){
    var dom=$(id);
    for(var i in attr){
        dom.style[i]=attr[i];
    }
}

function ajax(url,call){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){ 
            if(call){
                call(xhr.responseText);
            }
        }
    }
    xhr.open('get',url);
    xhr.send(null);
}

var search=decodeURI(location.search);
var searchObj={};
if(search!=""){
    search.substr(1,search.length)
        .split("&").forEach(function(data){
        var datas=data.split("=");
        searchObj[datas[0]]=datas[1];
    });
}
//权限配置
var cfgQuanx={
    
}
var connObj={
    init:function(startCall){
        startApiconn();
        apiconn.wsUri = common_wsUri;
        if(startCall){
            startCall();
        }
        return;
        
        var server_infoCall=function(){
           //这是入口
            //console.info("start!!");
            if(startCall){
                startCall();
            }
        }
        apiCallback["server_info"]=function(){
            //开启引导
            server_infoCall();
        }
        apiconn.connect(); 
    }
}
function downloadFile(fileName, content) {
      var aLink = document.createElement('a');
      aLink.download = "downlaod.csv";
      var text = '';
      text += content;

      var blob = new Blob([text]);
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, false);
      //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
      aLink.download = fileName;
      aLink.href = 'data:attachment/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content); // URL.createObjectURL(blob);
      aLink.dispatchEvent(evt);
}