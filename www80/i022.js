/**
 * Created by sangcixiang on 16/9/4.
 */
// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i022', function($scope,$interval) {

    // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到
    // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期
    var userId = localStorage.getItem("userid")
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
    function Format(fmt,date){
        var date = new Date(date);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(0), //小时
            "m+": date.getMinutes(0), //分
            "s+": date.getSeconds(0), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S":  date.getMilliseconds(0) //毫秒
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
    function select(){

        if(day_num == 'diy'){
            var startDate = document.getElementById('jqueryPicker');
            var startTimer = new Date(startDate.value).getTime();
            var endDate = document.getElementById('jqueryPicker1');
            var endTimer = new Date(endDate.value).getTime();

            var newstartDate = initDate(new Date(startTimer)).getTime();
            var newendTimer = initDate(new Date(endTimer)).getTime();

            apiconn.send_obj({
                "obj":"historyPerson",
                "act":"list",
                "admin_id":userId,
                "day_num":day_num,
                "start_time":newstartDate/1000,
                "end_time":newendTimer/1000,
                "page_num":$scope.page - 1,
                "page_size":10
            });
        }else{
            apiconn.send_obj({
                "obj":"historyPerson",
                "act":"list",
                "admin_id":userId,
                "day_num":day_num,
                "page_size":10,
                "page_num" : $scope.page - 1
            });
        }
    }
    function sortNumber(a,b)
    {
        return a - b
    }
    function dataInfo(title){
        if(lineModel.length<=0){
            return;
        }

        if(title == '注册登录'){
            var register_num = []; //新增用户
            var active_num = [] ;  //活跃用户
            var sum = 0,sums = []
            for (var i=0;i<lineModel.length;i++){
                sum += lineModel[i].active_num
                sums.push(lineModel[i].active_num)
            }
            sums.sort(sortNumber)
            console.log(sums)
            for(var i=0;i<lineModel.length;i++){
                var obj =[lineModel[i].date,lineModel[i].register_num];
                register_num.push(obj);

                var obj1 = [lineModel[i].date,lineModel[i].active_num];
                active_num.push(obj1);
            }
            $('#jqChart').jqChart({
                title: { text: title },
                axes: [
                    {
                        location: 'left',
                        minimum: sums[0] - 10,
                        maximum: sums[sums.length - 1] + 10,
                        interval: sum / sums.length
                    }
                ],
                series: [
                    {
                        type: 'line',//图表类型，取值：column 柱形图，line 线形图
                        title:'新增用户',//标题
                        data: register_num//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
                    },
                    {
                        type: 'line',
                        title:'活跃用户',
                        data: active_num
                    }
                ]
            });
        }else if(title == '充值付费'){
            var day_pay_num = [],ARPU = [],ARRPU= [];

            var daySum = 0,arpuSum = 0,arrpuSum = 0,
                dayArray = [],arpuArray = [],arrpuArray = [];
            for(var i=0;i<lineModel.length;i++){

                daySum += lineModel[i].day_pay_num;
                arpuSum += lineModel[i].ARPU;
                arrpuSum += lineModel[i].ARRPU;

                dayArray.push(lineModel[i].day_pay_num)
                arpuArray.push(lineModel[i].ARPU)
                arrpuArray.push(lineModel[i].ARRPU)
            }

            dayArray.sort(sortNumber)


            for(var i=0;i<lineModel.length;i++){

                var obj1 = [lineModel[i].date,lineModel[i].day_pay_num];
                day_pay_num.push(obj1);

                var obj2 = [lineModel[i].date,lineModel[i].ARPU];
                ARPU.push(obj2);

                var obj3 = [lineModel[i].date,lineModel[i].ARRPU];
                ARRPU.push(obj3);
            }
            $('#jqChart').jqChart({
                title: { text: title },
                axes: [
                    {
                        location: 'left',
                        minimum: dayArray[0] - (daySum / dayArray.length),
                        maximum: dayArray[dayArray.length -  1] + (daySum / dayArray.length),
                        interval: daySum / dayArray.length
                    }
                ],
                series: [
                    {
                        type: 'line',
                        title:'日付费用户',
                        data: day_pay_num
                    },
                    {
                        type: 'line',
                        title:'日流水',
                        data: ARPU
                    },
                    {
                        type: 'line',
                        title:'日流水',
                        data: ARRPU
                    }
                ]
            });
        }else if(title == '在线'){
            var average_hold_time = []; //在线时长
            var top_hold_num = [] ;  //峰值在线

            var topSum = 0,topArray = [];

            for(var i=0;i<lineModel.length;i++){
                var obj =[lineModel[i].date,lineModel[i].average_hold_time];
                average_hold_time.push(obj);

                var obj1 = [lineModel[i].date,lineModel[i].top_hold_num];
                top_hold_num.push(obj1);

                topSum += lineModel[i].average_hold_time;
                topArray.push(lineModel[i].average_hold_time)
            }
            topArray.sort(sortNumber)

            $('#jqChart').jqChart({
                title: { text: title },
                axes: [
                    {
                        location: 'left',
                        minimum: topArray[0] - (topSum / topArray.length),
                        maximum: topArray[topArray.length - 1] + (topSum / topArray.length),
                        interval: topSum / topArray.length
                    }
                ],
                series: [{
                    type: 'line',//图表类型，取值：column 柱形图，line 线形图
                    title:'平均在线时长',//标题
                    data: average_hold_time  //数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
                },
                    {
                        type: 'line',
                        title:'峰值在线人数',
                        data: top_hold_num
                    }
                ]
            });
        }else if(title == '活跃'){
            var DAU = [];
            var WAU = [];
            var MAU = [];

            var wauSum = 0,wauArray = []

            for(var i=0;i<lineModel.length;i++){
                var obj =[lineModel[i].date,lineModel[i].DAU];
                DAU.push(obj);

                var obj1 = [lineModel[i].date,lineModel[i].WAU];
                WAU.push(obj1);
                wauSum +=  lineModel[i].WAU;
                wauArray.push(lineModel[i].WAU)

                var obj2 = [lineModel[i].date,lineModel[i].MAU];
                MAU.push(obj2);
            }
            wauArray.sort(sortNumber)
            $('#jqChart').jqChart({
                title: { text: title },
                axes: [
                    {
                        location: 'left',
                        minimum: wauArray[0] - (wauSum / wauArray.length),
                        maximum: wauArray[wauArray.length - 1] + (wauSum / wauArray.length),
                        interval: wauSum / wauArray.length
                    }
                ],
                series: [
                    {
                        type: 'line',
                        title:'DAU',
                        data: DAU
                    },
                    {
                        type: 'line',
                        title:'WAU',
                        data: WAU
                    },
                    {
                        type: 'line',
                        title:'MAU',
                        data: MAU
                    }
                ]
            });
        }else if(title == '流失'){
            var day_lost_num = [];
            var daySum = 0,daylostArray = []
            for(var i=0;i<lineModel.length;i++){
                var obj =[lineModel[i].date,lineModel[i].day_lost_num];
                day_lost_num.push(obj);
                daySum += lineModel[i].day_lost_num;
                daylostArray.push(lineModel[i].day_lost_num)
            }
            daylostArray.sort(sortNumber)
            $('#jqChart').jqChart({
                title: { text: title },
                axes: [
                    {
                        location: 'left',
                        minimum: daylostArray[0] - (daySum / daylostArray.length),
                        maximum: daylostArray[daylostArray.length - 1] + (daySum / daylostArray.length),
                        interval: daySum / daylostArray.length
                    }
                ],
                series: [
                    {
                        type: 'line',
                        title:'日流失',
                        data: day_lost_num
                    }
                ]
            });
        }
    }
    function initDate(e) {
        return e.setHours(0),e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0),e;
    }
    $scope.showDatePicker = false;
    $scope.type1 = '10';
    $scope.page = 1;
    $scope.showTable = true;
    $scope.switchType = '切换拆线视图';
    $scope.model = [];
    var toolbar = false;
    var lineModel = [];
    var day_num = 30;

    var timer = $interval(function(){

        $scope.selectedDate = '近三十天';
        apiconn.send_obj({
            "obj":"historyPerson",
            "act":"list",
            "admin_id":userId,
            "day_num":day_num,
            "page_size":10,
            "page_num" : $scope.page - 1
        });
        $interval.cancel(timer);

    },10);


    $scope.openDatePicker = function(){
        $scope.showDatePicker = !$scope.showDatePicker;
    };
    $scope.switch = function(){

        $scope.showTable  = !$scope.showTable;
        if(!$scope.showTable){

           // dataInfo($scope.lineTitle);
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
        $scope.page = 1;
        select();
    };

    $scope.enter = function(){
        $scope.page = 1;
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
        day_num = 'diy';
        var startStr = Format('yyyy-MM-dd',startTimer);
        var endStr = Format('yyyy-MM-dd',endTimer);
        $scope.selectedDate = startStr + ' 至 ' + endStr;
        $scope.showDatePicker = false;

        var newstartDate = initDate(new Date(startTimer)).getTime();
        var newendTimer = initDate(new Date(endTimer)).getTime();

        apiconn.send_obj({
            "obj":"historyPerson",
            "act":"list",
            "admin_id":userId,
            "day_num":day_num,
            "start_time":newstartDate/1000,
            "end_time":newendTimer/1000,
            "page_num":$scope.page - 1
        });
    };

    $scope.cancel = function(){
        $scope.showDatePicker = false;
    };
    $scope.changePage = function(page){
        $scope.page = 1;
        if(day_num == 'diy'){
            var startDate = document.getElementById('jqueryPicker');
            var startTimer = new Date(startDate.value).getTime();
            var endDate = document.getElementById('jqueryPicker1');
            var endTimer = new Date(endDate.value).getTime();

            var newstartDate = initDate(new Date(startTimer)).getTime();
            var newendTimer = initDate(new Date(endTimer)).getTime();

            apiconn.send_obj({
                "obj":"historyPerson",
                "act":"list",
                "admin_id":userId,
                "day_num":day_num,
                "start_time":newstartDate/1000,
                "end_time":newendTimer/1000,
                "page_num":$scope.page - 1
            });
        }else{
            apiconn.send_obj({
                "obj":"historyPerson",
                "act":"list",
                "admin_id":userId,
                "day_num":day_num,
                "page_size":page,
                "page_num" : $scope.page - 1
            });
        }
    };
    $scope.up = function(){
        if($scope.page >1){
            $scope.page--;
            select()
        }
    };
    $scope.next = function(){
        if($scope.page < $scope.allPage){
            $scope.page++;
            select()
        }
    };
    $scope.selectBtn = function(index){

        var btn = document.getElementById('queryType').getElementsByTagName('button');
        for(var i=0;i<btn.length;i++){

            btn[i].className = 'btn';
        }
        btn[index].className = 'btn selectBtn';
        switch (index){
            case 0:
                $scope.lineTitle = '注册登录';
                break;
            case 1:
                $scope.lineTitle = '充值付费';
                break;
            case 2:
                $scope.lineTitle = '在线';
                break;
            case 3:
                $scope.lineTitle = '活跃';
                break;
            case 4:
                $scope.lineTitle = '流失';
                break;
            default :
                $scope.lineTitle = '注册登录';
        }
        dataInfo($scope.lineTitle)
    };

    $("#jqueryPicker").datetimepicker();
    $("#jqueryPicker1").datetimepicker();

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

        // 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户
        // 要处理。 ustr 是文本字符串的错误说明
        // 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。

        // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
        // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
        // 工具箱那里按键"send input" 这个：
        // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}
        if(jo.obj == 'historyPerson' && jo.act == 'list'){
            $scope.model = jo.historyPerson_list;
            $scope.allPage = jo.total_page;
            var count = $scope.model.length;
            if(count <=0 || jo.ustr == '查看天数信息丢失'){
                alert('没有相关数据');
                return;
            }
            var register_num = 0,
                active_num = 0,
                second_hold_percent = 0,
                three_hold_percent = 0,
                seven_hold_percent = 0,
                day_gold_num = 0,
                give_gold_num = 0,
                total_pay_num = 0,
                day_pay_num = 0,
                ARPU = 0,
                ARRPU = 0,
                pay_percent = 0,
                new_pay_percent = 0,
                top_hold_num = 0,
                average_hold_time = 0,
                DAU = 0,
                WAU = 0,
                MAU = 0,
                APA = 0,
                day_lost_num = 0,
                one_week_lost_num = 0,
                two_week_lost_num = 0,
                lost_percent = 0;
            var arr = [];
            for(var i=0;i<$scope.model.length;i++){
                register_num          += $scope.model[i].register_num;                //日新增总和
                active_num            += $scope.model[i].active_num; //日活跃均值
                second_hold_percent   += parseFloat($scope.model[i].second_hold_percent);//次日均值
                three_hold_percent    += parseFloat($scope.model[i].three_hold_percent);//三日均值
                seven_hold_percent    += parseFloat($scope.model[i].seven_hold_percent);//七日跃均值

                day_gold_num          += $scope.model[i].day_gold_num;  //用户充值总和
                give_gold_num         += $scope.model[i].give_gold_num; //平台赠送总和
                total_pay_num         += $scope.model[i].total_pay_num; //用户消费总和

                day_pay_num           += $scope.model[i].day_pay_num;       //日付费用户
                ARPU                  += parseFloat($scope.model[i].ARPU);   //ARPU
                ARRPU                 += parseFloat($scope.model[i].ARRPU);//ARRPU
                pay_percent           += parseFloat($scope.model[i].pay_percent);//付费率
                //new_pay_percent       += parseFloat($scope.model[i].new_pay_percent);// 新增用户付费率

                top_hold_num          += $scope.model[i].top_hold_num;
                average_hold_time     += $scope.model[i].average_hold_time;
                DAU                   += $scope.model[i].DAU;
                WAU                   += $scope.model[i].WAU;
                MAU                   += $scope.model[i].MAU;
                APA                   += $scope.model[i].APA;
                day_lost_num          += $scope.model[i].day_lost_num;
                one_week_lost_num     += $scope.model[i].one_week_lost_num;
                two_week_lost_num     += $scope.model[i].two_week_lost_num;
                lost_percent          += $scope.model[i].lost_percent;
                if(i<7){
                    arr.push($scope.model[i])
                }
            }
            function sortNumber(a,b)
            {
                return a - b
            }
            lineModel = arr.sort(sortNumber);
            dataInfo('注册登录');

            $scope.sum = {
                register_num:register_num,
                active_num:             (active_num/count).toFixed(2),
                second_hold_percent:    (second_hold_percent/count).toFixed(2),
                three_hold_percent:     (three_hold_percent/count).toFixed(2),
                seven_hold_percent:     (seven_hold_percent/count).toFixed(2),
                day_gold_num:           day_gold_num.toFixed(2),
                give_gold_num:          give_gold_num.toFixed(2),
                total_pay_num:          total_pay_num.toFixed(2),
                day_pay_num:            (day_pay_num/count).toFixed(2),
                ARPU:                   (ARPU/count).toFixed(2),
                ARRPU:                  (ARRPU/count).toFixed(2),
                pay_percent:            (pay_percent/count).toFixed(2),
                new_pay_percent:        (new_pay_percent/count).toFixed(2),
                top_hold_num:           (top_hold_num/count).toFixed(2),
                average_hold_time:      (average_hold_time/count).toFixed(2),
                DAU:                    (DAU/count).toFixed(2),
                WAU:                    (WAU/count).toFixed(2),
                MAU:                    (MAU/count).toFixed(2),
                APA:                    (APA/count).toFixed(2),
                day_lost_num:           (day_lost_num/count).toFixed(2),
                one_week_lost_num:      (one_week_lost_num/count).toFixed(2),
                two_week_lost_num:      (two_week_lost_num/count).toFixed(2),
                lost_percent:           (lost_percent/count).toFixed(2)
            };
            console.log( $scope.sum.DAU);
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

