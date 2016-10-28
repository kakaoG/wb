//当前页面
function exchange_item_(){
    $("#game").style["min-width"]="1000px";
    //开始方法
    function start(){
        //自己的代码
        var rolenum_3=$("#rolenum_list2 .rolenum_3");
        rolenum_3.addEventListener("click",function(e){
            var val=$("#additem_wl_index").value;
            var val1=$("#additem_wl_index1").value;
            if(val==""){
                alert("账户不能为空");
            }else if(val1==""){
                alert("兑换码不能为空");
            }else{
                server.store_goods_exchge(val,val1,function(data){
                    if(data.status=="success"){
                        alert("兑换成功");
                    }
                });
            }
            
        });

    }
    //销毁方法
    function destory(){
        
    }
    ajax("html/exchange_item.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    //返回
    return {
        "type":"exchange_item",
        destory:destory
    }
}