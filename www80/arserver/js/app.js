
var login_name = ""; // 自动登录
var login_passwd = '';
var person_id="";

function js_app_getRole(account,code,persionid){
    //alert(account+"-"+code+"-"+persionid);
    //当前角色信息对象 data
    //包含 account  code  persion_id
    login_name=account;
    login_passwd=code;
    person_id=persionid;
    //开始建立连接
   // startApiconn();
    //onloadfun();
}

var apiInfoData={};
var apiCallback={};
var apiconn;
function startApiconn(){
    // 全局SDK用的变量 【初始化和登录 A】
    apiconn = new APIConnection();
    // 服务端连接状态改变了的通知 【初始化和登录 B】
    apiconn.state_changed_handler = function(ds) {
        console.log(ds,"state: "+apiconn.from_state," => "+apiconn.conn_state);
       // 这时候成功进入登录状态了。没登录时候只是访客状态。
        if (apiconn.conn_state == "IN_SESSION") {
            sessionStorage.setItem("login_name", apiconn.login_name);
            sessionStorage.setItem("login_passwd", apiconn.login_passwd);
            // 连接状态，表明SDK和服务端已经成功连上，获得了 server_info
            // 客户端可以允许用户输入密码（或从客户端保存密码）进行登录了
        } else if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {
            
            // 自动登录指定账户
            //apiconn.credential(login_name, login_passwd);
            //apiconn.connect();
            // auto re login after page refresh
            // 处理网页刷新自动登录的机制
        }
    };
// SDK 说服务端有数据过来了，这可以是请求的响应，或推送 【初始化和登录 C】
    apiconn.response_received_handler = function(jo) {
        var key=jo.obj+"_"+jo.act;
        console.log(key,"JO:",jo);
        if(key=="server_info"){
            apiInfoData=jo;
        }
        if(apiCallback[key]){
            apiCallback[key](jo);
        }
    };
}