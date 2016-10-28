function jijin_130_(){
    $("#game").style["min-width"]="1100px";
    function destory(){
        
    }
    var event_list={};
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
    var downloadText="";
    var downloadCall=function(){
        return "";
    }
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
        var selecttype=0;
        //更新时间和日期 layer_datatimeVal
        $(".layer_datatimeVal span:nth-child(1)").innerHTML=day_text;
        var val="";
        if(start_time.value!="" && end_time.value!=""){
            val=start_time.value+" - "+end_time.value;
        }
        $(".layer_datatimeVal span:nth-child(2)").innerHTML=val;
        
        var event_name=is_teamwork;

        var selectVal=$("#exchange_div2_4").value;
        if(selectVal!=""){
            event_name=selectVal;
        }
       
        
        page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
        if(lastpage_size!=page_size){
            currPage=0;
        }
        lastpage_size=page_size;
        //兑换商列表获取	
        server.poolRecord_search_fund({
            "day_num":day_num,
            "start_end":start_end_,
            "event_name":event_name
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
                
                $("#gamebottomdiv .layer_title .allcoin").innerHTML=data.current_money;
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
//          curr_data_list=[
//            {
//        "current_money": 24013.7,
//        "event": "inject_action",
//        "event_name": "注入行为池",
//        "money_change": "+6000",
//        "ut": 1474094552
//      }
//              
//        ];
        
        var changes=0;
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            changes+=data.money*1000;
        }
        changes=changes/1000;
        if(changes>0){
            changes="+"+changes;
        }
        curr_data_list.push({
            isend:true,
            heji:"",
            val:""
        });
        
        curr_data_list.push({
            isend:true,
            heji:"合计",
            val:changes
        });
        
        
        var titleArr=["日期","明细查询","行为事件","金额变化","当前金额"];
        var lineW=[180,200,200,150,150],ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
        downloadText="";
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;">'+val+'</div>';
            downloadText+=val+",";
        }
        text+='</li>';
        downloadText+="\n";
        
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            var liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
            if(data.isend){
                text+='<div class="lists" style="width:'+lineW[0]+'px;">'+data.heji+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;"></div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;"></div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.val+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;"></div>';
            }else{
                text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.ut*1000)+'</div>';
text+='<div class="lists listedit" data-key="'+data.event+'" style="width:'+lineW[1]+'px;"><span>查看</span></div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.event_name+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.money_change+'</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.current_money+'</div>';

            }
            text+='</li>';
          
        }
        downloadCall=function(curr_data_list){
              var downloadText="";
                var text="";
               for(var i=0;i<curr_data_list.length;i++){
                    var data=curr_data_list[i];
                    var liheight=40;
                    var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                    var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
        text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
                    if(data.isend){
                        text+='<div class="lists" style="width:'+lineW[0]+'px;">'+data.heji+'</div>';
        text+='<div class="lists" style="width:'+lineW[1]+'px;"></div>';
        text+='<div class="lists" style="width:'+lineW[2]+'px;"></div>';
        text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.val+'</div>';
        text+='<div class="lists" style="width:'+lineW[4]+'px;"></div>';
                        downloadText+=data.heji+",,,";
                        downloadText+=data.val+",";
                    }else{
                        text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.ut*1000)+'</div>';
        text+='<div class="lists listedit" data-key="'+data.event+'" style="width:'+lineW[1]+'px;"><span>查看</span></div>';
        text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.event_name+'</div>';
        text+='<div class="lists" style="width:'+lineW[3]+'px;">'+data.money_change+'</div>';
        text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.current_money+'</div>';
                        downloadText+=forMatime(data.ut*1000)+",";
                        downloadText+="查看,";
                        downloadText+=data.event_name+",";
                        downloadText+=data.money_change+",";
                        downloadText+=data.current_money+",";
                    }
                    text+='</li>';

                    downloadText+="\n";
                }
            return downloadText;
        }
        
        $("#exchange_div3 ul").innerHTML=text;
        
 
   
         var eventType={
            "pay": "jijin_132",//用户消费价值
            "inject": "jijin_133",//盈亏池注入
            "piece": "jijin_131" //碎片投放
        }
         //取消合作
        var listedit_2=$("#exchange_div3 ul .listedit",true);
        for(var i=0;i<listedit_2.length;i++){
            listedit_2[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                //用户类型
                window.runListMove(eventType[key],{

                });
            },false);
        }
    }
    
    function start(){
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
        
        //关闭名字列表
        var breakbtn=$("#exchange_name_list_break");
        breakbtn.addEventListener("click",function(e){
            $("#exchange_name_list").style.display="none";
        });
        
        //下载 
        var exchange_div4_3=$("#exchange_div4_3");
        exchange_div4_3.addEventListener("click",function(e){
            doLastSend(function(data){
                var text=downloadText;
                if(data.status=="success"){
                    text+=downloadCall(data.result);
                }
                downloadFile("基金池.csv",text);
           });
            
        });
        
        
        //日期
        start_time=$("#start_time");
        end_time=$("#end_time");
        
         var arr=[{
            key:"",
            value:"全部"
        }];
        for(var i in event_list){
            arr.push({
                key:i,
                value:i
            });
        }
        
        buildItemList(arr,$("#exchange_div2_1"),true);
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
        updatesearch();
        
        //添加新事件
        var openType=1;
    
        
        bindSelectItem();
    }
    ajax("html/jijin_130.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
                
        server.pool_gain_events("pool_fund",function(data){
            event_list={};
            if(data.event_list){
                event_list=data.event_list;
            }
            start();
         });
        
    });
    
    return {
        destory:destory
    }
}