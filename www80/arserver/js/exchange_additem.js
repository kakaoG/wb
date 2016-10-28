
//当前页面
function exchange_additem_(prop){
    $("#game").style["min-width"]="1000px";
    //开始方法
    function start(){
        //自己的代码
        var exchge_name=prop.exchge_name;
        $("#rolenum_list1 .rolenum_2").innerHTML=exchge_name;
    
        //打开编辑
        var rolenum_3=$("#rolenum_list3 .rolenum_3");
        rolenum_3.addEventListener("click",function(e){
           var val=$("#additem_wl_index").value;
           var val2=$("#additem_wl_index2").value;
            if(val==""){
                alert("输入物流编号");
            }else if(val2==""){
                alert("输入物流公司");
            }else{
                server.post_goods_update(prop.exchge_id,val,val2,function(data){
                    if(data.status=="success"){
                        alert('提交成功');
                    }
                });
            }
        });
        //放弃 
        var btn_cancel=$("#richangshangpin .return_btn");
        btn_cancel.addEventListener("click",function(e){
           window.setScene("exchangeshop",{state:"state1"});
        });

    }
    //销毁方法
    function destory(){
        
    }
    ajax("html/exchange_additem.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    //返回
    return {
        "type":"exchange_additem",
        destory:destory
    }
}