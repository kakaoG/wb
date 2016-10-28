/**
 * Created by sangcixiang on 16/9/10.
 */
// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i060', function($scope,$rootScope) {

    // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到
    // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期

    var userId = localStorage.getItem("userid")
    $scope.input = function(event) {

        // 典型的接口请求，构造一个请求包 调用 send_obj 就可以了
        // 就是这个send可能会被SDK拒绝。接收后，如果服务端超时，
        // 会在15秒内给出响应： uerr: ERR_CONNECTION_EXCEPTION
        apiconn.send_obj({
            // 典型的请求都有这两个字段，
            "obj": "benefit",
            "act": "item_list",
            "to_login_name": TOOLBOX_ACCOUNT,
            "data": {
                "obj":"benefit",
                "act":"item_list",
                "data":{
                    "obj":"benefit",
                    "act":"item_list",
                    "admin_id":userId
                }
            }
        });
    };

    $scope.obj = [];
    $scope.items = new Array();
    $scope.showUser = false;
    var target = "ALL";
    $scope.change = function(type){
        if(type == '个人'){
            $scope.showUser = true;
            target = "PERSON";
        }else if(type == '全服用户'){
            target = "ALL";
            $scope.userInfo = false;
            $scope.showUser = false;
        }else if(type == 'IOS用户'){
            target = "IOS";
            $scope.userInfo = false;
            $scope.showUser = false;
        }else if(type == 'Android用户'){
            target = "ANDROID";
            $scope.userInfo = false;
            $scope.showUser = false;
        }
    }
    var fistClick = false;
    $scope.getDateList = function(){


        if(fistClick){
            return;
        }
        apiconn.send_obj({
            "obj":"benefit",
            "act":"item_list",
            "admin_id":userId
        });


    }

    $scope.userInfo = false;
    $scope.getAccount = function(){

        //18046092142
        apiconn.send_obj({
            "obj":"benefit",
            "act":"check_person",
            "admin_id":userId,
            "person_phone":$scope.userAccount
        });
    };
    var i=1;
    $scope.benefit = [];
    $scope.addBenefit = function(){
        i++;
        if(i>10){
            return;
        }
        $scope.benefit.push(i);
    }
    $scope.removeBenefit = function(index){
        i--;
        $scope.benefit.splice(index,1);
    }
    $scope.number = 10;
    var dict = {};
    $scope.input = false;
    $scope.submit = function(){


        if($scope.items.length<=0){
            alert('请选择发放道具');
            return;
        }

        if(i>1){
            var selects = document.getElementById('selectBox').getElementsByTagName('select');
            var inputs = document.getElementById('selectBox').getElementsByTagName('input');
            for(var j=0;j<selects.length;j++){
                var index = selects[j].selectedIndex;
                var key = $scope.items[index].id;
                var value = inputs[j].value;
                dict[key] = value
            }
        }
        var select = document.getElementById('select');
        var index = select.selectedIndex;
        var key = $scope.items[index].id;
        var value = $scope.number;
        dict[key] = value;
        console.log(dict);
        $scope.input = true;
    }
    $scope.cancel =  function(){
        $scope.input = false;
        $scope.pwd = '';
    }
    $scope.enter = function(){
        $scope.input = false;

        apiconn.send_obj({
            "obj":"benefit",
            "act":"issue",
            "admin_id":userId,
            "reason":$scope.yuanying,
            "target":target,
            "phone":$scope.userAccount,
            "passwd":$scope.pwd,
            "items":dict
        });
        $scope.pwd = '';
    }


    $scope.output = "等待服务端数据";
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

        // 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户
        // 要处理。 ustr 是文本字符串的错误说明
        // 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。

        // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
        // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
        // 工具箱那里按键"send input" 这个：
        // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}

        if (jo.obj == "benefit" && jo.act == "item_list") {
            // 服务端的数据来了，呈现
            var itmes = jo.items;
            fistClick = true;
            for(var keys in itmes){
                var obj = {name:itmes[keys], id:keys}
                $scope.items.push(obj);
            }
        }
        if(jo.obj == 'benefit' && jo.act == 'check_person'){
            $scope.userInfo = true;
            $scope.check_person = jo.person_info;
        }
        if(jo.obj == 'benefit' && jo.act == 'issue' && jo.status == 'success'){
            dict = {};
            $scope.obj = [];
            $scope.showUser = false;
            alert('操作成功，道具已经发送');
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
        }
    });
});
