// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i070', function ($scope,$filter) {
    $scope.dataGet = {searchType:"查询类型",searchTypeValue:"all","key":"","pageSizeSelect":"10",pageNumber:1,pageSize:10,"day_num":-1,"start_end":[],"startTime":'177275555',"endTime":'',"export_flag":false};
    $scope.welfare_add = {};
    $scope.personGet = {"welfare_id":"",searchType:"查询类型",searchTypeValue:"all","key":"","pageSizeSelect":"10",pageNumber:1,pageSize:10,"day_num":-1,"start_end":[],"startTime":'177275555',"endTime":'',"export_flag":false};


    apiconn.send_obj({
        "obj": "welfare",
        "act": "statusGet",
        "admin_id": localStorage.getItem("userid")
    });

    //取消福利发放
    $scope.showPswd = function(){
        if(window.confirm("确认取消该次福利发放吗？")){
            $('#pswd_div').show();
        }
    }
    $scope.cancelNot = function(){
        $('#pswd_div').hide();
    }
    $scope.cancelYes = function(){
        $('#pswd_div').hide();
        apiconn.send_obj({
            "obj":"welfare",
            "act":"delete",
            "check_password":$scope.pswd,
            "admin_id": localStorage.getItem("userid")
        });
    }

    //新增福利发放项目
    $scope.addWelFare = function(){
        $('#change_suipian_remind').show();
    }
    $scope.changeSuipianNot = function(){
        $('#change_suipian_remind').hide();
    }
    $scope.changeSuipianYes = function(){
        $('#pswd_div1').show();
    }
    $scope.cancelNot1 = function(){
        $('#pswd_div1').hide();
    }
    $scope.cancelYes1 = function(){
        $('#change_suipian_remind').hide();
        $('#pswd_div1').hide();
        var startTime = document.getElementById("recycle_date_id").value;
        var time = new Date(startTime+' 00:00:00').valueOf()/1000;
        apiconn.send_obj({
            "obj":"welfare",
            "act":"add",
            "recycle_date":time,
            "send_money":$scope.welfare_add.send_money,
            "target_person_num":$scope.welfare_add.target_person_num,
            "check_password":$scope.welfare_add.check_password,
            "admin_id": localStorage.getItem("userid")
        });
    }

    //查看新用户福利发放记录
    $scope.showNewWelFare = function(){
        $('#firstShow').hide();
        $('#menu_ku_edit').show();
        var date = new Date();
        var now = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
        $scope.dataGet.pageNumber = 1;
        $scope.dataGet.searchTypeValue = "all";
        $scope.dataGet.startTime = "177275555";
        $scope.dataGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        $scope.dataGet.key = "";
        $scope.flush();
    }
    //返回
    $scope.returnMenuKu = function(){
        $('#firstShow').show();
        $('#menu_ku_edit').hide();
        apiconn.send_obj({
            "obj": "welfare",
            "act": "statusGet",
            "admin_id": localStorage.getItem("userid")
        });
    };
    $scope.showList = function(){
        $('#type_list_ku_edit').slideToggle(200);
        $('#type_list_ku_edit').children().click(function(){
            $scope.dataGet.searchType=$(this).html();
        });
    };
    //查询
    $scope.dataGetSearch=function(){
        $scope.dataGet.pageNumber = 1;
        var a = {"全部":"all","管理员名称":"admin"};
        var key = a[$scope.dataGet.searchType];
        $scope.dataGet.searchTypeValue = key;
        $scope.flush();
    }
    //选择分页，每页记录数
    $scope.showList1 = function() {
        $('#pageSizeSelect').slideToggle(200);
        $('#pageSizeSelect').children().click(function () {
            $scope.dataGet.pageSizeSelect = $(this).html();
            $scope.dataGet.pageSize = $scope.dataGet.pageSizeSelect;
            $scope.dataGet.pageNumber = 1;
            $scope.flush();
        });
    }

    //上一页
    $scope.dataGet_prev = function(){
        if($scope.dataGet.pageNumber>1){
            $scope.dataGet.pageNumber--;
            $scope.flush();
        }
    }
    //下一页
    $scope.dataGet_next = function(){
        if($scope.dataGet.pageNumber<$scope.dataGet_datas.total_page){
            $scope.dataGet.pageNumber++;
            $scope.flush();
        }
    }

    //导出
    $scope.export_xlsx = function(){
        if($scope.dataGet_datas.welfare_list.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.dataGet.export_flag = true;
        var records = $scope.dataGet.pageSize*$scope.dataGet_datas.total_page;
        apiconn.send_obj({
            "obj":"welfare",
            "act":"dataGet",
            "admin_id":localStorage.getItem("userid"),
            "begin_time":$scope.dataGet.startTime+"",
            "end_time":$scope.dataGet.endTime+"",
            "search_type":$scope.dataGet.searchTypeValue,
            "key":$scope.dataGet.key,
            "page_num":0,
            "page_size":records
        });
    };
    //选择日期
    //展开、隐藏
    $scope.iszhan = false;
    $scope.iconState = function() {
        var valdiv = $("#menu_ku_edit .layer_datatimeVal");
        var valdiv1 = $("#menu_ku_edit .layer_datatimeVal1");
        var icon = $("#menu_ku_edit .arrow_icon");
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
            $scope.dataGet.startTime = new Date(now+' 00:00:00').valueOf()/1000;
            $scope.dataGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '昨日'){
            var temp = new Date(date.getTime()-24*60*60*1000);
            timeShow = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            $scope.dataGet.startTime = new Date(timeShow+' 00:00:00').valueOf()/1000;
            $scope.dataGet.endTime = new Date(timeShow+' 23:59:59').valueOf()/1000;
        }else if(time == '近7日'){
            var temp = new Date(date.getTime()-7*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.dataGet.startTime = new Date(time1+' 00:00:00').valueOf()/1000;
            $scope.dataGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '近30日'){
            var temp = new Date(date.getTime()-30*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.dataGet.startTime = new Date(time1+' 00:00:00').valueOf()/1000;
            $scope.dataGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '全部'){
            timeShow = "";
            $scope.dataGet.startTime = "177275555";
            $scope.dataGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }
        $("#menu_ku_edit .layer_datatimeVal span:nth-child(1)").html(time);
        $("#menu_ku_edit .layer_datatimeVal span:nth-child(2)").html(timeShow);
        $scope.dataGet.start_end = [];
        $scope.dataGet.pageNumber = 1;
        $scope.iconState();
        $scope.flush();
    }

    $scope.selectQueryDate = function(){
        $("#menu_ku_edit .layer_datatimeVal span:nth-child(1)").html("自定义");
        var startTime = document.getElementById("start_time_id").value;
        var endTime = document.getElementById("end_time_id").value;
        $("#menu_ku_edit .layer_datatimeVal span:nth-child(2)").html(startTime+"-"+endTime);
        if(startTime!="" && endTime!=""){
            $scope.dataGet.startTime = new Date(startTime+' 00:00:00').valueOf()/1000;
            $scope.dataGet.endTime = new Date(endTime+' 23:59:59').valueOf()/1000;
        }else{
            alert("请输入自定义的开始时间和结束时间");
            return;
        }
        $scope.dataGet.pageNumber = 1;
        $scope.iconState();
        $scope.flush();
    }

    $scope.flush = function(){
        $scope.dataGet.export_flag = false;
        apiconn.send_obj({
            "obj":"welfare",
            "act":"dataGet",
            "admin_id":localStorage.getItem("userid"),
            "begin_time":$scope.dataGet.startTime+"",
            "end_time":$scope.dataGet.endTime+"",
            "search_type":$scope.dataGet.searchTypeValue,
            "key":$scope.dataGet.key,
            "page_num":$scope.dataGet.pageNumber-1,
            "page_size":$scope.dataGet.pageSize
        });
    }

    //查看获取用户
    $scope.show_personGet = function(welfare_id){
        $('#menu_ku_edit').hide();
        $('#menu_ku_edit1').show();
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(1)").html("全部");
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(2)").html("");
        var date = new Date();
        var now = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
        $scope.personGet.welfare_id = welfare_id;
        $scope.personGet.pageNumber = 1;
        $scope.personGet.searchTypeValue = "all";
        $scope.personGet.startTime = "177275555";
        $scope.personGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        $scope.personGet.key = "";
        $scope.personGet_flush();
    }
    $scope.returnDataGet = function(){
        $('#menu_ku_edit1').hide();
        $('#menu_ku_edit').show();
    }

    $scope.personGet_flush = function(){
        $scope.personGet.export_flag = false;
        apiconn.send_obj({
            "obj":"welfare",
            "act":"personGet",
            "admin_id":localStorage.getItem("userid"),
            "welfare_id":$scope.personGet.welfare_id,
            "begin_time":$scope.personGet.startTime+"",
            "end_time":$scope.personGet.endTime+"",
            "search_type":$scope.personGet.searchTypeValue,
            "key":$scope.personGet.key,
            "page_num":$scope.personGet.pageNumber-1,
            "page_size":$scope.personGet.pageSize
        });
    }

    $scope.showList2 = function(){
        $('#type_list_ku_edit1').slideToggle(200);
        $('#type_list_ku_edit1').children().click(function(){
            $scope.personGet.searchType=$(this).html();
        });
    };
    //查询
    $scope.personGetSearch=function(){
        $scope.personGet.pageNumber = 1;
        var a = {"全部":"all","用户昵称":"person_name","用户账号":"login_name"};
        var key = a[$scope.personGet.searchType];
        $scope.personGet.searchTypeValue = key;
        $scope.personGet_flush();
    }
    //选择分页，每页记录数
    $scope.showList3 = function() {
        $('#pageSizeSelect1').slideToggle(200);
        $('#pageSizeSelect1').children().click(function () {
            $scope.personGet.pageSizeSelect = $(this).html();
            $scope.personGet.pageSize = $scope.personGet.pageSizeSelect;
            $scope.personGet.pageNumber = 1;
            $scope.personGet_flush();
        });
    }

    //上一页
    $scope.personGet_prev = function(){
        if($scope.personGet.pageNumber>1){
            $scope.personGet.pageNumber--;
            $scope.personGet_flush();
        }
    }
    //下一页
    $scope.personGet_next = function(){
        if($scope.personGet.pageNumber<$scope.personGet_datas.total_page){
            $scope.personGet.pageNumber++;
            $scope.personGet_flush();
        }
    }

    //导出
    $scope.export_xlsx_personGet = function(){
        if($scope.personGet_datas.person_list.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.personGet.export_flag = true;
        var records = $scope.personGet.pageSize*$scope.personGet_datas.total_page;
        apiconn.send_obj({
            "obj":"welfare",
            "act":"personGet",
            "admin_id":localStorage.getItem("userid"),
            "welfare_id":$scope.personGet.welfare_id,
            "begin_time":$scope.personGet.startTime+"",
            "end_time":$scope.personGet.endTime+"",
            "search_type":$scope.personGet.searchTypeValue,
            "key":$scope.personGet.key,
            "page_num":0,
            "page_size":records
        });
    };
    //选择日期
    //展开、隐藏
    $scope.iszhan1 = false;
    $scope.iconState1 = function() {
        var valdiv = $("#menu_ku_edit1 .layer_datatimeVal");
        var valdiv1 = $("#menu_ku_edit1 .layer_datatimeVal1");
        var icon = $("#menu_ku_edit1 .arrow_icon");
        if ($scope.iszhan1) {
            icon.css("-webkit-transform","rotate(180deg)");
            icon.css("transform","rotate(180deg)");
            valdiv1.css("display","none");
            $scope.iszhan1 = false;
        } else {
            icon.css("-webkit-transform","rotate(-90deg)");
            icon.css("transform","rotate(-90deg)");
            valdiv1.css("display","block");
            $scope.iszhan1 = true;
        }
    }

    $scope.selectTimes1 = function(time){
        var date = new Date();
        var now = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
        var timeShow = "";
        if(time == '今日'){
            timeShow = now;
            $scope.personGet.startTime = new Date(now+' 00:00:00').valueOf()/1000;
            $scope.personGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '昨日'){
            var temp = new Date(date.getTime()-24*60*60*1000);
            timeShow = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            $scope.personGet.startTime = new Date(timeShow+' 00:00:00').valueOf()/1000;
            $scope.personGet.endTime = new Date(timeShow+' 23:59:59').valueOf()/1000;
        }else if(time == '近7日'){
            var temp = new Date(date.getTime()-7*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.personGet.startTime = new Date(time1+' 00:00:00').valueOf()/1000;
            $scope.personGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '近30日'){
            var temp = new Date(date.getTime()-30*24*60*60*1000);
            var time1 = temp.getFullYear()+"."+(temp.getMonth()+1)+"."+temp.getDate();
            timeShow = time1 + "-"+ now;
            $scope.personGet.startTime = new Date(time1+' 00:00:00').valueOf()/1000;
            $scope.personGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }else if(time == '全部'){
            timeShow = "";
            $scope.personGet.startTime = "177275555";
            $scope.personGet.endTime = new Date(now+' 23:59:59').valueOf()/1000;
        }
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(1)").html(time);
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(2)").html(timeShow);
        $scope.personGet.start_end = [];
        $scope.personGet.pageNumber = 1;
        $scope.iconState1();
        $scope.personGet_flush();
    }

    $scope.selectQueryDate1 = function(){
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(1)").html("自定义");
        var startTime = document.getElementById("start_time_id1").value;
        var endTime = document.getElementById("end_time_id1").value;
        $("#menu_ku_edit1 .layer_datatimeVal span:nth-child(2)").html(startTime+"-"+endTime);
        if(startTime!="" && endTime!=""){
            $scope.personGet.startTime = new Date(startTime+' 00:00:00').valueOf()/1000;
            $scope.personGet.endTime = new Date(endTime+' 23:59:59').valueOf()/1000;
        }else{
            alert("请输入自定义的开始时间和结束时间");
            return;
        }
        $scope.dataGet.pageNumber = 1;
        $scope.iconState1();
        $scope.personGet_flush();
    }


    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "welfare" && jo.act == "statusGet") {
            $scope.datas = jo;
        }
        if (jo.obj == "welfare" && jo.act == "dataGet") {
            if($scope.dataGet.export_flag==true){//导出
                $scope.filename = "新用户福利发放记录";
                var arr = [["发放日期","结束日期","回收日期","操作管理员名称","发放金额","回收金额","目标发放人数","已发放人数","状态"]];
                angular.forEach(jo.welfare_list,function(x){
                    arr.push([$filter('date')(x.send_date*1000,'yyyy-MM-dd HH:mm'), $filter('date')(x.end_time*1000,'yyyy-MM-dd HH:mm'),$filter('date')(x.recycle_date*1000,'yyyy-MM-dd HH:mm'),
                        x.admin_name,x.send_money,x.recycle_money,x.target_person_num,x.get_person_num,(x.status=="sending"?"发放中":"已结束")]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.dataGet_datas = jo;
            }
        }
        if (jo.obj == "welfare" && jo.act == "delete") {
            if(jo.status=="success"){
                alert(jo.msg);
                apiconn.send_obj({
                    "obj": "welfare",
                    "act": "statusGet",
                    "admin_id": localStorage.getItem("userid")
                });
            }
        }
        if (jo.obj == "welfare" && jo.act == "add") {
            if (jo.msg) {
                alert(jo.msg);//{status=>"failed",msg=>"请先取消上次的福利发放"}
                apiconn.send_obj({
                    "obj": "welfare",
                    "act": "statusGet",
                    "admin_id": localStorage.getItem("userid")
                });
            }
        }
        if (jo.obj == "welfare" && jo.act == "personGet") {
            if($scope.personGet.export_flag==true){//导出
                $scope.filename = "查看获取用户";
                var arr = [["获取日期","用户名称","用户账号","获取价值","新手剩余价值"]];
                angular.forEach(jo.person_list,function(x){
                    arr.push([$filter('date')(x.get_date*1000,'yyyy-MM-dd HH:mm'),x.person_name,x.login_name,x.get_value,x.left_money]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.personGet_datas = jo;
            }
        }
    });


    //初始化日期控件
    initDate('start_time_id');
    initDate('end_time_id');
    initDate('recycle_date_id');
    initDate('start_time_id1');
    initDate('end_time_id1');
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



