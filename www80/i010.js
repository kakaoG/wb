// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i010', function ($scope,$filter) {
    $scope.export_flag = false;
    $scope.export_flag_fund = false;
    var map2;
    $scope.navi = 0;
    $scope.drwname = '绘制商圈';
    //数据
    var dx = 119.314436, dy = 26.057599, dwidth = 0.03, dheight = 0.03;
    var per = 13;//地图放大级别
    $scope.selecttable1i;
    $scope.username = localStorage.getItem("name");
    var shangquan = [];
    var shangquanMap = [];
    //初始化表格1
    $scope.table1fix = {
        "obj": "circle",
        "act": "list",
        "page_num": 1,
        "page_size": 10
    }


    //初始化表格3
    $scope.table3fix = {
        "obj": "circle",
        "act": "fund_list",
        "page_num": 1,
        "page_size": 10
    }
    //初始化表格8
    $scope.table7fix = {
        "obj": "circle",
        "act": "truck_list",
        "page_num": 1,
        "page_size": 10
    }
    setTimeout(function () {
        $("#jqxWidget").jqxDateTimeInput(
            {
                allowKeyboardDelete: false,
                readonly: true,
                width:198,
                height:28,
                showTimeButton: true,
                formatString: "yyyy-MM-dd HH:mm",
                culture: 'ch-CN',
                showFooter: true,
                todayString: '今天'
            })
    })
    $scope.slectTime=function () {
        $scope.popshow=false;
        time = new Date($('#jqxWidget').jqxDateTimeInput('getText')).getTime()/1000;
        txt='请输入密码';
        console.log($scope.latitude,$scope.longitude);
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.input, {

                        onOk: function (v) {
                            if (v) {
                                psw = v;
                                apiconn.send_obj({
                                    "obj": "circle",
                                    "act": "put_five",
                                    "circle_id": $scope.circle_id,
                                    "truck_id": $scope.toufangid,
                                    "latitude": $scope.latitude,
                                    "longitude": $scope.longitude,
                                    "put_time": new Date(time).getTime(),
                                    "check_password": psw-0
                                });
                            } else {
                                var txt = "请输入操作密码";
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                            }
                        }
                    });

    }
    $scope.starttoufan5 = function (id) {
         $scope.popshow=true;
         $scope.toufangid=id;
    }
    $scope.ceil = function (a) {
        return Math.ceil(a);
    }
    setTimeout(function () {
        $scope.searchtable1();
        // $scope.searchtable3();
    }, 0);

    $scope.hidesq = function (state, index, id) {
        console.log(state, index, id);
        var data = [state, index, id];
        var txt = "是否确认" + (state == 'run' ? '隐藏商圈' : '解除隐藏') + "?"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.pdata = data;
                    $scope.passtate = '隐藏商圈';
                    $scope.navi = 5;
                });
            }
        });
        return false;
    }
    $scope.deletesq = function (index, id) {
        var txt = "是否确认解除商圈,解除后所有配置信息将同步删除"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.pdata = id;
                    $scope.passtate = '解除商圈';
                    $scope.navi = 5;
                });
            }
        })
        return false;
    }

    $scope.toufan = function (i) {
        $scope.selecttable1i = i;
        var data = $scope.table1[$scope.selecttable1i];

        var data1 = shangquan[$scope.selecttable1i];
        $scope.table4 = {
            "circle_id": data1.id,
            "obj": "circle",
            "act": "update",
            "top_left": $scope.circle_list1[$scope.selecttable1i].top_left,
            "low_right": $scope.circle_list1[$scope.selecttable1i].low_right,
            "name": data.name,
            "area": data1.width * 220 * data1.height * 1111,
            "density": data.numb,
            "pre": data.pre
        }
        console.log($scope.table4);
        $scope.navi = 3;
    }

    //导出
    $scope.export_xlsx = function(){
        if($scope.table1.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag = true;
        var data = $.extend({}, $scope.table1fix);
        data.page_size = $scope.table1fix.page_size*$scope.total_page1;
        data.page_num = 0;
        apiconn.send_obj(data);
    };

    //导出
    $scope.export_xlsx_fund = function(){
        if($scope.table3.length==0){
            alert("请先查询想要导出的数据");
            return;
        }
        $scope.export_flag_fund = true;
        var data = $.extend({}, $scope.table3fix);
        data.page_size = $scope.table3fix.page_size*$scope.total_page2;
        data.page_num = 0;
        apiconn.send_obj(data);
    };

    $scope.searchtable1 = function () {
        $scope.export_flag = false;
        var data = $.extend({}, $scope.table1fix);
        data.page_num -= 1;
        apiconn.send_obj(data);
    }
    $scope.searchtable2 = function () {
        apiconn.send_obj({
            "obj": "pet",
            "act": "goods_list"
        });
    }
    $scope.searchtable3 = function () {
        $scope.export_flag_fund = false;
        if(!map2){
            setTimeout(function () {
                initmap2();
            },0)
        }
        setTimeout(function () {
            var data = $.extend({}, $scope.table3fix);
            console.log(data);
            data.page_num -= 1;
            apiconn.send_obj(data);
        },0)


    }
    $scope.searchtable7 = function (id, latitude, longitude) {
        var data = $.extend({}, $scope.table7fix);
        data.page_num -= 1;
        if(id){
            $scope.circle_id = id; 
        }
        data.circle_id=$scope.circle_id;
        if(latitude){
            $scope.latitude = latitude;
            $scope.longitude = longitude;
        }else{
            alert('.');
        }
        console.log(id, latitude, longitude)
        apiconn.send_obj(data);
    }

    $scope.table1left = function (is) {
        if (is) {
            $scope.table1fix.page_num -= 1;
            $scope.searchtable1();
        }
    }
    $scope.table1right = function (is) {
        if (is) {
            $scope.table1fix.page_num += 1;
            $scope.searchtable1();
        }
    }

    $scope.table3left = function (is) {
        if (is) {
            $scope.table3fix.page_num -= 1;
            $scope.searchtable3();
        }
    }
    $scope.table3right = function (is) {
        if (is) {
            $scope.table3fix.page_num += 1;
            $scope.searchtable3();
        }
    }
    $scope.table7left = function (is) {
        if (is) {
            $scope.table7fix.page_num -= 1;
            $scope.searchtable7();
        }
    }
    $scope.table7right = function (is) {
        if (is) {
            $scope.table7fix.page_num += 1;
            $scope.searchtable7();
        }
    }
    $scope.peizhi3 = function () {
        var iserror = false;
        var percent = 0;
        if (!$scope.table4.name || !$scope.table4.density) {
            iserror = true;
        }
        for (var i = 0; i < $scope.table4.pre.length; i++) {
            var item = $scope.table4.pre[i];
            if (!item.percent) {
                iserror = true;
                break;
            } else {
                percent += (item.percent - 0);
            }
        }
        if (iserror) {
            var txt = "请完善配置信息";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if($scope.table4.top_left.latitude>90||$scope.table4.low_right.latitude>90){
            var txt = "纬度不能大于90";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if($scope.table4.top_left.latitude<=$scope.table4.low_right.latitude){
            var txt = "纬度区间必须从小到大";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if($scope.table4.top_left.longitude>=$scope.table4.low_right.longitude){
            var txt = "经度区间必须从小到大";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if (percent != 100) {
            var txt = "商品库配比总和不为100%";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        var txt = '是否确定该配置投放'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                 if($scope.table4.act){
                     var txt = '请输入操作密码'
                     window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.input, {
                         onOk: function (v) {
                             if (v) {
                                 $scope.table4.check_password=v;
                                 sptf();
                             } else {
                                 var txt = "请输入操作密码";
                                 window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                             }
                         }
                     });
                 }else{
                     sptf();
                 }


                $scope.$apply(function () {
                    navi = 0;
                })
            }
        })
    }
    $scope.showmap=function (i,$event) {
        var target=$event.target;
       if(target.nodeName=='A'){
           return false;
       }
        var sq=shangquanMap[i];

        $('.bel,.del').remove();
        var $bel = $('<span class="bel">编辑<br/>投放</span>');
        var $del = $('<span class="del">解除<br/>商圈</span>');
        $bel.on('click', function () {
            $scope.$apply(function () {
                $scope.toufan(index);
            });
        });
        $del.on('click', function () {
            $scope.pdata = shangquan[index].id;
            $scope.deletesq(index, $scope.pdata);
        });


        $(sq.marker.Zc).after($bel);
        $(sq.marker.Zc).after($del);

        //生成编辑

        lastPolygon = sq;

        map.panTo(new BMap.Point(sq.ia[0].lng,sq.ia[0].lat));
    }
    var shangquanMap2=[];
    $scope.showmap2=function (i,$event) {
        var target=$event.target;
       if(target.nodeName=='A'){
           return false;
       }
        var sq=shangquanMap2[i];
        console.log(sq);
        var polygon=shangquanMap2[i];


        $(polygon.V).css('cursor', 'pointer')

        // var $bel = $('<span class="sel">投放<br/>碎片</span>');
        // $bel.on('mousedown', function (e) {
        //     if (e.button == 0) {
        //         // var txt=  "是否投放改碎片";
        //         // window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{
        //         //     onOk:function(v) {
        //         //
        //         //         return false;
        //         //     }
        //         // });
        //         if ($(this))
        //             $(this).addClass('zuobia');
        //     }
        //     $bel.remove();
        //     $del.remove();
        // });
        var point = sq.point;
        $('.BMapLabel').remove();
        var label1 = new BMap.Label('投放<br/>碎片', {offset: new BMap.Size(-40, 0), position: point});
        var label2 = new BMap.Label('取消<br/>投放', {offset: new BMap.Size(0, 0), position: point});
        map2.addOverlay(label1);
        map2.addOverlay(label2);
        label1.setStyle({
            width: "40px",
            height: "40px",
            verticalAlign: " middle",
            fontSize: "12px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #9BC4F7",
            borderRadius: "1000px",
            paddingTop: "3px"
        });
        label2.setStyle({
            width: "40px",
            height: "40px",
            verticalAlign: " middle",
            fontSize: "12px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #9BC4F7",
            borderRadius: "1000px",
            paddingTop: "3px"
        });


        label2.addEventListener('click', function () {
            map2.removeOverlay(label1);
            map2.removeOverlay(label2);
        });
        label1.addEventListener('click', function () {
            $(polygon.V).css('cursor', 'help')
            map2.removeOverlay(label1);
            map2.removeOverlay(label2);
            tou = true;
        });
        if (tou&&e.domEvent.button==2) {
            var txt = "是否投放该碎片";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
                onOk: function (v) {
                    map2.removeOverlay(label1);
                    map2.removeOverlay(label2);
                    tou = false;
                    $scope.navi = 6;
                    console.log(circle_id,e.point.lat,e.point.lng)
                    $scope.searchtable7(circle_id,e.point.lat,e.point.lng)
                },
                onCancel: function () {
                    map2.removeOverlay(label1);
                    map2.removeOverlay(label2);
                    tou = false;
                }
            });
        }



        //生成编辑

        lastPolygon = sq;

        map2.panTo(new BMap.Point(sq.ia[0].lng,sq.ia[0].lat));
    }
    $scope.peizhi1 = function () {
        var iserror = false;
        var percent = 0;
        var DGT_list = {};
        for (var i = 0; i < $scope.shangku2.length; i++) {
            var item = $scope.shangku2[i];
            if (!item.percent) {
                iserror = true;
                break;
            } else {
                DGT_list[item.DGT_id] = item.percent;
                percent += (item.percent - 0);
                console.log(percent)
            }
        }
        if (iserror) {
            var txt = "请完善配置信息";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if (percent != 100) {
            var txt = "商品库配比总和不为100%";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        var txt = '是否确定该配置投放'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                apiconn.send_obj({
                    "obj": "pet",
                    "act": "goods_update",
                    "DGT_list": DGT_list
                });
            }
        })
    }
    $scope.nai5ok = function () {

            if ($scope.passtate == '解除商圈') {
                apiconn.send_obj({
                    "obj": "circle",
                    "act": "delete",
                    "circle_id": $scope.pdata,
                    "check_password":$scope.password
                });

            }
            if ($scope.passtate == '隐藏商圈') {
                var state = $scope.pdata[0]
                    , index = $scope.pdata[1]
                    , id = $scope.pdata[2], txt;

                console.log($scope.pdata);
                if (state == 'hide') {
                    state = 'run'
                } else {
                    state = 'hide'
                }
                apiconn.send_obj({
                    "obj": "circle",
                    "act": "switch",
                    "circle_id": id,
                    "status": state,
                    "check_password":$scope.password
                });
                if (state == 'run') {
                    txt = "解除商圈成功";
                } else {
                    txt = "隐藏商圈成功";
                }

                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
            }

    }
    $scope.n4peizhi = function () {
        if ($scope.h4navi == 3) {
            $scope.table4.pre = [];
        }else{
            $scope.shangku2 = [];
        }

            var j=0;

            for (var i = 0; i < $scope.table5.length; i++) {
                var item = $scope.table5[i];
                if (item.select) {
                    if (!$scope.ispeizhi1) {
                        $scope.table4.pre[j] = {
                            DGT_id: $scope.table5[i].DGT_id,
                            DGT_name: $scope.table5[i].DGT_name,
                            percent: $scope.table5[i].percent
                        }
                    } else {
                        $scope.shangku2[j] = {
                            DGT_id: $scope.table5[i].DGT_id,
                            percent: $scope.table5[i].percent,
                            name: $scope.table5[i].DGT_name
                        }
                    }
                    j++;
                }
            }

        if (!$scope.ispeizhi1) {
            console.log($scope.table4.pre);
        }else{
            console.log($scope.shangku2);
        }


        $scope.navi = $scope.h4navi
    }


    $scope.addspk = function (navi) {
        apiconn.send_obj({
            "obj": "DGT",
            "act": "list",
            "page_num": 0,
            "page_size": 100
        });
        if(navi){
            $scope.ispeizhi1=true;
        }else{
            $scope.ispeizhi1=false;
        }
        $scope.h4navi = navi || 3;

        $scope.navi = 4;

    }
    $scope.goselect=function () {

    }
    //商品投放
    function sptf() {
        var data = $.extend({}, $scope.table4);
        if(data.act=="update"){
            data.DGT_list = [];
            for (var i = 0; i < data.pre.length; i++) {
                data.DGT_list[i]={
                    "DGT_id": data.pre[i].DGT_id,
                    "percent": data.pre[i].percent
                }
            }
        }else {
            data.DGT_list = {};
            for (var i = 0; i < data.pre.length; i++) {
                data.DGT_list[data.pre[i].DGT_id] = data.pre[i].percent;
            }
        }

        console.log('修改后值');
        console.log(data);
        delete data.pre;
        apiconn.send_obj(data);
    }
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

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "circle" && jo.act == "list") {
            if($scope.export_flag==true){//导出
                $scope.filename = "地图商品投放";
                var detail = "";
                var arr = [["修改日期","商圈名称","商圈ID","投放定点密度","选择商品库及对比","状态"]];
                angular.forEach(jo.circle_list,function(x){
                    detail = "";
                    angular.forEach(x.DGT_list,function(y){
                        detail += y.DGT_name+" "+y.percent+"%;";
                    });
                    arr.push([$filter('date')(x.update_time*1000,'yyyy-MM-dd HH:mm'), x.name,x.circle_id, x.density, detail,(x.status=='run'?'进行中':'隐藏中')]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.circle_list1 = jo.circle_list;
                $scope.total_page1 = jo.total_page;
                console.log($scope.total_page1);
                setmap(jo.circle_list);
                settable(jo.circle_list)
            }
        }
        if (jo.obj == "pet" && jo.act == "goods_list") {
            $scope.shangku2 = jo.list;
        }
        if (jo.obj == "circle" && jo.act == "add") {
            var txt = "添加商圈成功";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        }
        if (jo.obj == "circle" && jo.act == "delete") {
            var txt = "解除商圈成功";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        }
        if (jo.obj == "pet" && jo.act == "goods_update") {
            var txt = "配置成功";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        }
        if (jo.obj == "circle" && jo.act == "update") {
            var txt = "编辑投放成功";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        }
        if (jo.obj == "DGT" && jo.act == "list") {
            $scope.table5 = jo.DGT_list;
              if(!$scope.ispeizhi1){
                  console.log($scope.table4.pre)
                for (var i = 0; i < $scope.table4.pre.length; i++) {
                    var t4 = $scope.table4.pre[i];
                    for (j in $scope.table5) {
                        var t5 = $scope.table5[j];
                        if (t5.DGT_id == t4.DGT_id) {
                            $scope.table5[j].select = true;
                            $scope.table5[j].percent = $scope.table4.pre[i].percent;
                            break;
                        }
                    }
            }}else {
                  for (var i = 0; i < $scope.shangku2.length; i++) {
                      var t4 = $scope.shangku2[i];
                      for (j in $scope.table5) {
                          var t5 = $scope.table5[j];
                          if (t5.DGT_id == t4.DGT_id) {
                              $scope.table5[j].select = true;
                              $scope.table5[j].percent = $scope.shangku2[i].percent;
                              break;
                          }
                      }
                  }
              }
        }
        if (jo.obj == "circle" && jo.act == "fund_list") {
            if($scope.export_flag_fund==true){//导出
                $scope.filename = "基金库商品投放";
                var arr = [["上次投放时间","商圈名称","商圈ID","投放定点个数"]];
                angular.forEach(jo.circle_list,function(x){
                    arr.push([$filter('date')(x.put_time*1000,'yyyy-MM-dd HH:mm'), x.name,x.circle_id, x.point_num]);
                });
                export2xlsx(arr,$scope.filename);
            }else {//查询
                $scope.map2 = jo.circle_map;
                $scope.price2 = jo.pool_fund;
                $scope.total_page2 = jo.total_page;
                if (jo.circle_map) {
                    setmap2(jo.circle_map);
                }

                settable2(jo.circle_list)
            }
        }
        if (jo.obj == "circle" && jo.act == "put_five") {
            if (jo.status == 'success') {
                var txt = jo.msg;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
                $scope.searchtable3();
                $scope.gonav(2)
            } else {
                var txt = "密码错误";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            }

        }
        if (jo.obj == "circle" && jo.act == "truck_list") {
            console.log(jo);
            $scope.price7 = jo.pool_fund;
            $scope.total_page7 = jo.total_page;
            settable7(jo.list)
        }
    });

    function setmap(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var low_right = data[i].low_right;
            var top_left = data[i].top_left;
            console.log(low_right)
            console.log(top_left)
            shangquan[i] = {
                x: (low_right.longitude + top_left.longitude) / 2,
                y: (low_right.latitude + top_left.latitude) / 2,
                width: (Math.abs(low_right.longitude - top_left.longitude)) / 2,
                height: (Math.abs(low_right.latitude - top_left.latitude)) / 2,
                title: data[i].name,
                numb: data[i].density,
                id: data[i].circle_id,
                point_num:data[i].point_num
            }
        }
        console.log('初始化值');
        console.log(data);
        setTimeout(function () {
            map && map.clearOverlays();
            //画商圈
            for (var i = 0; i < shangquan.length; i++) {
                drawPolygonaa(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].point_num, i);
            }
        }, 10);
    }

    function setmap2(data) {
        for (var i = 0; i < data.length; i++) {
            var low_right = data[i].low_right;
            var top_left = data[i].top_left;
            shangquan[i] = {
                x: (low_right.longitude + top_left.longitude) / 2,
                y: (low_right.latitude + top_left.latitude) / 2,
                width: (Math.abs(low_right.longitude - top_left.longitude)) / 2,
                height: (Math.abs(low_right.latitude - top_left.latitude)) / 2,
                title: data[i].name,
                numb: data[i].point_num,
                id: data[i].circle_id,
                point_num:data[i].point_num
            }
        }
        console.log('初始化值');
        console.log(data);
        setTimeout(function () {
            //画商圈
            map2 && map2.clearOverlays();
            for (var i = 0; i < shangquan.length; i++) {
                drawPolygonbb(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].point_num, i,shangquan[i].id);
            }
        }, 100);
    }

    function zero(n) {
        return n >= 10 ? n : ('0' + n);
    }

    function getdate(data) {
        return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
    }

    function settable(data) {
        //商圈
        $scope.table1 = [];
        $scope.table1fix.length = data.length;
        for (i in data) {
            var date = new Date(data[i].update_time*1000);
            $scope.table1[i] = {
                time: getdate(date),
                name: data[i].name,
                id: data[i].circle_id,
                numb: data[i].density,
                pre: data[i].DGT_list,
                state: data[i].status
            }
        }
    }

    function settable2(data) {
        console.log(data);
        var i;
        //商圈
        $scope.table3 = [];
        $scope.table3fix.length = data.length;
        for (i in data) {
            var date = new Date(data[i].put_time);
            $scope.table3[i] = {
                update_time: getdate(date),
                name: data[i].name,
                circle_id: data[i].circle_id,
                density: data[i].point_num,
                DGT_list: data[i].DGT_list
            }
        }
        console.log($scope.table3);
    }

    function settable7(data) {
        console.log(data);
        $scope.navi = 6;
        var i;
        //商圈
        $scope.table7 = data;
        $scope.table7fix.length = data.length;
        console.log($scope.table7);
    }

    //商圈地图1
    // var shangquan = [
    //     {
    //         x: 119.314436,
    //         y: 26.057599,
    //         width: 0.01,
    //         height: 0.01,
    //         title: '商圈一',
    //         numb: 12313
    //     },
    //     {
    //         x: 119.414436,
    //         y: 26.057599,
    //         width: 0.01,
    //         height: 0.01,
    //         title: '商圈二',
    //         numb: 113
    //     }
    // ];


    //商圈地图二
    var shangquan2 = [
        {
            x: 119.314436,
            y: 26.057599,
            width: 0.01,
            height: 0.01,
            title: '商圈一',
            numb: 12313
        },
        {
            x: 119.414436,
            y: 26.057599,
            width: 0.01,
            height: 0.01,
            title: '商圈二',
            numb: 113
        }
    ];


    $scope.gonav = function (i) {
        // if(i==0){
        //     setTimeout(function () {
        //
        //     },0)
        //     $('#allmap').replaceWith('<div class="content2" id="allmap"></div>');
        //
        //
        // }
        $scope.navi = i;

    }

    $scope.quanxuan4=function (inselect) {
        for(var i=0;i<$scope.table5.length;i++){
            $scope.table5[i].select=inselect;
        }
    }


    $scope.addsq=function () {
        $scope.table4={
            "obj":"circle",
            "act":"add"
        };
        $scope.navi=3;
    }

    $scope.editku = function (data) {
        console.log('编辑该库');
        console.log('数据:' + data);
    }

    $scope.i3out = function () {
        var txt = '退出将无法保存当前配置'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.searchtable1();$scope.gonav(0)
                })
            }
        })
    }


    $scope.output = "等待服务端数据";


    var haspolygon = false, canedit = true, move = false, haschange = false, polygon, first = true, down = false, index, sx, sy, dx, dy, map;
    var ox = dx, oy = dy, width = dwidth, height = dheight, lastPolygon, polygons, up = false;
    $scope.show = false;

    function dxywh() {
        ox = dx;
        oy = dy;
        width = dwidth;
        height = dheight;
    }


    $scope.saveDraw = function () {
        for (var i = 0; i < shangquan.length; i++) {
            if (i == index) {
                continue;
            }
            var item = shangquan[i];
            var x1 = item.x;
            var y1 = item.y;
            var width1 = item.width;
            var height1 = item.height;
            var w = x1 - ox;
            var h = y1 - oy;
            if ((Math.abs(w) < Math.abs(width1 + width)) && (Math.abs(h) < Math.abs(height1 + height))) {
                if ((Math.abs(w) < Math.abs(width1 - width)) && (Math.abs(h) < Math.abs(height1 - height))) {

                } else {
                    var txt = "商圈间不能部分重叠,请重新规划商圈";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                    return false;
                }
            }
        }
        lastPolygon.disableEditing();
        map.removeOverlay(lastPolygon);
        if (index >= 0) {
            shangquan[index].x = ox;
            shangquan[index].y = oy;
            shangquan[index].width = width;
            shangquan[index].height = height;
            shangquanMap[index] = lastPolygon;
            drawPolygonaa(ox, oy, width, height, shangquan[index].title, shangquanMap[index].numb, index);

            $scope.selecttable1i = index;
            var data = $scope.table1[$scope.selecttable1i];
            var data1 = shangquan[$scope.selecttable1i];
           for(var i=0;i<data.pre.length;i++){
               delete data.pre[i].$$hashKey;
           }
            $scope.table4 = {
                "circle_id": data1.id,
                "obj": "circle",
                "act": "update",
                "top_left": {
                    "latitude": data1.y + data1.height,
                    "longitude": data1.x - data1.width
                },
                "low_right": {
                    "latitude": data1.y - data1.height,
                    "longitude": data1.x + data1.width
                },
                "name": data.name,
                "area": data1.width * 220 * data1.height * 1111,
                "density": data.numb,
                "pre": data.pre
            }
        } else {
            $scope.table4 = {
                "obj": "circle",
                "act": "add",
                "top_left": {
                    "latitude": oy + height,
                    "longitude": ox - width
                },
                "low_right": {
                    "latitude": oy - height,
                    "longitude": ox + width
                },
                "area": width * 220 * height * 1111
            }
        }


        dxywh();
        $('.bel,.del').remove();
        lastPolygon = null;
        haspolygon = false;
        up = false;
        move = false;
        canedit = true;
        haschange = false;
        huanyuan();
        $scope.drwname = '绘制范围';
        $scope.show = false;
        $scope.navi = 3;
        $scope.h1navi = 0;
    }


    $scope.draw = function () {
        //取消绘制
        if (haspolygon) {
            haspolygon = false;
            //已经使用商圈
            if (canedit) {
                lastPolygon && lastPolygon.disableEditing();
                $('.bel,.del').remove();
                lastPolygon = null;
                canedit = false;
                dxywh();
                up = false;
                move = false;

                if (haschange) {
                    huanyuan();
                    canedit = true;
                    haspolygon = false;
                    move = false;
                    haschange = false
                    $scope.show = false;
                }
            } else {
                map.removeOverlay(lastPolygon);
                move = false;
                lastPolygon = null;
                $scope.show = false;
                canedit = true;
            }
            haschange = false;
            $scope.drwname = '绘制商圈';
        } else {
            index = -1;
            move = true;
            haspolygon = true;
            $scope.show = true;
            canedit = false;
        }
    }
    /*平面多边形面积*/
    function PlanarPolygonAreaMeters2(points) {
        var a = 0;
        for (var i = 0; i < points.length; ++i) {
            var j = (i + 1) % points.length;
            var xi = points[i][0] * metersPerDegree * Math.cos(points[i][1] * radiansPerDegree);
            var yi = points[i][1] * metersPerDegree;
            var xj = points[j][0] * metersPerDegree * Math.cos(points[j][1] * radiansPerDegree);
            var yj = points[j][1] * metersPerDegree;
            a += xi * yj - xj * yi;
        }
        return Math.abs(a / 2);
    }


    function drawPolygonaa(ax, ay, awidth, aheight, title, numb, i) {
        var hasChange = false;
        var di = i;
        var polygon = new BMap.Polygon([
            new BMap.Point(ax - awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay - aheight),
            new BMap.Point(ax - awidth, ay - aheight)
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});

        var point = new BMap.Point(ax, ay);
        map.centerAndZoom(point, per);
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        var label = new BMap.Label(title + '<br>定点数:' + numb, {offset: new BMap.Size(-20, -30)});
        marker.setLabel(label);
        map.addOverlay(polygon);
        polygon.marker=marker;
        shangquanMap[i] = polygon;
        polygon.addEventListener('mousedown', function (e) {
            console.log('cccc');
            //  if (e.domEvent.button == 2) {
            if (!canedit || haschange) {
                // var txt=  "请保存或取消绘范围后编辑";
                // window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                return false;
            }

            index = di;
            $('.bel,.del').remove();
            //准备搞界面
            var $bel = $('<span class="bel">编辑<br/>投放</span>');
            var $del = $('<span class="del">解除<br/>商圈</span>');
            $bel.on('click', function () {
                $scope.$apply(function () {
                    $scope.toufan(index);
                });
                return false;
            });
            $del.on('click', function () {

                $scope.pdata = shangquan[index].id;
                $scope.deletesq(index, $scope.pdata);
            });


            $(marker.Zc).after($bel);
            $(marker.Zc).after($del);

            //生成编辑

            lastPolygon = polygon;
            ox = ax;
            oy = ay;
            width = awidth;
            height = aheight;
            move = false;
            haspolygon = true;
            down = false;
            //    }
        });

    }

    function huanyuan() {
        map.clearOverlays();
        for (var i = 0; i < shangquan.length; i++) {
            drawPolygonaa(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].numb, i);
        }
    }

    setTimeout(function () {
        // $('#allmap2').replaceWith('<div class="content2" id="allmap2"></div>');
        // $('#allmap').replaceWith('<div class="content2" id="allmap"></div>');
        initmap();
      //  initmap2();
    }, 0);


    function initmap() {
        //搜索城市
        $('#search1').on('click', function () {
            var city = document.getElementById("key1").value;
            if (city != "") {
                map.centerAndZoom(city, per);      // 用城市名设置地图中心点
            }
        });

        // 百度地图API功能
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(ox, oy), per);
        map.enableScrollWheelZoom();

        //drawPolygon(ox,oy,width,height)


        //画last
        function drawPolygon(ax, ay, awidth, aheight) {
            lastPolygon && map.removeOverlay(lastPolygon);
            ox = ax;
            oy = ay;
            width = awidth;
            height = aheight;
            lastPolygon = new BMap.Polygon([
                new BMap.Point(ox - width, oy + height),
                new BMap.Point(ox + width, oy + height),
                new BMap.Point(ox + width, oy - height),
                new BMap.Point(ox - width, oy - height)
            ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
            lastPolygon.addEventListener('mousedown', function () {
                console.log(haschange)
                if (haschange) {
                    return;
                }
                $scope.$apply(function () {
                    $scope.drwname = "取消绘图";
                });
                setTimeout(function () {
                    lastPolygon.enableEditing();
                }, 0);
            })
            map.addOverlay(lastPolygon);
            listnode();
        }


        map.addEventListener("mousemove", function (e) {
            if (move && haspolygon) {
                var x = e.point.lng, y = e.point.lat;
                drawPolygon(x, y, width, height);
            }
        });
        map.addEventListener("mouseup", function (e) {
            if (e.domEvent.button == 0) {
                setTimeout(function () {
                    if (haspolygon && down && !move) {
                        var x1 = e.point.lng, y1 = e.point.lat, x2, y2;
                        if (x1 > ox && y1 > oy) {
                            x2 = ox - width;
                            y2 = oy - height;
                        } else if (x1 < ox && y1 > oy) {
                            x2 = ox + width;
                            y2 = oy - height;
                        } else if (x1 < ox && y1 < oy) {
                            x2 = ox + width;
                            y2 = oy + height;
                        } else if (x1 > ox && y1 < oy) {
                            x2 = ox - width;
                            y2 = oy + height;
                        }
                        ox = (x1 + x2) / 2;
                        oy = (y1 + y2) / 2;
                        width = (x1 - x2) / 2;
                        height = (y1 - y2) / 2;
                        if (width < 0) {
                            width = -width;
                        }
                        if (height < 0) {
                            height = -height;
                        }
                        drawPolygon(ox, oy, width, height);
                        lastPolygon.enableEditing();
                        $('.BMap_vectex.BMap_vectex_nodeT').remove();
                        down = false;
                    }
                }, 10);
            }

        });

        map.addEventListener("mousedown", function (e) {
            //  if (e.domEvent.button == 2) {
            move = false;
            down = false
            $('.BMap_vectex.BMap_vectex_nodeT').remove();
            listnode();
            if (!haschange) {
                lastPolygon && lastPolygon.disableEditing();
            }

            //  }
        });


        function listnode() {
            setTimeout(function () {
                $('.BMap_vectex.BMap_vectex_node').on('click', function () {
                    $scope.$apply(function () {
                        $scope.show = true;
                        $scope.drwname = "取消绘图";
                    });
                    down = true;
                    haschange = true;
                    $('.bel,.del').remove();
                    console.log(haschange);
                });
            }, 0)
        }
    }


    // //删除编辑图案
    // function clearlast() {
    //     map.removeOverlay(lastPolygon);
    //     haspolygon = false;
    //     up = false;
    //     $scope.$apply(function () {
    //         $scope.show = false;
    //     })
    // }
    var map2, tou = false;

    function initmap2() {
        var mylabel;
        // 百度地图API功能
        map2 = new BMap.Map("allmap2");
        map2.centerAndZoom(new BMap.Point(ox, oy), per);
        map2.enableScrollWheelZoom();

        // polygon = new BMap.Polygon([
        //     new BMap.Point(119.294436, 26.057599),
        //     new BMap.Point(119.344436, 26.057599),
        //     new BMap.Point(119.344436, 26.027599),
        //     new BMap.Point(119.294436, 26.027599)
        // ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
        //
        //
        // map2.addOverlay(polygon);   //增加多边形

        $('#search2').on('click', function () {
            var city = document.getElementById("key2").value;
            if (city != "") {
                map2.centerAndZoom(city, per);      // 用城市名设置地图中心点
            }
        });

       // polygon.hide();

        //画商圈
        // for (var i = 0; i < shangquan.length; i++) {
        //     drawPolygonbb(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].point_num, i);
        // }
    }

    function drawPolygonbb(ax, ay, awidth, aheight, title, numb, i,circle_id) {
        var polygon = new BMap.Polygon([
            new BMap.Point(ax - awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay - aheight),
            new BMap.Point(ax - awidth, ay - aheight)
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});

        var point = new BMap.Point(ax - awidth, ay + aheight);
        var label = new BMap.Label(title + '<br>定点数:' + numb, {offset: new BMap.Size(0, -37), position: point});
        polygon.point=point;
        map2.addOverlay(label);
        map2.addOverlay(polygon);
        shangquanMap2[i]=polygon;
        polygon.addEventListener('mousedown', function (e) {
            $(polygon.V).css('cursor', 'pointer')

            // var $bel = $('<span class="sel">投放<br/>碎片</span>');
            // $bel.on('mousedown', function (e) {
            //     if (e.button == 0) {
            //         // var txt=  "是否投放改碎片";
            //         // window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{
            //         //     onOk:function(v) {
            //         //
            //         //         return false;
            //         //     }
            //         // });
            //         if ($(this))
            //             $(this).addClass('zuobia');
            //     }
            //     $bel.remove();
            //     $del.remove();
            // });
            var point = new BMap.Point(ax, ay - aheight);
            var label1 = new BMap.Label('投放<br/>碎片', {offset: new BMap.Size(-40, 0), position: point});
            var label2 = new BMap.Label('取消<br/>投放', {offset: new BMap.Size(0, 0), position: point});
            map2.addOverlay(label1);
            map2.addOverlay(label2);
            label1.setStyle({
                width: "40px",
                height: "40px",
                verticalAlign: " middle",
                fontSize: "12px",
                textAlign: "center",
                background: "#fff",
                border: "1px solid #9BC4F7",
                borderRadius: "1000px",
                paddingTop: "3px"
            });
            label2.setStyle({
                width: "40px",
                height: "40px",
                verticalAlign: " middle",
                fontSize: "12px",
                textAlign: "center",
                background: "#fff",
                border: "1px solid #9BC4F7",
                borderRadius: "1000px",
                paddingTop: "3px"
            });


            label2.addEventListener('click', function () {
                map2.removeOverlay(label1);
                map2.removeOverlay(label2);
            });
            label1.addEventListener('click', function () {
                $(polygon.V).css('cursor', 'help')
                map2.removeOverlay(label1);
                map2.removeOverlay(label2);
                tou = true;
            });
            if (tou&&e.domEvent.button==2) {
                var txt = "是否投放该碎片";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
                    onOk: function (v) {
                        map2.removeOverlay(label1);
                        map2.removeOverlay(label2);
                        tou = false;
                        $scope.navi = 6;
                        console.log(circle_id,e.point.lat,e.point.lng)
                        $scope.searchtable7(circle_id,e.point.lat,e.point.lng)
                    },
                    onCancel: function () {
                        map2.removeOverlay(label1);
                        map2.removeOverlay(label2);
                        tou = false;
                    }
                });
            }
            polygon.label1=label1;
            polygon.label2=label2;

        });
    }
    $scope.GetRandomNum=function (index,type)
    {
        console.log((index-0)+($scope.table7fix.page_size-0)*($scope.table7fix.page_num-1));

        var x=$scope.table3fix.page_num-1;
        var y=$scope.table7fix.page_size;
        console.log(index+x*y);
        var a=$scope.map2[index+x*y].low_right[type];
        var b=$scope.map2[index+x*y].top_left[type];
        console.log(a,b);
        var Max=a>b?a:b;
        var Min=a<b?a:b;
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Rand * Range);
    }
});



