// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i042', function ($scope, $rootScope) {
    $scope.show = true;
    $scope.export_flag = false; //点击导出按钮标记：true导出，false查询
    $scope.datetimepicker = function () {
        $.datetimepicker.setLocale('ch');//设置中文
        $('#datetimepicker_lucky').datetimepicker({
            lang: "ch",           //语言选择中文
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //关闭时间选项
            yearStart: 2000,     //设置最小年份
            yearEnd: 2050,        //设置最大年份
            todayButton: true    //关闭选择今天按钮
        });
    };
$(function () {
    $('#datetimepicker_lucky').change(function () { 
        if(!$(this).val()){
            setTimeout(function () {
                $('#datetimepicker_lucky').val('');
            })
        }
    })
    //吴珂增加的，不要删掉,我是从这里跳转到i041 和i040.谢谢
    if(location.hash.match("moveto")){
        var href=location.hash.split("moveto")[1].split("=")[1];
        setTimeout(function () {
            goto_view(href);
        }, 200);
    }
})
    var userid = localStorage.getItem("userid");
    userid = "o14710750498523409366";
    setTimeout(function () {
        settable();
    }, 0);
    //表格1
    $scope.table1fix = {
        "obj": "truck",
        "act": "egg_search",
        "admin_id": userid,
        "condition": {},
        "page_num": 1,
        "page_size": 10
    }
    //表格2
    $scope.table2fix = {
        "obj": "truck",
        "act": "search",
        "egg_search":"true",
        "admin_id": userid,
        "condition": {},
        "page_num": 1,
        "page_size": 10
    }
    $scope.ceil = function (a) {
        console.log(a);
        return Math.ceil(a);
    }

    $scope.xiugai = function () {
        $scope.checkedArray=[];
        $scope.checkedArrayvalue=[];

        var data=$.extend({},$scope.table2fix);
        data.condition.price_range=[$scope.price_range[0]-0, $scope.price_range[1]-0];
        data.page_num=0;
        apiconn.send_obj(data);
        $('.i042 .change_lucky').show()
    }
    $scope.hide = function () {
        $('.i042 .change_lucky').hide()
    }


    $scope.changecheck=function (index,id) {

        if($scope.checkedArray[index]){
            $scope.checkedArrayvalue.push(id);
        }else{
            $scope.checkedArrayvalue.splice($scope.checkedArrayvalue.indexOf(id),1);
        }
        console.log( $scope.checkedArray)
        console.log( $scope.checkedArrayvalue)
    }

    $scope.ischeck=function (id) {
        return ~checkedArray.indexOf(id);
    }


    $scope.left=function (istrue) {
        if(istrue){
            $scope.table1fix.page_num-=1;
        }
        search();
    }
    $scope.right=function (istrue) {
        if(istrue){
            $scope.table1fix.page_num+=1;
        }
        search();
    }
    $scope.left2=function (istrue) {
        if(istrue){
            $scope.table2fix.page_num-=1;
        }
        search2();
    }
    $scope.right2=function (istrue) {
        if(istrue){
            $scope.table2fix.page_num+=1;
        }
        search2();
    }

    $scope.delete=function (id) {
        var txt = "是否移除该商品"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                apiconn.send_obj({
                    "obj":"truck",
                    "act":"egg_delete",
                    "admin_id":userid,
                    "goods_id":id
                });
            }
        })
    }

    $scope.save = function () {
        if(!$scope.egg_exp1){
            alert('请输入幸运蛋经验上限');
            return false;
        }
        if($scope.price_range1[0]==''||$scope.price_range1[1]==''||$scope.price_range1[1]<$scope.price_range1[0]){

            var txt = "请设置正确价格区间";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }

        var txt = "是否确定保存商品信息"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                apiconn.send_obj({
                    "obj":"truck",
                    "act":"egg_edit",
                    "admin_id":userid,
                    "goods_ids":$scope.checkedArrayvalue,
                    "price_range":[$scope.price_range1[0]-0,$scope.price_range1[1]-0],
                    "egg_exp":$scope.egg_exp1
                });
            }
        })
    }
    $scope.fanqi = function () {
        var txt = "是否放弃保存商品信息"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.hide();
            }
        })
    }

    function settable() {
        apiconn.send_obj({
            "obj": "truck",
            "act": "egg_page_one",
            "admin_id": userid
        });
    }

    function search(data) {
        $scope.export_flag = false;
        var data = $.extend({}, $scope.table1fix);
        var time=$('#datetimepicker_lucky').val();
        data.page_num -= 1;
        var strtTime = new Date(time).getTime()/1000;
        var start_end = [strtTime, strtTime +  60 * 60 * 24];
        data.condition[data.key] = data.value;

        data.condition = {
            "day_num": data.condition.day_num
        }
        if (data.key) {
            data.condition[data.key] = data.value;
        }

        if (time) {
            data.condition.start_end = start_end;
        }
        apiconn.send_obj(data);
    }
//ss

    //导出
    $scope.export_xlsx = function(){
        if($scope.data.result.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var records = $scope.table1fix.page_size*$scope.data.total_page;

        var data = $.extend({}, $scope.table1fix);
        var time=$('#datetimepicker_lucky').val();
        data.page_num = 0;
        data.page_size = records;
        var strtTime = new Date(time).getTime()/1000;
        var start_end = [strtTime, strtTime +  60 * 60 * 24];
        data.condition[data.key] = data.value;
        data.condition = {
            "day_num": data.condition.day_num
        }
        if (data.key) {
            data.condition[data.key] = data.value;
        }

        if (time) {
            data.condition.start_end = start_end;
        }
        apiconn.send_obj(data);
    };


    function search2() {
        var data = $.extend({}, $scope.table2fix);
        data.page_num -= 1;
        data.egg_search="true";

        var strtTime = new Date(data.time).getTime();
        var start_end = [strtTime, strtTime + 1000 * 60 * 60 * 24];
        data.condition[data.key] = data.value;
        data.condition = {
            "day_num": data.condition.day_num,
            "price_range":[$scope.price_range1[0]-0, $scope.price_range1[1]-0]
        }
        if(data.a&&data.b){
            data.condition.price_range = $scope.price_range1;
        }
        if (data.key) {
            data.condition[data.key] = data.value;
        }
        if (data.time) {
            data.condition.start_end = start_end;
        }

        apiconn.send_obj(data);
    }

    function zero(n) {
        return n >= 10 ? n : ('0' + n);
    }



    $scope.searchtable1 = function () {
        search();
    }
    $scope.searchtable2 = function () {
        search2();
    }
    $scope.searchquanbu1 = function () {
        //表格1
        $scope.table1fix = {
            "obj": "truck",
            "act": "egg_search",
            "admin_id": userid,
            "condition": {},
            "page_num": 1,
            "page_size": 10
        }
        search();
    }
    $scope.searchquanbu2 = function () {

        //表格2
        $scope.table2fix = {
            "obj": "truck",
            "act": "search",
            "egg_search":"true",
            "admin_id": userid,
            "condition": {},
            "page_num": 1,
            "page_size": 10
        }
        search2();
    }

    //获取日期
    $scope.getdate = function (data1) {
        var data = new Date(data1?data1*1000:0);
        return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
    }
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {

        if (jo.obj == "truck" && jo.act == "egg_page_one") {
            $scope.egg_exp=jo.egg_exp
            $scope.egg_exp1=jo.egg_exp
            $scope.price_range=$.extend({},jo.price_range);
            $scope.price_range1=$.extend({},jo.price_range);
            $scope.value_action=jo.value_action;
            $scope.data = jo;
        }
        if (jo.obj == "truck" && jo.act == "egg_search") {
            if($scope.export_flag==true){//导出
                $scope.filename = "幸运蛋库";
                var arr = [["修改日期","商品名称","商品ID","商品价格","兑换商名称","兑换商ID"]];
                angular.forEach(jo.result,function(x){
                    arr.push([$scope.getdate(x.ut), x.goods_name,x.goods_id, x.price, x.merchant_name, x.merchant_id]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.data = jo;
            }
        }
        if (jo.obj == "truck" && jo.act == "egg_edit") {
            $scope.hide();
            settable();
        }
        if (jo.obj == "truck" && jo.act == "egg_delete") {

            settable();
        }
        if (jo.obj == "truck" && jo.act == "search") {
            $scope.data2 = jo;
            var data=jo;
            $scope.checkedArray=[];
            for(i in data.result){
                var item=data.result[i];
                if(~$scope.checkedArrayvalue.indexOf(item.goods_id)){
                    $scope.checkedArray[i]=true;
                }else{
                    $scope.checkedArray[i]=false;
                }
            }
        }
        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
        }
    });
});
