/**
 * Created by sangcixiang on 16/9/3.
 */
// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i021', function($scope) {

    // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到  18046092141
    // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期
    $scope.input = function(event) {
        apiconn.send_obj({
            // 典型的请求都有这两个字段，
            "obj": "associate",
            "act": "mock",
            "to_login_name": TOOLBOX_ACCOUNT,
            "data": {
                "obj":"test",
                "act":"input1", // 区分不同的输入
                // 通常还有采集到的用户在界面输入的其他数据，一起发送好了
                // data 可以是复杂的哈希数组
                "data":$scope.inputMsg
            }
        });

        // 典型的接口请求，构造一个请求包 调用 send_obj 就可以了
        // 就是这个send可能会被SDK拒绝。接收后，如果服务端超时，
        // 会在15秒内给出响应： uerr: ERR_CONNECTION_EXCEPTION
    };
    var userId = localStorage.getItem("userid")
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
    function selectPagecharge_list(){
        apiconn.send_obj({
            "obj":"person",
            "act":"charge_list",
            "person_id":$scope.person_id,
            "day_num":day_num,
            "page_size":10,
            "page_num" : $scope.pagecharge_list - 1
        });
    }
    var start_end = new Array();
    var day_num;
    var toolbar = false;
    $scope.type = '用户账号';
    $scope.content = '';     //搜索内容

    $scope.typecharge_list = '10';
    $scope.pagecharge_list = 1;

    $scope.pageList = '10';
    $scope.page = 1;

    $scope.showDatePicker = false;
    $scope.openDatePicker = function(){
        $scope.showDatePicker = !$scope.showDatePicker;
    };
    $scope.selectIdBtn = function(){

        var type = $scope.type;
        var search_type;
        if(type == '用户账号'){
            search_type = 'login_name';
        }else if(type == 'ID'){
            search_type = 'person_id';
        }else if(type == '昵称'){
            search_type = 'person_name';
        }
        if($scope.content.length<=0){
            alert('请输入要查询的ID');
            return;
        }
        apiconn.send_obj({
            "obj":"person",
            "act":"search",
            "admin_id":userId,
            "search_type":search_type,
            "key":$scope.content
        });
    };
    $scope.change_list = function(value){

        console.log(value);
        $scope.pagecharge_list = 1;
        if(!day_num){
            day_num = 'all';
        }
        apiconn.send_obj({
            "obj":"person",
            "act":"charge_list",
            "person_id":$scope.person_id,
            "day_num":day_num,
            "page_size":value,
            "page_num" : $scope.pagecharge_list - 1
        });
    }

    $scope.up = function(){
        if($scope.page >1){
            $scope.page--;
        }
    };
    $scope.next = function(){
        if($scope.page < $scope.allPage1){
            $scope.page++;
        }
    };

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
            case 4:
                day_num = 'all';
                $scope.selectedDate = '全部';
                break;
        }
        $scope.showDatePicker = false;
        selectPagecharge_list();
    };
    $scope.enter = function(){
        var startDate = document.getElementById('jqueryPicker');
        var startTimer = new Date(startDate.value).getTime();
        var endDate = document.getElementById('jqueryPicker1');
        var endTimer = new Date(endDate.value).getTime();
        if(startTimer>endTimer){
            alert('开始时间不能大于结束时间');
            return;
        }
        if(startDate.value.length <= 0|| endDate.value.length <=0){
            alert('请选择相应的查询时间');
            return;
        }
        var startStr = Format('yyyy-MM-dd',startTimer);
        var endStr = Format('yyyy-MM-dd',endTimer);
        $scope.selectedDate = startStr + ' 至 ' + endStr;
        $scope.showDatePicker = false;
        apiconn.send_obj({
            "obj":"person",
            "act":"charge_list",
            "admin_id":$scope.person_id,
            "day_num":'diy',
            "start_time":startTimer/1000,
            "end_time":endTimer/1000
        });
    };



    $scope.changePage = function(page){
        $scope.page = 1;
        $scope.x = $scope.length % $scope.pageList;
        $scope.count = ($scope.length - $scope.x) / $scope.pageList;

        if($scope.x > 0){
            $scope.allPage1 = $scope.count + 1;
        }else{
            $scope.allPage1 = $scope.count
        }
        //alert(page);
    };
    $scope.upcharge_list = function(){
        if($scope.pagecharge_list >1){
            $scope.pagecharge_list--;
            selectPagecharge_list();
        }
    };
    $scope.nextcharge_list = function(){
        if($scope.pagecharge_list < $scope.allPage){
            $scope.pagecharge_list++;
            selectPagecharge_list();
        }
    };
    $scope.cancel = function(){
        $scope.showDatePicker = false;
    };

    $("#jqueryPicker").datetimepicker();

    $("#jqueryPicker1").datetimepicker();






    //$("#bootstrap-table").tableExport({
    //    separator: ",",
    //    buttonContent: "",
    //    defaultClass: "btn",
    //    defaultTheme: "btn-default",
    //    type: "xlsx",
    //    fileName: "export",
    //    position: "top",
    //    stripQuotes: true
    //});

    $scope.output = "等待服务端数据";





    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

        // 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户 18606022554
        // 要处理。 ustr 是文本字符串的错误说明
        // 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。

        // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
        // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
        // 工具箱那里按键"send input" 这个：
        // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}
        if(jo.obj == "person" && jo.act == "charge_list"){
            $scope.charge_info = jo.charge_list;
            $scope.allPage = jo.total_page;
            console.log($scope.charge_info);
        }
        if(jo.obj == "person" && jo.act == "search"){
            $scope.base_info = jo.base_info;
            $scope.base_info.value_backpacks = (jo.base_info.value_backpacks).toFixed(2);
            $scope.person_id = $scope.base_info.person_id;

            $scope.login_info = jo.login_info;
            $scope.piece_info = jo.piece_info;  //

            $scope.length = $scope.piece_info.length;
            $scope.x = $scope.length % $scope.pageList;
            $scope.count = ($scope.length - $scope.x) / $scope.pageList;

            if($scope.x > 0){
                $scope.allPage1 = $scope.count + 1;
            }else{
                $scope.allPage1 = $scope.count
            }

            $scope.item_info = jo.item_info;   //
            $scope.charge_info = jo.charge_info;  //
            if(!toolbar){
                $("#bootstrap-table").tableExport({
                    separator: ",",
                    buttonContent: "",
                    defaultClass: "btn",
                    defaultTheme: "btn-default",
                    type: "csv",
                    fileName: "export",
                    position: "top",
                    stripQuotes: true
                });
                $("#bootstrap-table1").tableExport({
                    separator: ",",
                    buttonContent: "",
                    defaultClass: "btn",
                    defaultTheme: "btn-default",
                    type: "csv",
                    fileName: "export",
                    position: "top",
                    stripQuotes: true
                });
                $("#bootstrap-table2").tableExport({
                    separator: ",",
                    buttonContent: "",
                    defaultClass: "btn",
                    defaultTheme: "btn-default",
                    type: "csv",
                    fileName: "export",
                    position: "top",
                    stripQuotes: true
                });
                toolbar = true;
            }

        }
        if (jo.obj == "test" && jo.act == "output1") {
            // 服务端的数据来了，呈现
            $scope.output = jo.data;
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
        }
    });
});

