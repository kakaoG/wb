// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i200', function ($scope,$filter) {

    $scope.behaviorPool = {"pageSizeSelect":10,"pageNum":1,"pageSize":10,"day_num":-1,"start_end":[],"startTime":'',"endTime":''};
    $scope.data = {};
    $scope.event_types={"inject":"i121","egg":"i122","pack":"i123"};

    $scope.export_flag1 = false; //点击导出按钮标记：true导出，false查询
    $scope.export_flag2 = false; //点击导出按钮标记：true导出，false查询

    $scope.condition = {
        "day_num": -1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
        "start_end":[] //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
    }

    //选择日期
    //展开、隐藏
    $scope.iszhan = false;
    $scope.iconState = function() {
        var valdiv = $(".layer_datatimeVal");
        var valdiv1 = $(".layer_datatimeVal1");
        var icon = $(".arrow_icon");
        if ($scope.iszhan) {
            icon.css("-webkit-transform","rotate(180deg)");
            icon.css("transform","rotate(180deg)");
            valdiv1.css("display","none");
            $scope.iszhan = false;
        } else {
            icon.css("-webkit-transform","rotate(-90deg)");
            icon.css("transform","rotate(-90deg)");
            valdiv1.css("display","block");
            $scope.iszhan = true;
        }
    }

    $scope.selectTimes = function(time){
        var date = new Date();
        var now = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
        var timeShow = "";
        if(time == '今日'){
            timeShow = now;
            $scope.condition.day_num = 0;
        }else if(time == '昨日'){
            var temp = new Date(date.getTime()-24*60*60*1000);
            timeShow = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            $scope.condition.day_num = 1;
        }else if(time == '近7日'){
            var temp = new Date(date.getTime()-7*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.condition.day_num = 7;
        }else if(time == '近30日'){
            var temp = new Date(date.getTime()-30*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.condition.day_num = 30;
        }else if(time == '全部'){
            timeShow = "";
            $scope.condition.day_num = -1;
        }
        $(".layer_datatimeVal span:nth-child(1)").html(time);
        $(".layer_datatimeVal span:nth-child(2)").html(timeShow);
        $scope.behaviorPool.start_end = [];
        $scope.behaviorPool.pageNum = 1;
        $scope.iconState();
        $scope.flush();
    }


    $scope.selectQueryDate = function(){
        $(".layer_datatimeVal span:nth-child(1)").html("自定义");
        var startTime = document.getElementById("start_time").value;
        var endTime = document.getElementById("end_time").value;
        $(".layer_datatimeVal span:nth-child(2)").html(startTime+"-"+endTime);
        if(startTime!="" && endTime!=""){
            var dgt_startTime = new Date(startTime+' 00:00:00').valueOf()/1000;
            var dgt_endTime = new Date(endTime+' 23:59:59').valueOf()/1000;
            $scope.condition.start_end=$scope.behaviorPool.start_end=[dgt_startTime,dgt_endTime];
        }else{
            alert("请输入自定义的开始时间和结束时间");
            return;
        }
        $scope.behaviorPool.pageNum = 1;
        $scope.iconState();
        $scope.flush();
    }

    //选择分页，每页记录数
    $scope.showList = function() {
        $('#pageSizeSelect').slideToggle(200);
    }

    $scope.showList_child = function(num){
        $scope.behaviorPool.pageSizeSelect = num;
        $scope.behaviorPool.pageSize = $scope.behaviorPool.pageSizeSelect;
        $scope.behaviorPool.pageNum = 1;
        $scope.flush();
    }

    //上一页
    $scope.behaviorPool_prev = function(){
        if($scope.behaviorPool.pageNum>1){
            $scope.behaviorPool.pageNum--;
            $scope.flush();
        }
    }
    //下一页
    $scope.behaviorPool_next = function(){
        if($scope.behaviorPool.pageNum<$scope.data.total_page){
            $scope.behaviorPool.pageNum++;
            $scope.flush();
        }
    }

    $scope.flush = function(){
        $scope.export_flag1 = false;
        apiconn.send_obj({
            "obj":"manage",
            "act":"purseRecord_list_get",
            "admin_id":localStorage.getItem("userid"),
            "condition":$scope.condition,
            "page_num":$scope.behaviorPool.pageNum-1,
            "page_size":$scope.behaviorPool.pageSize
        });
    };

    setTimeout(function () {
        $scope.flush();
    }, 0);

    $scope.selVar = '';
    $scope.rangeFlag = false;
    $scope.getSel = function (x) {
        $scope.inpVal = '';
        $scope.goods_price1 = '';
        $scope.goods_price2 = '';
        if(x == 'price_range'){
            $scope.rangeFlag = true;
        }else {
            $scope.rangeFlag = false;
        }
        $scope.selVar = x;
    };
    $scope.inpVal = '';
    $scope.getInp = function (x) {
        $scope.inpVal = x;
    };
    $scope.searchtable1 = function () {
        if($scope.selVar != ''&& ($scope.inpVal != ''||$scope.goods_price1 !=''||$scope.goods_price2 !='')){
            if($scope.inpVal){
                $scope.condition[$scope.selVar] = $scope.inpVal;
            }else {
                $scope.condition.start_price = parseInt($scope.goods_price1);
                $scope.condition.end_price = parseInt($scope.goods_price2);
            }
        }else {
            $scope.condition = {
                "day_num":$scope.behaviorPool.day_num,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":$scope.behaviorPool.start_end //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
            };
        }
        $scope.flush();
    }

    /*====================钱包投放记录start=========================*/
    $scope.selVar2 = '';
    $scope.getSel2 = function (x) {
        $scope.selVar2 = x;
    };
    $scope.inpVal2 = '';
    $scope.getInp2 = function (x) {
        $scope.inpVal2 = x;
    };
    $scope.condition2 = {};
    $scope.truck_id = '';
    $scope.behaviorPool2 = {"pageSizeSelect":10,"pageNum":1,"pageSize":10};
    $scope.selFlag = false;

    $scope.flush2 = function (truck_id) {
        $scope.export_flag2 = false;
        apiconn.send_obj({
            "obj":"manage",
            "act":"purseRecord_oneGoods_list_get",
            "admin_id":localStorage.getItem("userid"),
            "goods_id": truck_id,
            "condition":$scope.condition2,
            "page_num": $scope.behaviorPool2.pageNum-1,
            "page_size":$scope.behaviorPool2.pageSize
        });
    }

    $scope.showDetail = function(truck_id){
        $scope.truck_id = truck_id;
        $scope.flush2(truck_id);
        $(".modal").modal('show');
    };
    $scope.closeDialog = function () {
        $scope.selFlag = true;
        $scope.inpVal2 = '';
        $scope.condition2 = {};
        $(".modal").modal('hide');
    };

    $scope.searchtable2 = function () {
        if($scope.selVar2 != ''&& $scope.inpVal2 != ''){
            $scope.condition2[$scope.selVar2] = $scope.inpVal2;
        }else {
            $scope.condition2 = {};
        }
        $scope.flush2($scope.truck_id);
    }

    $scope.export_xlsx2 = function () {
        if($scope.data.result.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag2 = true;
        apiconn.send_obj({
            "obj":"manage",
            "act":"purseRecord_oneGoods_list_get",
            "admin_id":localStorage.getItem("userid"),
            "goods_id": $scope.truck_id,
            "condition":{},
            "page_num": 0,
            "page_size":$scope.behaviorPool2.pageSize*$scope.dataDetail.total_page
        });
    };

    //上一页
    $scope.behaviorPool_prev2 = function(){
        if($scope.behaviorPool2.pageNum>1){
            $scope.behaviorPool2.pageNum--;
            $scope.flush2($scope.truck_id);
        }
    }
    //下一页
    $scope.behaviorPool_next2 = function(){
        if($scope.behaviorPool2.pageNum<$scope.dataDetail.total_page){
            $scope.behaviorPool2.pageNum++;
            $scope.flush2($scope.truck_id);
        }
    };
    /*==================钱包记录end========================*/
    function zero(n) {
        return n >= 10 ? n : ('0' + n);
    }
    $scope.getdate = function (data1) {
        var data = new Date(data1?data1*1000:0);
        return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
    }

    $scope.export_xlsx = function () {
        if($scope.data.result.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag1 = true;
        apiconn.send_obj({
            "obj":"manage",
            "act":"purseRecord_list_get",
            "admin_id":localStorage.getItem("userid"),
            "condition":{},
            "page_num":0,
            "page_size":$scope.data.page_size*$scope.data.total_page
        });
    }

    var str = {
        "post": "邮寄",
        "store": "实体店",
        "ticket": "团购券"
    }

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "manage" && jo.act == "purseRecord_list_get") {
            if($scope.export_flag1){
                $scope.exportData1 = jo;
                $scope.filename = "钱包投放管理";

                var arrT = $("#table1 tr").eq(0).find("th");
                var arr = [[]];
                for(var ii=0; ii<arrT.length; ii++ ){
                    arr[0].push($(arrT[ii]).text())
                }
                angular.forEach($scope.exportData1.result,function(x){
                    arr.push([$scope.getdate(x.date), x.truck_name,x.truck_id, x.price, x.init_price, x.merchant_name, x.introduce, x.exchge_way, x.num, x.purse_value]);
                });
                export2xlsx(arr,$scope.filename);
            }else {
                angular.forEach(jo.result, function (item) {
                    item.exchge_way = str[item.exchge_way];
                });
                $scope.data = jo;
            }
        }else if(jo.obj == "manage" && jo.act == "purseRecord_oneGoods_list_get") {
            if($scope.export_flag2){
                $scope.exportData2 = jo;
                $scope.filename = "钱包投放记录";

                var arrT = $("#table2 tr").eq(0).find("th");
                var arr = [[]];
                for(var ii=0; ii<arrT.length; ii++ ){
                    arr[0].push($(arrT[ii]).text())
                }
                angular.forEach($scope.exportData2.result,function(x){
                    arr.push([$scope.getdate(x.date), x.display_name,x.person_account, x.person_id, x.status]);
                });
                export2xlsx(arr,$scope.filename);
            }else {
                $scope.dataDetail = jo;
            }
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
        }
    });

    //初始化日期控件
    initDate('start_time');
    initDate('end_time');
    //时间控件
    function initDate(id){
        $.datetimepicker.setLocale('ch');//设置中文
        $('#'+id).datetimepicker({
            lang:"ch",           //语言选择中文
            format:"Y-m-d",      //格式化日期
            timepicker:false,    //关闭时间选项
            yearStart:2000,     //设置最小年份
            yearEnd:2050,        //设置最大年份
            onSelectDate:function(){
                //$scope.search();
            }
        });
    }
});

