// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i012', function ($scope) {
    $scope.export_flag = false; //点击导出按钮标记：true导出，false查询
    $scope.navi = 0;
    //表格一
    $scope.data1 = {}
    $scope.table1fix = {
        "obj":"fiveRecord",
        "act":"list",
        "page_num":1,
        "page_size":10,
        "status":"all"
    }
    $scope.setTable1=function() {
        $scope.export_flag = false;
        var data = $.extend({},$scope.table1fix);
        data.page_num-=1;
        apiconn.send_obj(data);
    }

    //导出
    $scope.export_xlsx = function(){
        if($scope.data1.fiveRecord_list.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var data = $.extend({},$scope.table1fix);
        data.page_size = $scope.table1fix.page_size*$scope.data1.total_page;
        data.page_num = 0;
        apiconn.send_obj(data);
    };

    setTimeout(function () {
        $scope.setTable1();
    }, 0);

    $scope.left=function (ok) {
        if(ok){
            $scope.table1fix.page_num--;
            $scope.setTable1();
        }
    }
    $scope.right=function (ok) {
        if(ok){
            $scope.table1fix.page_num++;
            $scope.setTable1();
        }
    }
    $scope.page=function(ok){
    	if(ok){
    		 $scope.setTable1();
    	}
    	
    }

    //获取日期
    $scope.getdate = function (data1) {
        function zero(n) {
            return n >= 10 ? n : ('0' + n);
        }
        var data = new Date(data1?data1*1000:0);
        return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
    }

    $scope.huishou=function(fiveRecord,truck){
        var txt = '请输入操作密码'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.input, {
            onOk: function (v) {
                if (v) {
                    console.log(v);
                    var obj={
                        "obj":"circle",
                        "act":"recycle_five",
                        "check_password":v
                    }
                    console.log(fiveRecord)
                    if(fiveRecord||truck){
                        obj.fiveRecord_id=fiveRecord;
                        obj.truck_id=truck;
                    }else{
                        obj.recycle_all='yes';
                    }
                    apiconn.send_obj(obj);
                } else {
                    var txt = "请输入操作密码";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                }
            }
        });
    }


    $scope.output = "等待服务端数据";

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "fiveRecord" && jo.act == "list") {
            if($scope.export_flag==true){//导出
                $scope.filename = "5号碎片投放记录";
                var arr = [["修改时间","商圈方式","获取用户","商品名称","商品ID","商品价值","状态","操作管理员"]];
                angular.forEach(jo.fiveRecord_list,function(x){
                    arr.push([$scope.getdate(x.put_time), (x.put_way=='fund'?'基金投放':'经济系统回馈(自动投放)'),x.person_name, x.truck_name, x.truck_id, x.price,(x.status=='put'?'投放':'获取'), x.admin_name]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.data1 = jo;
            }
        }

        if (jo.obj == "circle" && jo.act == "recycle_five") {
            if(jo.status=='success'){
                window.wxc.xcConfirm('回收成功', window.wxc.xcConfirm.typeEnum.success);
                $scope.setTable1();
            }else {
                window.wxc.xcConfirm('回收失败', window.wxc.xcConfirm.typeEnum.error);
            }
        }

        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
        }
    });




});



