/**
 * Created by sangcixiang on 16/9/3.
 */
// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i020', function($scope) {


    function select(){
        apiconn.send_obj({
            "obj":"historyTail",
            "act":"info"
        });
    }

    setTimeout(function () {
        select();
    },500);



    var getRandomColor = function(){


        var rand = Math.floor(Math.random( ) * 0xFFFFFF).toString(16);
        if(rand.length == 6){
            return '#'+rand;
        }else{
            return getRandomColor();
        }
    };
    $scope.showDiv = false;
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {


        if(jo.obj == 'historyTail' && jo.act == 'info'){



            var age = jo.historyTail.age;
            $(function(){
                var data = [];
                var colors = ['#fedd74','#82d8ef','#f76864','#80bd91'];
                for(var i=0;i<age.length;i++){

                    var num = (parseFloat(age[i].percent)*100).toFixed(0);
                    if(num>0){
                        data.push({
                            name:age[i].name,
                            value:num,
                            color:colors[i]
                        })
                    }
                }
                var chart = new iChart.Donut2D({
                    render : 'ageDiv',
                    center:{
                        text:'年龄',
                        shadow:true,
                        shadow_offsetx:0,
                        shadow_offsety:2,
                        shadow_blur:2,
                        shadow_color:'#b7b7b7',
                        color:'#6f6f6f'
                    },
                    data: data,
                    offsetx:-60,
                    shadow:true,
                    background_color:'#fff',
                    separate_angle:10,//分离角度
                    tip:{
                        enable:true,
                        showType:'fixed'
                    },
                    sub_option : {
                        label : {
                            background_color:null,
                            sign:false,//设置禁用label的小图标
                            padding:'0 4',
                            border:{
                                enable:false,
                                color:'#666666'
                            },
                            fontsize:11,
                            fontweight:600,
                            color : '#4572a7'
                        },
                        border : {
                            width : 2,
                            color : '#ffffff'
                        }
                    },
                    legend : {
                        enable : true,
                        shadow:true,
                        background_color:null,
                        border:false,
                        legend_space:30,//图例间距
                        line_height:10,//设置行高
                        sign_space:10,//小图标与文本间距
                        sign_size:17,//小图标大小
                        color:'#6f6f6f',
                        fontsize:17//文本大小
                    },
                    offset_angle:60,
                    showpercent:true,
                    decimalsnum:0,
                    width : 448,
                    height : 340,
                    radius:80
                });
                chart.draw();
            });

            var register = jo.historyTail.register;
            $(function(){
                var data = [];
                var colors = ['#fedd74','#82d8ef','#f76864','#80bd91'];
                for(var i=0;i<register.length;i++){

                    var num = (parseFloat(register[i].percent)*100).toFixed(0);
                    if(num>0){
                        data.push({
                            name:register[i].name,
                            value:num,
                            color:colors[i]
                        })
                    }
                }
                var chart = new iChart.Donut2D({
                    render : 'registerDiv',
                    center:{
                        text:'玩家\n账户类型',
                        shadow:true,
                        shadow_offsetx:0,
                        shadow_offsety:2,
                        shadow_blur:2,
                        shadow_color:'#b7b7b7',
                        color:'#6f6f6f'
                    },
                    data: data,
                    offsetx:-60,
                    shadow:true,
                    background_color:'#fff',
                    separate_angle:10,//分离角度
                    tip:{
                        enable:true,
                        showType:'fixed'
                    },
                    sub_option : {
                        label : {
                            background_color:null,
                            sign:false,//设置禁用label的小图标
                            padding:'0 4',
                            border:{
                                enable:false,
                                color:'#666666'
                            },
                            fontsize:11,
                            fontweight:600,
                            color : '#4572a7'
                        },
                        border : {
                            width : 2,
                            color : '#ffffff'
                        }
                    },
                    legend : {
                        enable : true,
                        shadow:true,
                        background_color:null,
                        border:false,
                        legend_space:30,//图例间距
                        line_height:10,//设置行高
                        sign_space:10,//小图标与文本间距
                        sign_size:17,//小图标大小
                        color:'#6f6f6f',
                        fontsize:17//文本大小
                    },
                    offset_angle:-90,
                    showpercent:true,
                    decimalsnum:0,
                    width : 448,
                    height : 340,
                    radius:80
                });
                chart.draw();
            });


            var province = jo.historyTail.province;
            $(function(){
                var data = [];
                for(var i=0;i<province.length;i++){
                    var color = getRandomColor();
                    var num = (parseFloat(province[i].percent)*100).toFixed(0);
                    if(num>0){
                        data.push({
                            name:province[i].name,
                            value:num,
                            color:color
                        })
                    }
                }
                var chart = new iChart.Donut2D({
                    render : 'locationDiv',
                    center:{
                        text:'玩家\n地区分布',
                        shadow:true,
                        shadow_offsetx:0,
                        shadow_offsety:2,
                        shadow_blur:2,
                        shadow_color:'#b7b7b7',
                        color:'#6f6f6f'
                    },
                    data: data,
                    offsetx:-60,
                    shadow:true,
                    background_color:'#fff',
                    separate_angle:10,//分离角度
                    tip:{
                        enable:true,
                        showType:'fixed'
                    },
                    legend : {
                        enable : true,
                        shadow:true,
                        background_color:null,
                        border:false,
                        legend_space:30,//图例间距
                        line_height:10,//设置行高
                        sign_space:10,//小图标与文本间距
                        sign_size:17,//小图标大小
                        color:'#6f6f6f',
                        fontsize:17//文本大小
                    },
                    sub_option : {
                        label : {
                            background_color:null,
                            sign:false,//设置禁用label的小图标
                            padding:'0 4',
                            border:{
                                enable:false,
                                color:'#666666'
                            },
                            fontsize:11,
                            fontweight:600,
                            color : '#4572a7'
                        },
                        border : {
                            width : 2,
                            color : '#ffffff'
                        }
                    },
                    offset_angle:-90,
                    showpercent:true,
                    decimalsnum:0,
                    width : 448,
                    height : 340,
                    radius:80
                });
                chart.draw();
            });


            var gender = jo.historyTail.gender;
            $(function(){
                var data = [];
                for(var i=0;i<gender.length;i++){
                    var colors = ['#fedd74','#82d8ef','#f76864','#80bd91'];
                    var num = (parseFloat(gender[i].percent)*100).toFixed(0);
                    if(num>0){
                        data.push({
                            name:gender[i].name,
                            value:num,
                            color:colors[i]
                        })
                    }
                }
                var chart = new iChart.Donut2D({
                    render : 'sexDiv',
                    center:{
                        text:'男女分布',
                        shadow:true,
                        shadow_offsetx:0,
                        shadow_offsety:2,
                        shadow_blur:2,
                        shadow_color:'#b7b7b7',
                        color:'#6f6f6f'
                    },
                    data: data,
                    offsetx:-60,
                    shadow:true,
                    background_color:'#fff',
                    separate_angle:10,//分离角度
                    tip:{
                        enable:true,
                        showType:'fixed'
                    },
                    legend : {
                        enable : true,
                        shadow:true,
                        background_color:null,
                        border:false,
                        legend_space:30,//图例间距
                        line_height:10,//设置行高
                        sign_space:10,//小图标与文本间距
                        sign_size:17,//小图标大小
                        color:'#6f6f6f',
                        fontsize:17//文本大小
                    },
                    sub_option : {
                        label : {
                            background_color:null,
                            sign:false,//设置禁用label的小图标
                            padding:'0 4',
                            border:{
                                enable:false,
                                color:'#666666'
                            },
                            fontsize:11,
                            fontweight:600,
                            color : '#4572a7'
                        },
                        border : {
                            width : 2,
                            color : '#ffffff'
                        }
                    },
                    offset_angle:-90,
                    showpercent:true,
                    decimalsnum:0,
                    width : 448,
                    height : 340,
                    radius:80
                });
                chart.draw();
            });

            var star = jo.historyTail.star;
            $(function(){
                var data = [];
                var colors = ['#fedd74','#82d8ef','#f76864','#80bd91','#84f61a','#dd962c','#a59a20','#609033','#7b0ab6'
                    ,'#5cb6ea','#F209DE','#E0750e'
                ];
                for(var i=0;i<star.length;i++){
                    var color = getRandomColor();
                    var num = (parseFloat(star[i].percent)*100).toFixed(0);
                    if(num>0){
                        data.push({
                            name:star[i].name,
                            value:num,
                            color:colors[i]
                        })
                    }
                }
                var chart = new iChart.Donut2D({
                    render : 'starDiv',
                    center:{
                        text:'星座',
                        shadow:true,
                        shadow_offsetx:0,
                        shadow_offsety:2,
                        shadow_blur:2,
                        shadow_color:'#b7b7b7',
                        color:'#6f6f6f'
                    },
                    data: data,
                    offsetx:-50,
                    shadow:true,
                    background_color:'#fff',
                    separate_angle:10,//分离角度
                    tip:{
                        enable:true,
                        showType:'fixed'
                    },
                    legend : {
                        enable : true,
                        shadow:true,
                        background_color:null,
                        border:false,
                        legend_space:30,//图例间距
                        line_height:10,//设置行高
                        sign_space:10,//小图标与文本间距
                        sign_size:17,//小图标大小
                        color:'#6f6f6f',
                        fontsize:17//文本大小
                    },
                    sub_option : {
                        label : {
                            background_color:null,
                            sign:false,//设置禁用label的小图标
                            padding:'0 4',
                            border:{
                                enable:false,
                                color:'#666666'
                            },
                            fontsize:11,
                            fontweight:600,
                            color : '#4572a7'
                        },
                        border : {
                            width : 2,
                            color : '#ffffff'
                        }
                    },
                    offset_angle:-90,
                    showpercent:true,
                    decimalsnum:0,
                    width : 448,
                    height : 340,
                    radius:80
                });
                chart.draw();
            });

            $scope.showDiv = true;

        }

        if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
            $scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
        }

    });
});
