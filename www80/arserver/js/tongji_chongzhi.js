function tongji_chongzhi_(prop){
    $("#game").style["min-width"]="2300px";
    function destory(){
        
    }
    var downloadText="";
    var downloadCall=function(){
        return "";
    }
    //每页数量，如果数量发生改变就从第一页开始
    var page_size=10,lastpage_size=0;
    var currPage=0,total_page=0;
    var day_num=-1,day_text="全部";
    var start_end_=[];
    var start_time,end_time;
    //默认是 合作状态
    var is_teamwork="true";
    //当前查询的数据
    var curr_data_list=[];
    //当前打开状态
    var currOpenEdit="update";
    var merchant_id="";
    //获取时间戳
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
    //查找
    function updatesearch(isAlert){
        //状态
        //查询类型
        var selecttype=$("#exchange_div2_2 .selectitem_list:nth-child(1)").getAttribute("data-key");
        //更新时间和日期 layer_datatimeVal
        $(".layer_datatimeVal span:nth-child(1)").innerHTML=day_text;
        var val="";
        if(start_time.value!="" && end_time.value!=""){
            val=start_time.value+" - "+end_time.value;
        }
        $(".layer_datatimeVal span:nth-child(2)").innerHTML=val;
        
        selecttype=parseInt(selecttype);

        var display_name="";
        var account="";
        var pay_type="";
        var transaction_id="";
        var order_id="";
        var selectVal=$("#exchange_div2_4").value;
        if(selecttype>0){
            if(selecttype==1){
                display_name=selectVal;//用户昵称
            }else if(selecttype==2){
                account=selectVal;//用户账号
            }else if(selecttype==3){
                pay_type=selectVal;//充值渠道
            }else if(selecttype==4){
                transaction_id=selectVal;//平台订单号
            }else if(selecttype==5){
                order_id=selectVal;//商户订单号
            }
        }
        page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
        if(lastpage_size!=page_size){
            currPage=0;
        }
        lastpage_size=page_size;

        //兑换商列表获取	
        server.p_manage_recharge_count({
            "day_num":day_num,
            "start_end":start_end_,
             "display_name":display_name,//用户昵称
             "account":account,//用户账号
             "pay_type":pay_type,//充值渠道,"wechat"/微信支付,"alipay"/支付宝支付
             "transaction_id":transaction_id,//平台订单号
             "order_id":order_id //商户订单号
        },currPage,page_size,function(data){
            if(data.status=="success"){
                total_page=parseInt(data.total_num)-1;
                if(total_page<0){
                    total_page=0;
                }
                pageState.show();
                curr_data_list=data.result;
                //生产数据
                buildDataList();
                if(curr_data_list.length==0 && isAlert){
                    alert("没有查询到信息");
                }
            }
        });

    }
    //当前页面状态
    var pageState={
        last:function(){
            currPage--;
            if(currPage<0){
                currPage=0;
            }
            this.show();
            updatesearch();
        },
        next:function(){
            currPage++;
            if(currPage>total_page){
                currPage=total_page;
            }
            this.show();
            updatesearch();
        },
        show:function(){
            $("#exchange_div4_4_4").innerHTML=" / "+(total_page+1);
            $("#exchange_div4_4_3").value=currPage+1;
           
            if(currPage==0){
                $("#exchange_div4_4_1").src="img/page_return_no.png";
            }else{
                $("#exchange_div4_4_1").src="img/page_return.png";
            }
            if(total_page==0){
                $("#exchange_div4_4_2").src="img/page_go_no.png";
            }else{
                $("#exchange_div4_4_2").src="img/page_go.png";
            }
            if(currPage==total_page){
                $("#exchange_div4_4_2").src="img/page_go_no.png";
            }
        }
    }
     
     function buildItemList(arr,dom,isChange){
        var listtext="";
        for(var i=0;i<arr.length;i++){
            var list=arr[i];
            listtext+='<div class="selectitem_list" data-key="'+list.key+'"  data-value="'+list.value+'">';
            listtext+='<span>'+list.value+'</span>';
            if(i==0){
                listtext+='<img src="img/icon_arrow_down.png" class="icon_arrow_down">';
            }
            listtext+='</div>';
        }
        dom.innerHTML=listtext;
        dom.style.overflow="hidden";
        if(isChange){
            dom.setAttribute("data-change","ok");
        }
    }
    
    
   
    function selecttime(){
       var iszhan=false;
        var valdiv=$("#gamebottomdiv .layer_datatimeVal");
        var valdiv1=$("#gamebottomdiv .layer_datatimeVal1");
        function iconState(){
            var icon=valdiv.querySelector(".arrow_icon");
            iszhan=!iszhan;
            if(!iszhan){
                icon.style["-webkit-transform"]="rotate(180deg)";
                icon.style["transform"]="rotate(180deg)";
                valdiv1.style.display="none";
            }else{
                icon.style["-webkit-transform"]="rotate(-90deg)";
                icon.style["transform"]="rotate(-90deg)";
                valdiv1.style.display="block";
            }
        }
        //展开
        valdiv.addEventListener("click",function(){
            iconState();
        },false);
        
        //取消
        var datatime_div3_1=$("#gamebottomdiv .datatime_div3_1");
        datatime_div3_1.addEventListener("click",function(e){
            iconState();
        });
        //选择时间
        var datatime_div3_2=$("#gamebottomdiv .datatime_div3_2");
        datatime_div3_2.addEventListener("click",function(e){
            //获取当前时间
            if(start_time.value==""){
                alert("选择开始时间");
            }else if(end_time.value==""){
                 alert("选择结束时间");
            }else{
                getstart_end();
                iconState();
                updatesearch();
            }
        });
        //选择查询天数 
        var spans=$(".datatime_div1 span",true);
        for(var i=0;i<spans.length;i++){
            spans[i].addEventListener("click",function(e){
                var val=parseInt(this.getAttribute("data-key"));
                day_num=val;
                day_text=this.innerHTML;
                iconState();
                updatesearch();
            });
        }
        
         //下载 
        var exchange_div4_3=$("#exchange_div4_3");
        exchange_div4_3.addEventListener("click",function(e){
            doLastSend(function(data){
                var text=downloadText;
                if(data.status=="success"){
                    text+=downloadCall(data.result);
                }
                downloadFile("充值统计.csv",text);
           });
        });
        
        
        //日期
        start_time=$("#start_time");
        end_time=$("#end_time");
        
         //上一页
        var last=$("#exchange_div4_4_1");
        last.addEventListener("click",function(e){
           pageState.last();
        });
        //下一页
        var next=$("#exchange_div4_4_2");
        next.addEventListener("click",function(e){
           pageState.next();
        });
        //显示
        pageState.show();
        
    }
    
    function bindSelectItem(){
        //选项
        var selectitems=$("#gamebottomdiv .selectitem",true);
        for(var i=0;i<selectitems.length;i++){
            var item=selectitems[i];
            item.addEventListener("click",function(e){
                var icon_arrow_down=this.querySelector(".icon_arrow_down");
                var targetdom=e.target;
                var className=targetdom.className;
                if(className!="selectitem_list"){
                    if(e.target.parentElement && e.target.parentElement.className){
                        targetdom=e.target.parentElement;
                        className=targetdom.className;
                    }
                }
                //默认dom
                var dom=this.querySelector(".selectitem_list:nth-child(1)");
                var iszhan=dom.getAttribute("zhankai");
                //当前的内容
                var key1=dom.getAttribute("data-key");
                var value1=dom.getAttribute("data-value");
                //替换的内容
                var key=targetdom.getAttribute("data-key");
                var value=targetdom.getAttribute("data-value");
                
                if(iszhan!="ok"){
                    dom.setAttribute("zhankai","ok");
                    this.style.overflow="inherit";
                    icon_arrow_down.style["transform"]="rotate(0deg)";
                    icon_arrow_down.style["-webkit-transform"]="rotate(0deg)";
                }else{
                    dom.setAttribute("zhankai","no");
                    this.style.overflow="hidden";
                    icon_arrow_down.style["transform"]="rotate(-90deg)";
                    icon_arrow_down.style["-webkit-transform"]="rotate(-90deg)";
             
                    if(className=="selectitem_list" && key!=undefined && key1!=undefined){
                        dom.setAttribute("data-key",key);
                        dom.setAttribute("data-value",value);
                        dom.querySelector("span").innerHTML=value;
                        
                        targetdom.setAttribute("data-key",key1);
                        targetdom.setAttribute("data-value",value1);
                        targetdom.querySelector("span").innerHTML=value1;
                        
                        //如果是修改change，则查询
                        if(this.getAttribute("data-change")=="ok"){
                            currPage=0;
                            updatesearch();
                        }
                    }
                }
            });
        }
    }
    function forMatime(ut){
        var d=new Date(ut);
        var year=d.getFullYear();
        var month=d.getMonth()+1;
        var day=d.getDate();
        var shi=d.getHours();
        var fen=d.getMinutes();
        if(month<10){
            month="0"+month;
        }
        if(day<10){
            day="0"+day;
        }
        if(shi<10){
            shi="0"+shi;
        }
        if(fen<10){
            fen="0"+fen;
        }
        //增加星期
        return year+"-"+month+"-"+day+" "+shi+":"+fen;
        
    }
    
    
    //显示数据
    function buildDataList(){
        state1Data();
    }
     
    function state1(){
        var arr=[{
            key:"",
            value:" "
        }];
        buildItemList(arr,$("#exchange_div2_1"));
        $("#exchange_div2_1").style.display="none";
        $("#exchange_div2_2").style.left="0px";
        $("#exchange_div2_4").style.left="120px";
        $("#exchange_div2_5").style.left="270px";
        var arr=[{
            key:"0",
            value:"全部"
        },{
            key:"1",
            value:"用户昵称"
        },{
            key:"2",
            value:"用户账号"
        },{
            key:"3",
            value:"充值渠道"
        },{
            key:"4",
            value:"平台订单号"
        },{
            key:"5",
            value:"商品订单号"
        }];
        buildItemList(arr,$("#exchange_div2_2"),true);
        //绑定选择下拉列表
        bindSelectItem();
        
    }
    function state1Data(){
        downloadText="";
         var titleArr=["充值日期","用户昵称","用户账号","用户ID","充值渠道","平台订单号",
                     "商品订单号","充值金额(元)","充值状态","操作"];
        var lineW=[120,200,200,200,200,250,200,150,200,200],ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;">'+val+'</div>';
            if(i<titleArr.length-1){
                downloadText+=val+",";
            }
        }
        text+='</li>';
        downloadText+="\n";

        var pay_type={
            "wechat":"微信支付",
            "alipay":"支付宝支付"
        }
        var status={
            "finish_pay":"充值成功"
        }

        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var shopText="",liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+data.display_name+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.account+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.person_id+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+pay_type[data.pay_type]+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.transaction_id+'</div>';
text+='<div class="lists" style="width:'+lineW[6]+'px;">'+data.order_id+'</div>';
text+='<div class="lists" style="width:'+lineW[7]+'px;">'+data.RMB+'</div>';

var isChengg=false;
if(status[data.status]){
    isChengg=true;
}
            
text+='<div class="lists" style="width:'+lineW[8]+'px;color:'+(isChengg?"#3e97d3":"red")+';">'+(isChengg?"充值成功":"充值失败")+'</div>';
text+='<div class="lists" style="width:'+lineW[9]+'px;"><span data-person_id="'+data.person_id+'" class="listedit_1" style="color:'+(isChengg?"#3e97d3":"#3e97d3")+';">'+(isChengg?"---":"---")+'</span></div>';

            text+='</li>';
        }
        downloadCall=function(curr_data_list){
              var downloadText="";
              for(var i=0;i<curr_data_list.length;i++){
                var data=curr_data_list[i];
                var shopText="",liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
    var isChengg=false;
    if(status[data.status]){
        isChengg=true;
    }
                downloadText+=forMatime(data.date*1000)+",";
                downloadText+=data.display_name+",";
                downloadText+=data.account+",";
                downloadText+=data.person_id+",";
                downloadText+=pay_type[data.pay_type]+",";
                downloadText+=data.transaction_id+",";
                downloadText+=data.order_id+",";
                downloadText+=data.RMB+",";
                downloadText+=(isChengg?"充值成功":"充值失败");

                downloadText+="\n";
            }
            return downloadText;
        }
        $("#exchange_div3 ul").innerHTML=text;
        
//        //绑定事件 编辑兑换商品
//        var listedit_1=$("#exchange_div3 ul .listedit_1",true);
//        for(var i=0;i<listedit_1.length;i++){
//            listedit_1[i].addEventListener("click",function(){
//                var person_id=this.getAttribute("data-person_id");
//                $("#rolenum_pop_1").innerHTML="补发金币";
//                $("#rolenum_pop").style.display="block";
//                $("#bottom_left .share_pop").style.display="block";
//
//            },false);
//        }
        
    }
    
    var currSelect="";
    function setSelect(type){
        currSelect=type;
        var text="";
        text+='<div id="exchange_div2_1" class="selectitem"></div>';
        text+='<div id="exchange_div2_2" class="selectitem">';
           text+='<div class="selectitem_list">';
                text+='<span>查询类型</span>';
                text+='<img src="img/icon_arrow_down.png" class="icon_arrow_down">';
            text+='</div>';
        text+='</div>';
        text+='<input id="exchange_div2_4" type="text" placeholder="输入内容搜索">';
        text+='<div id="exchange_div2_5">查询</div>';
        $("#exchange_div2").innerHTML=text;
        
        
        
        var text="";
        text+='<div id="exchange_div4_1" class="selectitem">';
        text+='</div>';
        $("#exchange_div4_1_div").innerHTML=text;
        
        //页面 
        var arr=[{
            key:"7",
            value:"7"
        },{
            key:"10",
            value:"10"
        },{
            key:"20",
            value:"20"
        }];
        buildItemList(arr,$("#exchange_div4_1"),true); 
        
         //点击查询按钮 
        var exchange_div2_5=$("#exchange_div2_5");
        exchange_div2_5.addEventListener("click",function(e){
            currPage=0;
            updatesearch(true);
        });
        
        
        if(type==1){
            state1();
        }else if(type==2){
            state2();
        }else if(type==3){
            state3();
        }else if(type==4){
            state4();
        }
        currPage=0;
        updatesearch();
    }
    
    function start(){
        //选择时间
        selecttime();
        setSelect(1);
        
         //放弃 
        var btn_cancel=$("#rolenum_pop_0 .btn_cancel");
        btn_cancel.addEventListener("click",function(e){
           $("#rolenum_pop").style.display="none";
           $("#bottom_left .share_pop").style.display="none";
        });
        //保存 
        var btn_save=$("#rolenum_pop_0 .btn_save");
        btn_save.addEventListener("click",function(e){
            $("#rolenum_pop").style.display="none";
           $("#bottom_left .share_pop").style.display="none";
//            
// server.merchant_add_update(currOpenEdit,merchant_name,merchant_addr,phone,merchant_id,function(data){
//                if(data.status=="success"){
//                    $("#rolenum_pop").style.display="none";
//                    $("#bottom_left .share_pop").style.display="none";
//                    //从新显示
//                    currPage=0;
//                    updatesearch();
//                }
//             });
        });
    }
    ajax("html/tongji_chongzhi.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    return {
        destory:destory
    }
}