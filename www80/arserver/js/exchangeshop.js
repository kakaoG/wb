function exchangeshop_(prop){
    $("#game").style["min-width"]="2600px";
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
        is_teamwork=$("#exchange_div2_1 .selectitem_list:nth-child(1)").getAttribute("data-key");
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
        //查询1邮寄兑换
        if(currSelect==1){
            var person_name="";//用户名称
            var person_id="";//用户id
            var person_account="";//用户账号
            var goods_name="";//物品名称
            var full_name="";//收货人
            var phone="";//联系方式
            var exchge_memo="";//物流编号
            var order_num="";//订单号
            var selectVal=$("#exchange_div2_4").value;
            if(selecttype>0){
                if(selecttype==1){
                    person_name=selectVal;//用户名称
                }else if(selecttype==2){
                    person_id=selectVal;//用户id
                }else if(selecttype==3){
                    person_account=selectVal;//用户账号
                }else if(selecttype==4){
                    goods_name=selectVal;//物品名称
                }else if(selecttype==5){
                    full_name=selectVal;//收货人
                }else if(selecttype==6){
                    phone=selectVal;//联系方式
                }else if(selecttype==7){
                    exchge_memo=selectVal;//物流编号
                }else if(selecttype==8){
                    order_num=selectVal;//订单号
                }
            }
            page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
            if(lastpage_size!=page_size){
                currPage=0;
            }
            lastpage_size=page_size;
            //兑换商列表获取	
            server.post_goods_list_get({
                "day_num":day_num,
                "start_end":start_end_,
                "exchge_status":is_teamwork,//状态
                "person_name":person_name,//用户名称
                "person_id":person_id,//用户id
                "person_account":person_account,//用户账号
                "goods_name":goods_name,//物品名称
                "full_name":full_name,//收货人
                "phone":phone,//联系方式
                "exchge_memo":exchge_memo,//物流编号
                "order_num":order_num//订单号
            },currPage,page_size,function(data){
                if(data.status=="success"){
                    total_page=parseInt(data.total_page)-1;
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
        }else if(currSelect==2){
            var person_name="";//用户名称
            var person_id="";//用户id
            var person_account="";//用户账号
            var goods_name="";//商品名称
            var merchant_name="";//兑换商名称
            var order_num="";//订单号
            var selectVal=$("#exchange_div2_4").value;

            if(selecttype>0){
                if(selecttype==1){
                    person_name=selectVal;//用户名称
                }else if(selecttype==2){
                    person_id=selectVal;//用户id
                }else if(selecttype==3){
                    person_account=selectVal;//用户账号
                }else if(selecttype==4){
                    goods_name=selectVal;//商品名称
                }else if(selecttype==5){
                    merchant_name=selectVal;//兑换商名称
                }else if(selecttype==6){
                    order_num=selectVal;//订单号
                }
            }
            page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
            if(lastpage_size!=page_size){
                currPage=0;
            }
            lastpage_size=page_size;
            //兑换商列表获取	
            server.store_goods_list_get({
                "day_num":day_num,
                "start_end":start_end_,
                "exchge_status":is_teamwork,//状态
                "person_name":person_name,//用户名称
                "person_id":person_id,//用户id
                "person_account":person_account,//用户账号
                "goods_name":goods_name,//物品名称
                "merchant_name":merchant_name,//物流编号
                "order_num":order_num//订单号
            },currPage,page_size,function(data){
                if(data.status=="success"){
                    total_page=parseInt(data.total_page)-1;
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
        }else if(currSelect==3){
            var person_name="";//用户名称
            var person_id="";//用户id
            var person_account="";//用户账号
            var goods_name="";//商品名称
            var merchant_name="";//兑换商名称
            var order_num="";//订单号
            var selectVal=$("#exchange_div2_4").value;

            if(selecttype>0){
                if(selecttype==1){
                    person_name=selectVal;//用户名称
                }else if(selecttype==2){
                    person_id=selectVal;//用户id
                }else if(selecttype==3){
                    person_account=selectVal;//用户账号
                }else if(selecttype==4){
                    merchant_name=selectVal;//商品名称
                }else if(selecttype==5){
                    order_num=selectVal;//订单号
                }
            }
            page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
            if(lastpage_size!=page_size){
                currPage=0;
            }
            lastpage_size=page_size;
            server.ticket_goods_list_get({
                "day_num":day_num,
                "start_end":start_end_,
                "exchge_status":is_teamwork,//状态
                "person_name":person_name,//用户名称
                "person_id":person_id,//用户id
                "person_account":person_account,//用户账号
                "merchant_name":merchant_name,//物品名称
                "order_num":order_num//订单号
            },currPage,page_size,function(data){
                if(data.status=="success"){
                    total_page=parseInt(data.total_page)-1;
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
        }else if(currSelect==4){
            var person_name="";//用户名称
            var person_id="";//用户id
            var person_account="";//用户账号
            var goods_name="";//商品名称
            var merchant_name="";//兑换商名称
            var order_num="";//订单号
            var selectVal=$("#exchange_div2_4").value;

            if(selecttype>0){
                if(selecttype==1){
                    person_name=selectVal;//用户名称
                }else if(selecttype==2){
                    person_id=selectVal;//用户id
                }else if(selecttype==3){
                    person_account=selectVal;//用户账号
                }else if(selecttype==4){
                    merchant_name=selectVal;//商品名称
                }else if(selecttype==5){
                    order_num=selectVal;//订单号
                }
            }

            page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
            if(lastpage_size!=page_size){
                currPage=0;
            }
            lastpage_size=page_size;
            server.exchgeRecord_list_get({
                "day_num":day_num,
                "start_end":start_end_,
                "exchge_status":is_teamwork,//状态
                "person_name":person_name,//用户名称
                "person_id":person_id,//用户id
                "person_account":person_account,//用户账号
                "merchant_name":merchant_name,//物品名称
                "order_num":order_num//订单号
            },currPage,page_size,function(data){
                if(data.status=="success"){
                    total_page=parseInt(data.total_page)-1;
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
                if(currSelect==1){
                    downloadFile("邮寄兑换.csv",text);
                }else if(currSelect==2){
                    downloadFile("实体店兑换.csv",text);
                }else if(currSelect==3){
                    downloadFile("券码兑换.csv",text);
                }else if(currSelect==4){
                   downloadFile("兑换记录.csv",text);
                }
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
        if(currSelect==1){
            $("#game").style["min-width"]="3750px";
            state1Data();
        }else if(currSelect==2){
            $("#game").style["min-width"]="3000px";
            state2Data();
        }else if(currSelect==3){
            $("#game").style["min-width"]="2350px";
            state3Data();
        }else if(currSelect==4){
            $("#game").style["min-width"]="2400px";
            state4Data();
        }
    }
     
    function state1(){
        var arr=[{
            key:"",
            value:"全部"
        },{
            key:"wait_send",
            value:"待发货"
        },{
            key:"wait_received",
            value:"待收货"
        },{
            key:"finish",
            value:"已收货"
        }];
        buildItemList(arr,$("#exchange_div2_1"),true);
        var arr=[{
            key:"0",
            value:"查询类型"
        },{
            key:"1",
            value:"用户名称"
        },{
            key:"2",
            value:"用户ID"
        },{
            key:"3",
            value:"用户账户"
        },{
            key:"4",
            value:"兑换商品名称"
        },{
            key:"5",
            value:"收货人"
        },{
            key:"6",
            value:"联系方式"
        },{
            key:"7",
            value:"物流编号"
        },{
            key:"8",
            value:"订单号"
        }];
        buildItemList(arr,$("#exchange_div2_2"),true);
        //绑定选择下拉列表
        bindSelectItem();
        
    }
    function state1Data(){
        downloadText="";
         var titleArr=["发起兑换日期","兑换日期","订单号","用户名称","用户ID","用户账号","兑换商品名称",
                     "商品价值","收货人","联系方式","收货地址","物流编号","物流公司","用户留言","状态","操作"];
        var lineW=[160,160,150,130,170,120,150,100,120,120,630,180,150,700,120,120],ws=0;
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

        var exchge_way={
            "wait_send":"待发货",
            "wait_received":"待收货",
            "finish":"已收货"
        }
        
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var shopText="",liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+forMatime(data.exc_date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.order_num+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.person_id+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.person_account+'</div>';
text+='<div class="lists" style="width:'+lineW[6]+'px;">'+data.goods_name+'</div>';
text+='<div class="lists" style="width:'+lineW[7]+'px;">'+data.goods_price+'</div>';
text+='<div class="lists" style="width:'+lineW[8]+'px;">'+data.full_name+'</div>';
text+='<div class="lists" style="width:'+lineW[9]+'px;">'+data.phone+'</div>';
text+='<div class="lists" style="width:'+lineW[10]+'px;">'+data.address+'</div>';
text+='<div class="lists" style="width:'+lineW[11]+'px;">'+data.exchge_memo+'</div>';
            
            text+='<div class="lists" style="width:'+lineW[12]+'px;">'+data.logistics_company+'</div>';
            text+='<div class="lists" style="width:'+lineW[13]+'px;">'+data.comments+'</div>';
            

text+='<div class="lists" style="width:'+lineW[14]+'px;">'+exchge_way[data.exchge_status]+'</div>';
            
            var display="block"; 
            if(data.exchge_status=="finish"){
                display="none"; 
            }
text+='<div class="lists listedit" style="width:'+lineW[15]+'px;"><span data-name="'+data.goods_name+'" data-key="'+data.exchge_id+'" style="display:'+display+';" class="listedit_1">编辑兑奖信息</span></div>';

            text+='</li>';
        }
        
        downloadCall=function(curr_data_list){
              var downloadText="";
              for(var i=0;i<curr_data_list.length;i++){
                var data=curr_data_list[i];
                var shopText="",liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";

                var display="block"; 
                if(data.exchge_status=="finish"){
                    display="none"; 
                }
                downloadText+=forMatime(data.date*1000)+",";
                downloadText+=forMatime(data.exc_date*1000)+",";
                downloadText+=data.order_num+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_id+",";
                downloadText+=data.person_account+",";
                downloadText+=data.goods_name+",";
                downloadText+=data.goods_price+",";
                downloadText+=data.full_name+",";
                downloadText+=data.phone+",";
                downloadText+=data.address+",";
                downloadText+=data.exchge_memo+",";

                 downloadText+=data.logistics_company+",";
                 downloadText+=data.comments+",";

                downloadText+=exchge_way[data.exchge_status]+",";
                downloadText+="\n";
                  
            }
            return downloadText;
        }
        $("#exchange_div3 ul").innerHTML=text;
        
        //绑定事件 编辑兑换商品
        var listedit_1=$("#exchange_div3 ul .listedit_1",true);
        for(var i=0;i<listedit_1.length;i++){
            listedit_1[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                var name=this.getAttribute("data-name");
                window.runListMove("exchange_additem",{
                    "exchge_name":name,
                    "exchge_id":key
                });
                
            },false);
        }
        
    }
    
    function state2(){
        var arr=[{
            key:"",
            value:"全部"
        },{
            key:"wait_received",
            value:"未兑换"
        },{
            key:"finish",
            value:"已兑换"
        }];
        buildItemList(arr,$("#exchange_div2_1"),true);
        var arr=[{
            key:"0",
            value:"查询类型"
        },{
            key:"1",
            value:"用户名称"
        },{
            key:"2",
            value:"用户ID"
        },{
            key:"3",
            value:"用户账户"
        },{
            key:"4",
            value:"兑换商品名称"
        },{
            key:"5",
            value:"兑换商"
        },{
            key:"6",
            value:"订单号"
        }];
        buildItemList(arr,$("#exchange_div2_2"),true);
        //绑定选择下拉列表
        bindSelectItem();
        
        
    }
    function state2Data(){
        downloadText="";
         var titleArr=["发起兑换日期","兑换日期","订单号","用户名称","用户ID","用户账号","用户姓名","用户电话","兑换商品名称",
                     "兑换码","兑换商","兑换地址","商家联系电话","状态"];
        var lineW=[160,160,140,140,200,140,150,150,140,100,140,630,140,120],ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
//        {
//     "date":兑换日期时间戳
//     "order_num":订单号,
//     "person_name":用户名称,
//     "person_id":用户ID
//     "person_account":用户账号,
//     "goods_name":商品名称
//     "exchge_code":兑换码
//     "merchant_name":兑换商名称
//     "phone":联系方式
//     "address":兑换地址
//     "exchge_status":兑换状态，wait_send/待发货|待发放，wait_received 待收货|未兑换，finish /已收货|已兑换
//    },
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;">'+val+'</div>';
            if(i<titleArr.length){
                downloadText+=val+",";
            }
        }
        text+='</li>';
        downloadText+="\n";
        
        var exchge_way={
            "wait_send":"券码未领取",
            "wait_received":"券码已领取",
            "finish":"券码已兑换"
        }
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var shopText="",liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+forMatime(data.exc_date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.order_num+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.person_id+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.person_account+'</div>';
text+='<div class="lists" style="width:'+lineW[6]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[7]+'px;">'+data.person_phone+'</div>';
text+='<div class="lists" style="width:'+lineW[8]+'px;">'+data.goods_name+'</div>';
text+='<div class="lists" style="width:'+lineW[9]+'px;">'+data.exchge_code+'</div>';
text+='<div class="lists" style="width:'+lineW[10]+'px;">'+data.merchant_name+'</div>';
text+='<div class="lists" style="width:'+lineW[11]+'px;">'+data.address+'</div>';
text+='<div class="lists" style="width:'+lineW[12]+'px;">'+data.merchant_phone+'</div>';
text+='<div class="lists" style="width:'+lineW[13]+'px;">'+exchge_way[data.exchge_status]+'</div>';

            text+='</li>';
        }
        
        downloadCall=function(curr_data_list){
            var downloadText="";
              for(var i=0;i<curr_data_list.length;i++){
                var data=curr_data_list[i];
                var shopText="",liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
                downloadText+=forMatime(data.date*1000)+",";
                downloadText+=forMatime(data.exc_date*1000)+",";
                downloadText+=data.order_num+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_id+",";
                downloadText+=data.person_account+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_phone+",";
                downloadText+=data.goods_name+",";
                downloadText+=data.exchge_code+",";
                downloadText+=data.merchant_name+",";
                downloadText+=data.address+",";
                downloadText+=data.merchant_phone+",";
                downloadText+=exchge_way[data.exchge_status]+",";
                downloadText+="\n";
            }
            return downloadText;
            
        }
        $("#exchange_div3 ul").innerHTML=text;
        
    }
    
    function state3(){
        //状态，wait_send/待发货|待发放，wait_received待收货|未兑换，finish/已收货|已兑换

        var arr=[{
            key:"",
            value:"全部"
        },{
            key:"wait_received",
            value:"未兑换"
        },{
            key:"finish",
            value:"已兑换"
        }];
        buildItemList(arr,$("#exchange_div2_1"),true);
        var arr=[{
            key:"0",
            value:"查询类型"
        },{
            key:"1",
            value:"用户名称"
        },{
            key:"2",
            value:"用户ID"
        },{
            key:"3",
            value:"用户账户"
        },{
            key:"4",
            value:"兑换商品名称"
        },{
            key:"6",
            value:"订单号"
        }];
        buildItemList(arr,$("#exchange_div2_2"),true);
        //绑定选择下拉列表
        bindSelectItem();
        
        
    }
    function state3Data(){
        downloadText="";
         var titleArr=["发起兑换日期","兑换日期","订单号","用户名称","用户ID","用户账号","用户姓名","用户电话","兑换商品名称",
                     "兑换码","兑换平台","有效时间","状态","操作"];
        var lineW=[160,160,140,140,180,140,150,150,140,100,100,250,100,120],ws=0;
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
         var exchge_way={
            "wait_received":"券码未领取",
            "finish":"券码已领取",
            "wait_send":"券码待发放"
        }
         
         for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var shopText="",liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+forMatime(data.exc_date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.order_num+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.person_id+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.person_account+'</div>';
             
text+='<div class="lists" style="width:'+lineW[6]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[7]+'px;">'+data.person_phone+'</div>';
             
text+='<div class="lists" style="width:'+lineW[8]+'px;">'+data.goods_name+'</div>';
text+='<div class="lists" style="width:'+lineW[9]+'px;">'+data.exchge_code+'</div>';
text+='<div class="lists" style="width:'+lineW[10]+'px;">'+data.exchge_platform+'</div>';
text+='<div class="lists" style="width:'+lineW[11]+'px;">'+forMatime(data.start_time*1000)+" 到 "+forMatime(data.out_time*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[12]+'px;">'+exchge_way[data.exchge_status]+'</div>';
text+='<div class="lists listedit" style="width:'+lineW[13]+'px;"><span data-index="'+i+'"   class="listedit_1">编辑兑奖信息</span></div>';
            text+='</li>';
        }
         downloadCall=function(curr_data_list){
              var downloadText="";
             for(var i=0;i<curr_data_list.length;i++){
                var data=curr_data_list[i];
                var shopText="",liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
                downloadText+=forMatime(data.date*1000)+",";
                downloadText+=forMatime(data.exc_date*1000)+",";
                downloadText+=data.order_num+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_id+",";
                downloadText+=data.person_account+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_phone+",";
                downloadText+=data.goods_name+",";
                downloadText+=data.exchge_code+",";
                downloadText+=data.exchge_platform+",";
                downloadText+=forMatime(data.start_time*1000)+" 到 "+forMatime(data.out_time*1000)+",";
                downloadText+=exchge_way[data.exchge_status]+",";
                downloadText+="\n";
            }
             return downloadText;
            
        }
        $("#exchange_div3 ul").innerHTML=text;
        //绑定事件 编辑兑换商品
        var listedit_1=$("#exchange_div3 ul .listedit_1",true);
        for(var i=0;i<listedit_1.length;i++){
            listedit_1[i].addEventListener("click",function(){
                var info=curr_data_list[this.getAttribute("data-index")];
                window.runListMove("exchange_edit",{
                    "info":info
                });
            },false);
        }
    }
    
     function state4(){
        var arr=[{
            key:"",
            value:"全部"
        },{
            key:"ticket",
            value:"团购券"
        },{
            key:"store",
            value:"实体店"
        },{
            key:"post",
            value:"邮寄"
        }];
        buildItemList(arr,$("#exchange_div2_1"),true);
        var arr=[{
            key:"0",
            value:"查询类型"
        },{
            key:"1",
            value:"用户名称"
        },{
            key:"2",
            value:"用户ID"
        },{
            key:"3",
            value:"用户账户"
        },{
            key:"4",
            value:"兑换商品名称"
        },{
            key:"6",
            value:"订单号"
        }];
        buildItemList(arr,$("#exchange_div2_2"),true);
        //绑定选择下拉列表
        bindSelectItem();
        
        
    }
    
    function state4Data(){
        downloadText="";
         var titleArr=["发起兑换日期","兑换日期","订单号","兑换用户","用户ID","用户账号","兑换商品名称",
                     "商品ID","商品价值","兑奖方式","商品成本价","获得途径"];   
        var lineW=[160,160,140,140,200,160,160,200,100,100,200,200],ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
        var exchge_way={
            "post":"邮寄",
            "store":"实体店",
            "ticket":"团购券",
        }
         var get_way={
            "egg":"幸运蛋库",
            "gold":"基金库",
            "dgt":"日常商品库",
        }
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;">'+val+'</div>';
            if(i<titleArr.length){
                downloadText+=val+",";
            }
        }
        text+='</li>';
        downloadText+="\n";
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var shopText="",liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+forMatime(data.exc_date*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.order_num+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.person_name+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.person_id+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.person_account+'</div>';
text+='<div class="lists" style="width:'+lineW[6]+'px;">'+data.goods_name+'</div>';
text+='<div class="lists" style="width:'+lineW[7]+'px;">'+data.goods_id+'</div>';
text+='<div class="lists" style="width:'+lineW[8]+'px;">'+data.price+'</div>';
text+='<div class="lists" style="width:'+lineW[9]+'px;">'+exchge_way[data.exchge_way]+'</div>';
text+='<div class="lists" style="width:'+lineW[10]+'px;">'+data.init_price+'</div>';//途径
text+='<div class="lists" style="width:'+lineW[11]+'px;">'+get_way[data.get_way]+'</div>';

            text+='</li>';
        }
        downloadCall=function(curr_data_list){
            var downloadText="";
             for(var i=0;i<curr_data_list.length;i++){
                var data=curr_data_list[i];
                var shopText="",liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
                 downloadText+=forMatime(data.date*1000)+",";
                 downloadText+=forMatime(data.exc_date*1000)+",";
                downloadText+=data.order_num+",";
                downloadText+=data.person_name+",";
                downloadText+=data.person_id+",";
                downloadText+=data.person_account+",";
                downloadText+=data.goods_name+",";
                downloadText+=data.goods_id+",";
                downloadText+=data.price+",";
                downloadText+=exchge_way[data.exchge_way]+",";
                downloadText+=data.init_price+",";
                downloadText+=get_way[data.get_way]+",";
                downloadText+="\n";
            }
            return downloadText;
        }
        $("#exchange_div3 ul").innerHTML=text;
    }
    
    var currSelect="";
    function setSelect(type){
        currSelect=type;
        for(var i=1;i<=4;i++){
            var dom=$("#exchange_div1_"+i);
            if(i==type){
                dom.style["background-color"]="#3e97d3";
                dom.style["color"]="white";
            }else{
                dom.style["background-color"]="inherit";
                dom.style["color"]="#3e97d3";
            }
        }
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
        $("#exchange_div1_1").addEventListener("click",function(){
            setSelect(1);
        },false);
         $("#exchange_div1_2").addEventListener("click",function(){
            setSelect(2);
        },false);
         $("#exchange_div1_3").addEventListener("click",function(){
            setSelect(3);
        },false);
         $("#exchange_div1_4").addEventListener("click",function(){
            setSelect(4);
        },false);
        if(prop){
            if(prop.state=="state1"){
                setSelect(1);
            }else if(prop.state=="state2"){
                setSelect(2);
            }else if(prop.state=="state3"){
                setSelect(3);
            }else if(prop.state=="state4"){
                setSelect(4);
            }else{
                setSelect(1);
            } 
        }else{
            setSelect(1);
        }
    }
    ajax("html/exchangeshop.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    return {
        destory:destory
    }
}