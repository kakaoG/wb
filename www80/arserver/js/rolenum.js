//当前页面
function rolenum_(){
    $("#game").style["min-width"]="1000px";
    //开始方法
    function start(data){
        //当前在线人数
        $("#rolenum_list1 .rolenum_2").innerHTML=data.online_person;
        //当前在线人数上限
        $("#rolenum_list2 .rolenum_2").innerHTML=data.online_person_limit;
        
        //自己的代码
        var input=$("#rolenum_pop_2 input");
        var inputVal=parseInt(data.online_person_limit);
        function checkVal(){
            inputVal=input.value;
            if(parseInt(inputVal)>=0){
                inputVal=parseInt(inputVal);
            }else{
                inputVal=0;
            }
            input.value=inputVal;
        }
        input.value=inputVal;
        input.addEventListener("blur",function(e){
           checkVal();
        });
        //打开编辑
        var rolenum_3=$("#rolenum_list2 .rolenum_3");
        rolenum_3.addEventListener("click",function(e){
           $("#rolenum_pop").style.display="block";
           $("#bottom_left .share_pop").style.display="block";
        });
        //放弃 
        var btn_cancel=$("#rolenum_pop_0 .btn_cancel");
        btn_cancel.addEventListener("click",function(e){
           $("#rolenum_pop").style.display="none";
           $("#bottom_left .share_pop").style.display="none";
        });
        //保存 
        var btn_save=$("#rolenum_pop_0 .btn_save");
        btn_save.addEventListener("click",function(e){
           checkVal();
           server.online_info_change(inputVal,function(e){
               if(e.status=="success"){
                   inputVal=parseInt(e.online_person_limit);
                   $("#rolenum_pop").style.display="none";
                   $("#bottom_left .share_pop").style.display="none";
                   $("#rolenum_list2 .rolenum_2").innerHTML=inputVal;
                   $("#rolenum_list1 .rolenum_2").innerHTML=e.online_person; 
               }
            });
        });
    }
    //销毁方法
    function destory(){
        
    }
    ajax("html/rolenum.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        server.online_info_get(function(data){
            if(data.status=="success"){
                start(data);
            }
        });
    });
    
    //返回
    return {
        "type":"rolenum",
        destory:destory
    }
}