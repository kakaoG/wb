
//当前页面
function exchange_edit_(prop){
    $("#game").style["min-width"]="1000px";
    
    function forMatime(ut){
        var d=new Date(ut);
        var year=d.getFullYear();
        var month=d.getMonth()+1;
        var day=d.getDate();
        
        if(month<10){
            month="0"+month;
        }
        if(day<10){
            day="0"+day;
        }
        //增加星期
        return year+"-"+month+"-"+day;
        
    }
    var start_end_=[];
    var start_time,end_time;
    function getstart_end(){
        start_end_=[];
        var arr1=start_time.value.split("-");
        var arr2=end_time.value.split("-");
        var times1=parseInt(new Date(parseInt(arr1[0]),
                                   parseInt(arr1[1])-1,
                                   parseInt(arr1[2]))/1000);
        var times2=parseInt(new Date(parseInt(arr2[0]),
                                   parseInt(arr2[1])-1,
                                   parseInt(arr2[2]))/1000);
        start_end_=[times1,times2];
    }
    
    
    //开始方法
    function start(){
        //自己的代码
        var data=prop.info;
        console.log(data);
        start_time=$("#start_time_edit");
        end_time=$("#end_time_edit");
    
        //兑换物品名称
        $("#exchangeedit1 .rolenum_2").innerHTML=data.goods_name;
        //兑换码
        $("#exchangeedit2 .exchangeedit_input").value=data.exchge_code;
        //兑换平台
        $("#exchangeedit3 .exchangeedit_input").value=data.exchge_platform;
        //兑换地址
        //$("#exchangeedit1 .rolenum_2").innerHTML=exchge_name;
        //兑换时间
        $("#start_time_edit").value=forMatime(data.start_time*1000);
        $("#end_time_edit").value=forMatime(data.out_time*1000);
       
        //放弃 
        var btn_cancel=$("#richangshangpin .return_btn");
        btn_cancel.addEventListener("click",function(e){
           window.setScene("exchangeshop",{state:"state3"});
        });
        
        
        //保存 
        var btn_save=$("#exchangeedit6 .rolenum_3");
        btn_save.addEventListener("click",function(e){
            var person_id=data.exchge_id;
            var exchge_code=$("#exchangeedit2 .exchangeedit_input").value;
            var exchge_platform=$("#exchangeedit3 .exchangeedit_input").value;
            var exchge_addr=$("#exchangeedit5 .exchangeedit_input").value;
            getstart_end();
            server.ticket_goods_update(person_id,exchge_code,exchge_platform,start_end_[0],start_end_[1],exchge_addr,function(data){
                if(data.status=="success"){
                    alert("信息编辑完成");
                }
            });
        });
    }
    //销毁方法
    function destory(){
        
    }
    ajax("html/exchange_edit.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    //返回
    return {
        "type":"exchange_additem",
        destory:destory
    }
}