// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i052', function ($scope,$filter) {

    $scope.pushRecord = {"pageSizeSelect":10,"pageNum":1,"pageSize":10,"searchPlat":'接收平台',"searchPlatValue":'',"provinceCity":'',"pushType":'推送类型',"pushTypeValue":'',"day_num":-1,"start_end":[],"startTime":'',"endTime":''};
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
            $scope.pushRecord.day_num = 0;
        }else if(time == '昨日'){
            var temp = new Date(date.getTime()-24*60*60*1000);
            timeShow = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            $scope.pushRecord.day_num = 1;
        }else if(time == '近7日'){
            var temp = new Date(date.getTime()-7*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.pushRecord.day_num = 7;
        }else if(time == '近30日'){
            var temp = new Date(date.getTime()-30*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.pushRecord.day_num = 30;
        }else if(time == '全部'){
            timeShow = "";
            $scope.pushRecord.day_num = -1;
        }
        $(".layer_datatimeVal span:nth-child(1)").html(time);
        $(".layer_datatimeVal span:nth-child(2)").html(timeShow);
        $scope.pushRecord.start_end = [];
        $scope.pushRecord.pageNum = 1;
        $scope.iconState();
        $scope.flush();
    }

    $scope.selectQueryDate = function(){
        $(".layer_datatimeVal span:nth-child(1)").html("自定义");
        var startTime = document.getElementById("start_time_id").value;
        var endTime = document.getElementById("end_time_id").value;
        $(".layer_datatimeVal span:nth-child(2)").html(startTime+"-"+endTime);
        if(startTime!="" && endTime!=""){
            var dgt_startTime = new Date(startTime+' 00:00:00').valueOf()/1000;
            var dgt_endTime = new Date(endTime+' 23:59:59').valueOf()/1000;
            $scope.pushRecord.start_end=[dgt_startTime,dgt_endTime];
        }else{
            alert("请输入自定义的开始时间和结束时间");
            return;
        }
        $scope.pushRecord.pageNum = 1;
        $scope.iconState();
        $scope.flush();
    }

    //选择分页，每页记录数
    $scope.showList = function() {
        $('#pageSizeSelect').slideToggle(200);
        $('#pageSizeSelect').children().click(function () {
            $scope.pushRecord.pageSizeSelect = $(this).html();
            $scope.pushRecord.pageSize = $scope.pushRecord.pageSizeSelect;
            $scope.pushRecord.pageNum = 1;
            $scope.flush();
        });
    }

    //选择查询类型
    $scope.showList01 = function(){
        $('#type_list_ku').slideToggle(200);
        $('#type_list_ku').children().click(function(){
            $scope.pushRecord.searchPlat=$(this).html();
            if($scope.pushRecord.searchPlat=="ALL"){
                $scope.pushRecord.searchPlatValue="";
            }else{
                $scope.pushRecord.searchPlatValue=$(this).html();
            }
            $scope.pushRecord.pageNum = 1;
            $scope.flush();
        });
    };
    $scope.showList02 = function(){
        $('#push_type_list').slideToggle(200);
        $('#push_type_list').children().click(function(){
            $scope.pushRecord.pushType=$(this).html();
            if($scope.pushRecord.pushType=="全部"){
                $scope.pushRecord.pushTypeValue="";
            }else if($scope.pushRecord.pushType=="文章推送"){
                $scope.pushRecord.pushTypeValue="essay";
            }else if($scope.pushRecord.pushType=="短消息推送"){
                $scope.pushRecord.pushTypeValue="short";
            }
            $scope.pushRecord.pageNum = 1;
            $scope.flush();
        });
    };

    //地图数据
    var cityPicker = new HzwCityPicker({
        data: window.mapData,
        target: 'cityChoice',
        valType: 'k-v',
        hideCityInput: {
            name: 'city',
            id: 'city'
        },
        hideProvinceInput: {
            name: 'province',
            id: 'province'
        },
        callback: function () {
            var province = $("#province").val();
            var x = province.indexOf('-');
            province = province.substr(x + 1, province.length - x);
            var city = $("#city").val();
            var y = city.indexOf('-');
            city = city.substr(y + 1, city.length - y);
            $scope.pushRecord.provinceCity = province + city;
            $scope.pushRecord.pageNum = 1;
            $scope.flush();
        }
    });
    cityPicker.init();

    //上一页
    $scope.pushRecord_prev = function(){
        if($scope.pushRecord.pageNum>1){
            $scope.pushRecord.pageNum--;
            $scope.flush();
        }
    }
    //下一页
    $scope.pushRecord_next = function(){
        if($scope.pushRecord.pageNum<$scope.data.total_page){
            $scope.pushRecord.pageNum++;
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
        var records = $scope.pushRecord.pageSize*$scope.data.total_page;
        apiconn.send_obj({
            "obj": "manage",
            "act": "msgPush_list_get",
            "to_login_name": TOOLBOX_ACCOUNT,
            "admin_id":localStorage.getItem("userid"),
            "condition":{
                "day_num":$scope.pushRecord.day_num,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":$scope.pushRecord.start_end, //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
                "receive_platform":$scope.pushRecord.searchPlatValue,
                "receive_area":$scope.pushRecord.provinceCity,
                "push_type":$scope.pushRecord.pushTypeValue
            },
            "page_num":0,
            "page_size":records
        });
    };

    //消息推送模块：消息推送记录列表获取
    $scope.flush = function(){
        $scope.export_flag = false;
        apiconn.send_obj({
            "obj":"manage",
            "act":"msgPush_list_get",
            "admin_id":localStorage.getItem("userid"),
            "condition":{
                "day_num":$scope.pushRecord.day_num,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":$scope.pushRecord.start_end, //为[]或者字段没有则表示没有该检索条件，否则以start_end为准忽略day_num条件
                "receive_platform":$scope.pushRecord.searchPlatValue,
                "receive_area":$scope.pushRecord.provinceCity,
                "push_type":$scope.pushRecord.pushTypeValue
            },
            "page_num":$scope.pushRecord.pageNum-1,
            "page_size":$scope.pushRecord.pageSize
        });
    }

    setTimeout(function () {
        $scope.flush();
    }, 0);

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {

        if (jo.obj == "manage" && jo.act == "msgPush_list_get") {
            if($scope.export_flag==true){//导出
                $scope.filename = "推送记录";
                var arr = [["发布日期","发布人员","接收平台","接收地区","推送类型","内容简介"]];
                angular.forEach(jo.result,function(x){
                    arr.push([$filter('date')(x.date*1000,'yyyy-MM-dd HH:mm'), x.name,x.receive_platform,x.receive_area,(x.push_type=="essay"?"文章":"短消息"),x.content]);
                });
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
    initDate('start_time_id');
    initDate('end_time_id');
    //时间控件
    function initDate(id){
        $.datetimepicker.setLocale('ch');//设置中文
        $('#'+id).datetimepicker({
            lang:"ch",           //语言选择中文
            format:"Y.m.d",      //格式化日期
            timepicker:false,    //关闭时间选项
            yearStart:2000,     //设置最小年份
            yearEnd:2050,        //设置最大年份
            onSelectDate:function(){}
        });
    }
});

