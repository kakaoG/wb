function exchangebus_(){
    $("#game").style["min-width"]="1400px";
    function destory(){
        
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
        var merchant_name="";
        var meichant_id="";
        var goods_name="";
        var phone="";
        var merchant_addr="";
        var selectVal=$("#exchange_div2_4").value;
        if(selecttype>0){
            if(selecttype==1){
                merchant_name=selectVal;//兑换商名称
            }else if(selecttype==2){
                meichant_id=selectVal;//兑换商ID
            }else if(selecttype==3){
                goods_name=selectVal;//提供商品
            }else if(selecttype==4){
                phone=selectVal;//联系方式
            }else if(selecttype==5){
                merchant_addr=selectVal;//兑换商地址
            }
        }
        page_size=parseInt($("#exchange_div4_1 .selectitem_list:nth-child(1)").getAttribute("data-key"));
        if(lastpage_size!=page_size){
            currPage=0;
        }
        lastpage_size=page_size;
        //兑换商列表获取	
        server.merchant_list_get({
            "day_num":day_num,
            "start_end":start_end_,
            "merchant_name":merchant_name,
            "meichant_id":meichant_id,
            "goods_name":goods_name,
            "phone":phone,
            "merchant_addr":merchant_addr,
            "is_teamwork":is_teamwork
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
        
        var titleArr=["修改日期","兑换商名称","兑换商ID","提供商品","联系方式","兑换商地址",
                     "状态","操作"];
        var lineW=[130,130,200,150,100,120,80,260],ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;">'+val+'</div>';
        }
        text+='</li>';
        for(var i=0;i<curr_data_list.length;i++){
            var data=curr_data_list[i];
            if(data.name_list.length>5){
                data.name_list=data.name_list.splice(0,5);
            }
            var shopText="",liheight=data.name_list.length*24;
            if(liheight<40){
                liheight=40;
            }
            // shop name_list
            for(var s=0;s<data.name_list.length;s++){
                var offy=(liheight-data.name_list.length*20)/2+s*20;
                shopText+='<span class="xqone" style="top:'+offy+'px;">'+(s+1)+":"+data.name_list[s].goods_name+"</span><br/>";
            }
            
            var isHezuo=data.is_teamwork=="true";
            var is_teamwork="未合作";
            var is_teamworkColor="#666666";
            if(isHezuo){
                 is_teamwork="合作中";
                 is_teamworkColor="red";
            }
            
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= i%2==0 ? "iteminfo_ji" : "iteminfo_ou";
text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
text+='<div class="lists" style="width:'+lineW[0]+'px;">'+forMatime(data.ut*1000)+'</div>';
text+='<div class="lists" style="width:'+lineW[1]+'px;">'+data.merchant_name+'</div>';
text+='<div class="lists" style="width:'+lineW[2]+'px;">'+data.merchant_id+'</div>';
text+='<div class="lists" style="width:'+lineW[3]+'px;height:'+liheight+'px;text-align:left;">';
if(data.name_list.length==0){
    text+='<div style="text-align:center;">无</div>';
}else{
    text+=shopText+'<span  data-key="'+data.merchant_id+'" class="sayxq">查看详情</span>';
}
text+='</div>';
text+='<div class="lists" style="width:'+lineW[4]+'px;">'+data.phone+'</div>';
text+='<div class="lists" style="width:'+lineW[5]+'px;">'+data.merchant_addr+'</div>';
text+='<div class="lists" style="width:'+lineW[6]+'px;color:'+is_teamworkColor+';">'+is_teamwork+'</div>';
            text+='<div class="lists listedit" style="width:'+lineW[7]+'px;">';
            text+='<span data-key="'+data.merchant_id+'" data-name="'+data.merchant_name+'" data-phone="'+data.phone+'" data-address="'+data.merchant_addr+'" class="listedit_1">编辑兑换商品信息</span>';
            if(isHezuo){
                text+='<span data-key="'+data.merchant_id+'" class="listedit_2">取消合作</span>';
            }else{
                text+='<span data-key="'+data.merchant_id+'" class="listedit_3">合作</span>';
            }
            text+='</div>';
            text+='</li>';
        }
        $("#exchange_div3 ul").innerHTML=text;
        //绑定事件 编辑兑换商品
        var listedit_1=$("#exchange_div3 ul .listedit_1",true);
        for(var i=0;i<listedit_1.length;i++){
            listedit_1[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                var name=this.getAttribute("data-name");
                var phone=this.getAttribute("data-phone");
                var address=this.getAttribute("data-address");
                $("#rolenum_pop_2 input").value=name;
                $("#rolenum_pop_3 input").value=phone;
                $("#rolenum_pop_4 input").value=address;
                
                currOpenEdit="update";
                merchant_id=key;
                $("#rolenum_pop_1").innerHTML="兑换商信息编辑";
                $("#rolenum_pop").style.display="block";
                $("#bottom_left .share_pop").style.display="block";
            },false);
        }
        //取消合作
        var listedit_2=$("#exchange_div3 ul .listedit_2",true);
        for(var i=0;i<listedit_2.length;i++){
            listedit_2[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                server.merchant_teamwork_update("false",key,function(data){
                    if(data.status=="success"){
                         currPage=0;
                         updatesearch();
                    }
                });
            },false);
        }
        //合作
        var listedit_3=$("#exchange_div3 ul .listedit_3",true);
        for(var i=0;i<listedit_3.length;i++){
            listedit_3[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                server.merchant_teamwork_update("true",key,function(data){
                    if(data.status=="success"){
                         currPage=0;
                         updatesearch();
                    }
                });
            },false);
        }
        //查看详情 
        var sayxq=$("#exchange_div3 ul .sayxq",true);
        for(var i=0;i<sayxq.length;i++){
            sayxq[i].addEventListener("click",function(){
                var key=this.getAttribute("data-key");
                server.merchant_goods_info_get(key,function(data){
                    if(data.status=="success"){
                        $("#exchange_name_list").style.display="block";
                        var result=data.result;
                        var text="";
                        for(var i=0;i<result.length;i++){
                            text+="<li><div>"+(i+1)+":"+result[i].goods_name+"</div></li>";
                        }
                        $("#exchange_name_lists").innerHTML=text;
                    }
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
            
            var downloadText="";
            var titleArr=["修改日期","兑换商名称","兑换商ID","提供商品","联系方式","兑换商地址",
                     "状态"];
            for(var i=0;i<titleArr.length;i++){
                var val=titleArr[i];
                downloadText+=val+",";
            }
            downloadText+="\n";
            
            doLastSend(function(data){
                var arrs=[];
                if(data.status=="success"){
                    arrs=data.result;
                    for(var i=0;i<arrs.length;i++){
                        var data=arrs[i];
                        // shop name_list
                        var isHezuo=data.is_teamwork=="true";
                        var is_teamwork="未合作";
                        var is_teamworkColor="#666666";
                        if(isHezuo){
                             is_teamwork="合作中";
                             is_teamworkColor="red";
                        }
                        downloadText+=forMatime(data.ut*1000)+",";
                        downloadText+=data.merchant_name+",";
                        downloadText+=data.merchant_id+",";
                        if(data.name_list.length==0){
                            downloadText+="无"+",";
                        }else{
                            for(var s=0;s<data.name_list.length;s++){
                                downloadText+=data.name_list[s].goods_name+"\t";
                            }
                            downloadText+=",";
                        }
                         downloadText+=data.phone+",";
                         downloadText+=data.merchant_addr+",";
                         downloadText+=is_teamwork+",";
                         downloadText+="\n";
                    }
                    downloadFile("兑换商信息.csv",downloadText);
                }
            });
            
            
            
        });
        
        
        //日期
        start_time=$("#start_time");
        end_time=$("#end_time");
        
        var arr=[{
            key:"",
            value:"全部"
        },{
            key:"true",
            value:"合作中"
        },{
            key:"false",
            value:"未合作"
        }];
        buildItemList(arr,$("#exchange_div2_1"),true);
        var arr=[{
            key:"0",
            value:"查询类型"
        },{
            key:"1",
            value:"兑换商名称"
        },{
            key:"2",
            value:"兑换商ID"
        },{
            key:"3",
            value:"提供商品"
        },{
            key:"4",
            value:"联系方式"
        },{
            key:"5",
            value:"兑换商地址"
        }];
        buildItemList(arr,$("#exchange_div2_2"));
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
        
         //放弃 
        var btn_cancel=$("#rolenum_pop_0 .btn_cancel");
        btn_cancel.addEventListener("click",function(e){
           $("#rolenum_pop").style.display="none";
           $("#bottom_left .share_pop").style.display="none";
        });
        //保存 
        var btn_save=$("#rolenum_pop_0 .btn_save");
        btn_save.addEventListener("click",function(e){
            //保存
            var merchant_name=$("#rolenum_pop_2 input").value;
            var phone=$("#rolenum_pop_3 input").value;
            var merchant_addr=$("#rolenum_pop_4 input").value;
            if(merchant_name==""){
                alert("兑换商名字不能为空")
            }else if(phone==""){
                alert("联系方式不能为空")
            }else if(merchant_addr==""){
                alert("地址不能为空")
            }else{
 server.merchant_add_update(currOpenEdit,merchant_name,merchant_addr,phone,merchant_id,function(data){
                if(data.status=="success"){
                    $("#rolenum_pop").style.display="none";
                    $("#bottom_left .share_pop").style.display="none";
                    //从新显示
                    currPage=0;
                    updatesearch();
                }
             });
            }
        });
        //添加新的兑换商
        var exchange_div2_6=$("#exchange_div2_6");
        exchange_div2_6.addEventListener("click",function(e){
            $("#rolenum_pop_2 input").value="";
            $("#rolenum_pop_3 input").value="";
            $("#rolenum_pop_4 input").value="";
            currOpenEdit="add";
            merchant_id="";
            $("#rolenum_pop_1").innerHTML="兑换商信息添加";
            $("#rolenum_pop").style.display="block";
            $("#bottom_left .share_pop").style.display="block";
        });
        
        bindSelectItem();
    }
    ajax("html/exchangebus.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    return {
        destory:destory
    }
}