// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i051', function ($scope) {
    $scope.info = {};
    $scope.info.msg = "";
    $scope.info.selectIndex = 0;
    $scope.info.selectString = "ALL";
    $scope.info.sendType = 0;
    $scope.info.is_urgent = false;
    $scope.info.is_urgentString = "否";

    $scope.menu_info = function(){
        $scope.show_menu_info = true;
    }

    $scope.info.selectPlat = function (index) {

        $scope.info.selectIndex = index;
        switch (index) {
            case 0:
                $scope.info.selectString = "ALL";
                break;
            case 1:
                $scope.info.selectString = "IOS";
                break;
            case 2:
                $scope.info.selectString = "ANDROID";
                break;
            // case 3:
            //     $scope.info.selectString = "pc";
            //     break;
        }
        $scope.show_menu_info = false;
    }
    //设置发送类型
    $scope.info.setSendType = function (index) {
        $scope.info.sendType = index;
    }

    //发送按钮监听
    $scope.info.sendData = function () {
        var timestamp = Date.parse(new Date())/1000;
        timestamp += $scope.info.push_time * 60 * 60;
        apiconn.send_obj({
            "obj": "manage",
            "act": "short_msg_push",
            "admin_id": localStorage.getItem("userid"),
            "content": $scope.info.msg,
            "target_platform": $scope.info.selectString,
            "provinceCity": $scope.info.provinceCity,
            "is_time": $scope.info.sendType == 1?"false":"true",
            "push_time": timestamp,
            "is_urgent":$scope.info.is_urgent,
            "urgent_time":$scope.info.urgent_time
        });

    }

    //监听输入框
    $scope.$watch("info.msg", function (newValue, oldValue, scope) {
        if (newValue.length > 50)
            $scope.info.msg = oldValue;
        $scope.info.tips = newValue.length + "/50";
    });


    $scope.menu_info_is_urgent = function(){
        $scope.show_is_urgent = true;
    }

    $scope.select_is_urgent = function (index) {
        if(index){
            $scope.info.is_urgentString = "是";
        }else{
            $scope.info.is_urgentString = "否";
        }
        $scope.info.is_urgent = index;
        $scope.show_is_urgent = false;
    }

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "manage" && jo.act == "short_msg_push") {
            if (jo.status == "success") {
                alert("提交成功!");
            } else {
                alert(jo.status);
            }

        }
    });
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
            $scope.info.provinceCity = province + city;
        }
    });
    cityPicker.init();

});



