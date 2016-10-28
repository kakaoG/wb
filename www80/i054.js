// 页面逻辑定制在这里，布局在 i.html 和 i.css 
// 全局SDK用的变量 【初始化和登录 A】
var apiconn = new APIConnection();

// client_info 可选，每次请求，会自动带上，发送给服务端
apiconn.client_info.clienttype = "web";

// 定义这样一个监听器，用来处理SDK 来的说与服务端连接状态改变了的通知 【初始化和登录 B】
apiconn.state_changed_handler = function() {

    rootScope.$apply(function() {

        console.log("state: "+apiconn.from_state+" => "+apiconn.conn_state);
        // 这时候成功进入登录状态了。没登录时候只是访客状态。【初始化和登录 G】
        if (apiconn.conn_state == "IN_SESSION") {

            sessionStorage.setItem("login_name", apiconn.login_name);
            sessionStorage.setItem("login_passwd", apiconn.login_passwd);

            // 连接状态，表明SDK和服务端已经成功连上，获得了 server_info
            // 客户端可以允许用户输入密码（或从客户端保存密码）进行登录了 【初始化和登录 E】
        } else if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {
            //消息推送模块：查询文章详情
            var baseUrl = window.location.href;
            var article_id = (baseUrl.indexOf('article_id=') > 0 ? baseUrl.substr(baseUrl.indexOf('article_id=')+11) : baseUrl);
            apiconn.send_obj({
                "obj":"manage",
                "act":"essay_info_get",
                "push_id":article_id
            });
        }

        rootScope.$broadcast("STATE_CHANGED_HANDLER", {});
    });
};


// SDK 说服务端有数据过来了，这可以是请求的响应，或推送 【初始化和登录 C】
apiconn.response_received_handler = function(jo) {
    var key=jo.obj+"_"+jo.act;
    if(key=="person_login"){
        localStorage.setItem("koaccount","yes");
        var kodata={
            _id:jo.user_info._id
        }
        localStorage.setItem("kodata",JSON.stringify(kodata));
    }

    rootScope.$apply(function() {

        // 通用报错机制
        if (jo.ustr != null && jo.ustr != "") alert(jo.ustr);

        // 通过这个机制，分发到所有控制器，感兴趣的控制器可以这样监听
        // $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {}
        if (jo.obj == "sdk" && jo.act == "switchreq") {
            return goto_view(jo.ixxx);
        }

        rootScope.$broadcast("RESPONSE_RECEIVED_HANDLER", jo);
    });
};
// 【初始化和登录 D】
apiconn.wsUri = common_wsUri;
apiconn.connect();



var app = angular.module('i054_app', []);
app.controller('i054_ctrl', function ($scope) {
    $scope.data = {};


    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "manage" && jo.act == "essay_info_get") {
            $scope.data = jo.essay_info;
            document.getElementById("essay").innerHTML = $scope.data.essay;
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
        }
    });
});

app.run(['$rootScope', function ($rootScope) {
    rootScope = $rootScope;
}]);


