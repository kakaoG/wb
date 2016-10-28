/**
 * Created by sangcixiang on 16/9/11.
 */
// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i061', function($scope,$filter,$interval) {
   // $scope.export_flag = false; //点击导出按钮标记：true导出，false查询
   //
   // // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到 18046092141
   // // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期
   // $scope.input = function(event) {
   //     apiconn.send_obj({
   //         // 典型的请求都有这两个字段，
   //         "obj": "associate",
   //         "act": "mock",
   //         "to_login_name": TOOLBOX_ACCOUNT,
   //         "data": {
   //             "obj":"test",
   //             "act":"input1", // 区分不同的输入
   //             // 通常还有采集到的用户在界面输入的其他数据，一起发送好了
   //             // data 可以是复杂的哈希数组
   //             "data":$scope.inputMsg
   //         }
   //     });
   //
   //     // 典型的接口请求，构造一个请求包 调用 send_obj 就可以了
   //     // 就是这个send可能会被SDK拒绝。接收后，如果服务端超时，
   //     // 会在15秒内给出响应： uerr: ERR_CONNECTION_EXCEPTION
   // };
    var target = "ALL";
    var start_end = new Array(2);
    var day_num;
    $scope.contents = [];
    $scope.items_name = [];
    $scope.x = '全服用户';
    var list = false;

    $scope.phone = '';
    $scope.modths = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    $scope.page = 1;
    $scope.showDatePicker = false;
    $scope.changea = '10';
    $scope.openDatePicker = function(){
        $scope.showDatePicker = !$scope.showDatePicker;
    };



    $scope.change = function(type){
        $scope.sleectBox = false;
        if(type == '个人'){
            $scope.sleectBox = true;
            target = "PERSON";
        }else if(type == '全服用户'){
            target = "ALL";
        }else if(type == 'IOS用户'){
            target = "IOS";
        }else if(type == 'Android用户'){
            target = "ANDROID";
        } else {
            target = "ALL";
        }
    }
    // 改条显示条数
    $scope.change1 = function(value){
        $scope.page = 1;
        var condition = {
            "target":target
        };
        if(start_end[0] != null && start_end[1] != null){

            condition.start_end = start_end;
        }
        if(day_num != null && start_end[0] == null && start_end[1] == null){
            condition.day_num = day_num;
        }

        if(target == 'PERSON'){
            if($scope.phone.length<=0){
                alert('请输入个人账号');
                return;
            }
            condition.person_phone = $scope.phone;
        }
        apiconn.send_obj({
            "obj":"benefit",
            "act":"search",
            "admin_id":localStorage.getItem("userid"),
            "condition":condition,
            "page_num":$scope.page - 1,
            "page_size":value
        });

    }


    //上一页
    $scope.up = function(){
        console.log('上一页');
        if($scope.page >1){
            $scope.page--;
            select()
        }
    }
    //下一页
    $scope.next = function(){
        console.log('下一页');
        if($scope.page < $scope.allPage){
            $scope.page++;
            select()
        }

    };
    //时间选择
    $scope.slectedDate = function(type){
        switch (type){
            case 0:
                day_num = 0;
                $scope.selectedDate = '今天';

                break;
            case 1:
                day_num = 1;
                $scope.selectedDate = '昨天';
                break;
            case 2:
                day_num = 7;
                $scope.selectedDate = '近七天';
                break;
            case 3:
                day_num = 30;
                $scope.selectedDate = '近三十天';
                break;
        }
        start_end[0] = null;
        start_end[1] = null;
        $scope.page = 1;
        select();
        $scope.showDatePicker = false;
    }
   //时间选择
    $scope.enter = function(){

        var startDate = document.getElementById('jqueryPicker');

        var startTimer = new Date(startDate.value).getTime();

        var endDate = document.getElementById('jqueryPicker1');

        var endTimer = new Date(endDate.value).getTime();

        start_end[0] = startTimer;
        start_end[1] = endTimer;

        var startStr = Format('yyyy-MM-dd',startTimer);
        var endStr = Format('yyyy-MM-dd',endTimer);
        $scope.selectedDate = startStr + ' 至 ' + endStr;
        $scope.showDatePicker = false;
        select();
    }
    function getList(){

        if(!list){
            apiconn.send_obj({
                "obj":"benefit",
                "act":"item_list",
                "admin_id":localStorage.getItem("userid")
            });
            list = true;
        }
    }
    function select(){
        $scope.export_flag = false;
        var condition = {
            "target":target
        };
        if(start_end[0] != null && start_end[1] != null){

            condition.start_end = start_end;
        }
        if(day_num != null && start_end[0] == null && start_end[1] == null){
            condition.day_num = day_num;
        }

        if(target == 'PERSON'){
            if($scope.phone.length<=0){
                alert('请输入个人账号');
                return;
            }
            condition.person_phone = $scope.phone;
        }

        console.log(condition);
        console.log($scope.page);
        console.log($scope.changea);
        apiconn.send_obj({
            "obj":"benefit",
            "act":"search",
            "admin_id":localStorage.getItem("userid"),
            "condition":condition,
            "page_num":$scope.page - 1,
            "page_size":$scope.changea
        });
    }

    //导出
    $scope.export_xlsx = function(){
        if($scope.items.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var records = $scope.changea*$scope.allPage;

        var condition = {
            "target":target
        };
        if(start_end[0] != null && start_end[1] != null){

            condition.start_end = start_end;
        }
        if(day_num != null && start_end[0] == null && start_end[1] == null){
            condition.day_num = day_num;
        }

        if(target == 'PERSON'){
            if($scope.phone.length<=0){
                alert('请输入个人账号');
                return;
            }
            condition.person_phone = $scope.phone;
        }
        getList();
        apiconn.send_obj({
            "obj":"benefit",
            "act":"search",
            "admin_id":localStorage.getItem("userid"),
            "condition":condition,
            "page_num":0,
            "page_size":records
        });
    };
    $scope.cancelAA = function(){

        $scope.showDatePicker = false;

    };

    $scope.select = function(){
        $scope.page = 1;
        select()
    };

   //
    $("#jqueryPicker").datetimepicker();

    $("#jqueryPicker1").datetimepicker();
   //
   // $scope.newDate = Format('yyyy-MM-dd',new Date());



    function Format(fmt,date){
        var date = new Date(date);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S":  date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var s in o){
            if (new RegExp("(" + s + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[s]) : (("00" + o[s]).substr(("" + o[s]).length)));
            }
        }
        return fmt;
    }
    var timer1 = $interval(function(){

        apiconn.send_obj({
            "obj":"benefit",
            "act":"item_list",
            "admin_id":localStorage.getItem("userid")
        });

        $interval.cancel(timer1);
    },2);
    var timer = $interval(function(){
        var condition = {
            "target"  :target,
            "day_num" : 30
        };
        //
        var  a = apiconn.send_obj({
            "obj":"benefit",
            "act":"search",
            "admin_id":localStorage.getItem("userid"),
            "condition":condition,
            "page_size":10
        });
        console.log(a);
        $interval.cancel(timer);
    },1);
   // $scope.output = "等待服务端数据";
    var toolbar = false;
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

        // 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户 1474099765671

        // 要处理。 ustr 是文本字符串的错误说明  1474045818
        // 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。

        // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
        // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
        // 工具箱那里按键"send input" 这个：
        // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}

        if (jo.obj == "benefit" && jo.act == "item_list") {
            // 服务端的数据来了，呈现
            var itmes = jo.items;
            $scope.items_name = jo.items;
            //fistClick = true;
            for(var keys in itmes){
                var obj = {name:itmes[keys], id:keys};
                $scope.contents.push(obj);
            }
        }
        if (jo.obj == "benefit" && jo.act == "search") {
            getList();
            if($scope.export_flag==true){//导出
                $scope.filename = "福利发放记录";
                var detail = "";
                var arr = [["发放日期","发放人员","发放目标","发放内容","发放因素","发放账号"]];
                angular.forEach(jo.result,function(x){
                    detail = "";
                    for(var key in x.items){
                        detail += $scope.items_name[key]+"x"+x.items[key]+";";
                    }
                    arr.push([$filter('date')(x.et*1000,'yyyy-MM-dd HH:mm'), x.issue_name,x.target,detail,x.reason,x.person_phone]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                // 服务端的数据来了，呈现
                $scope.items = jo.result;
                if ($scope.items.length <= 0) {
                    $('.btn-toolbar').hide();
                    alert('没有相应数据');
                    return;
                } else {
                    $('.btn-toolbar').show();
                }
                $scope.allPage = jo.total_page;
                for (var i = 0; i < $scope.items.length; i++) {
                    $scope.items[i].content = [];
                    for (var keys in $scope.items[i].items) {
                        for (var j = 0; j < $scope.contents.length; j++) {

                            if (keys == $scope.contents[j].id) {
                                var obj = {name: $scope.contents[j].name, number: $scope.items[i].items[keys]}
                                $scope.items[i].content.push(obj)
                            }
                        }
                    }
                }
                if (!toolbar) {
                    toolbar = true;
                }
            }
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
        }
    });
});
