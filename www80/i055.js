// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i055', function ($scope,$filter) {

    $scope.pushRecord = {"pageSizeSelect":10,"pageNum":1,"pageSize":10};
    $scope.data = {};
    $scope.export_flag = false; //点击导出按钮标记：true导出，false查询


    //取消推送
    $scope.replace_or_cancel = function(id,way,tips) {
        if(window.confirm("是否"+tips+"?")){
            apiconn.send_obj({
                "obj": "manage",
                "act": "msgPush_replace_or_cancel",
                "admin_id":localStorage.getItem("userid"),
                "push_id":id,
                "run_way":way
            });
        }
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
        if($scope.data.now_push.length==0&&$scope.data.now_notice.length==0&&$scope.data.update_push.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var records = $scope.pushRecord.pageSize*$scope.data.total_page;
        apiconn.send_obj({
            "obj": "manage",
            "act": "msgPush_config_list_get",
            "admin_id":localStorage.getItem("userid"),
            "page_num":0,
            "page_size":records
        });
    };

    //活动推送配置模块：每日推送配置列表获取
    $scope.flush = function(){
        $scope.export_flag = false;
        apiconn.send_obj({
            "obj":"manage",
            "act":"msgPush_config_list_get",
            "admin_id":localStorage.getItem("userid"),
            "page_num":$scope.pushRecord.pageNum-1,
            "page_size":$scope.pushRecord.pageSize
        });
    }

    setTimeout(function () {
        $scope.flush();
    }, 0);

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {

        if (jo.obj == "manage" && jo.act == "msgPush_config_list_get") {
            if($scope.export_flag==true){//导出
                $scope.filename = "每日推送配置";
                var arr = [["发布日期","发布人员","接收平台","接收地区","内容简介"]];
                arr.push(["当前每日推送信息"]);
                angular.forEach(jo.now_push,function(x){
                    arr.push([$filter('date')(x.date*1000,'yyyy-MM-dd HH:mm'), x.name,x.receive_platform,x.receive_area,x.content]);
                });
                arr.push(["当前紧急推送信息"]);
                angular.forEach(jo.now_notice,function(x){
                    arr.push([$filter('date')(x.date*1000,'yyyy-MM-dd HH:mm'), x.name,x.receive_platform,x.receive_area,x.content]);
                });
                arr.push(["修改推送信息"]);
                angular.forEach(jo.update_push,function(x){
                    arr.push([$filter('date')(x.date*1000,'yyyy-MM-dd HH:mm'), x.name,x.receive_platform,x.receive_area,x.content]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.data = jo;
            }
        }
        if (jo.obj == "manage" && jo.act == "msgPush_replace_or_cancel") {
            if(jo.status=="success"){
                alert("操作成功");
            }
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
        }
    });

});

