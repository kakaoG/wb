// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i121', function ($scope,$filter) {

    $scope.lossPool = {"pageSizeSelect":10,"pageNum":1,"pageSize":10,"searchType":'查询类型',"input":'',"day_num":-1,"start_end":[],"startTime":'',"endTime":'',"person_name":"", "person_id":""};
    $scope.data = {};
    $scope.export_flag = false; //点击导出按钮标记：true导出，false查询

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
            $scope.lossPool.day_num = 0;
        }else if(time == '昨日'){
            var temp = new Date(date.getTime()-24*60*60*1000);
            timeShow = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            $scope.lossPool.day_num = 1;
        }else if(time == '近7日'){
            var temp = new Date(date.getTime()-7*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.lossPool.day_num = 7;
        }else if(time == '近30日'){
            var temp = new Date(date.getTime()-30*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.lossPool.day_num = 30;
        }else if(time == '全部'){
            timeShow = "";
            $scope.lossPool.day_num = -1;
        }
        $(".layer_datatimeVal span:nth-child(1)").html(time);
        $(".layer_datatimeVal span:nth-child(2)").html(timeShow);
        $scope.lossPool.start_end = [];
        $scope.lossPool.pageNum = 1;
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
            $scope.lossPool.start_end=[dgt_startTime,dgt_endTime];
        }else{
            alert("请输入自定义的开始时间和结束时间");
            return;
        }
        $scope.lossPool.pageNum = 1;
        $scope.iconState();
        $scope.flush();
    }

    //选择分页，每页记录数
    $scope.showList = function() {
        $('#pageSizeSelect').slideToggle(200);
    }

    $scope.showList_child = function(num){
        $scope.lossPool.pageSizeSelect = num;
        $scope.lossPool.pageSize = $scope.lossPool.pageSizeSelect;
        $scope.lossPool.pageNum = 1;
        $scope.flush();
    }

    //选择查询类型
    $scope.showList01 = function(){
        $('#type_list_ku').slideToggle(200);
        $('#type_list_ku').children().click(function(){
            $scope.lossPool.searchType=$(this).html();
        });
    };

    $scope.goto_xwc = function(){
        goto_view("i120");
    }

    //查询
    $scope.lossPool_search_all = function(){
        $scope.lossPool = {"pageSizeSelect":10,"pageNum":1,"pageSize":10,"searchType":'查询类型',"input":'',"day_num":-1,"start_end":[],"startTime":'',"endTime":'',"person_name":"", "person_id":""};
        $scope.flush();
    }

    $scope.lossPool_search = function(){
        $scope.lossPool.pageNum = 1;
        $scope.lossPool.person_name ="";
        $scope.lossPool.person_id ="";
        var a = {"操作用户昵称":"person_name","操作用户ID":"person_id"};
        var key = a[$scope.lossPool.searchType];
        $scope.lossPool[key] = $scope.lossPool.input;
        $scope.flush();
    }

    //上一页
    $scope.lossPool_prev = function(){
        if($scope.lossPool.pageNum>1){
            $scope.lossPool.pageNum--;
            $scope.flush();
        }
    }
    //下一页
    $scope.lossPool_next = function(){
        if($scope.lossPool.pageNum<$scope.data.total_page){
            $scope.lossPool.pageNum++;
            $scope.flush();
        }
    }

    //导出
    $scope.export_xlsx = function(){
        if($scope.data.result.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var records = $scope.lossPool.pageSize*$scope.data.total_page;
        apiconn.send_obj({
            "obj": "poolRecord",
            "act": "detail",
            "to_login_name": TOOLBOX_ACCOUNT,
            "admin_id":localStorage.getItem("userid"),
            "pool_name":"pool_action",
            "event":"inject",
            "condition":{
                "day_num":$scope.lossPool.day_num,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":$scope.lossPool.start_end, //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
                "person_name":$scope.lossPool.person_name,
                "person_id":$scope.lossPool.person_id
            },
            "page_num":0,
            "page_size":records
        });
    };

    $scope.flush = function(){
        $scope.export_flag = false;
        apiconn.send_obj({
            "obj":"poolRecord",
            "act":"detail",
            "admin_id":localStorage.getItem("userid"),
            "pool_name":"pool_action",
            "event":"inject",
            "condition":{
                "day_num":$scope.lossPool.day_num,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":$scope.lossPool.start_end, //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
                "person_name":$scope.lossPool.person_name,
                "person_id":$scope.lossPool.person_id
            },
            "page_num":$scope.lossPool.pageNum-1,
            "page_size":$scope.lossPool.pageSize
        });
    }

    setTimeout(function () {
        $scope.flush();
    }, 0);

    //计算当前页合计
    $scope.get_money_change_total = function(){
        var total = 0;
        if($scope.data){
            angular.forEach($scope.data.result,function(a){
                total += parseFloat(a.money_change);
            });
        }
        return total;
    }

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "poolRecord" && jo.act == "detail") {
            if($scope.export_flag==true){//导出
                $scope.filename = "从盈亏池得到注入";
                var arr = [["日期","操作用户","金额变化"]];
                var total = 0;
                angular.forEach(jo.result,function(x){
                    arr.push([$filter('date')(x.ut*1000,'yyyy-MM-dd HH:mm'), x.person_name,x.money_change]);
                    total += parseFloat(x.money_change);
                });
                arr.push(["合计", "",total]);
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.data = jo;
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

