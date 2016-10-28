function tongji_dengji_(){
    $("#game").style["min-width"]="1900px";
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
    var downloadText="";
    var downloadCall=function(){
        return "";
    }
    
    //获取时间戳
    function getstart_end(){
        start_end_=[];
        if(start_time.value!=""){
            var arr1=start_time.value.split("-");
            var times1=parseInt(new Date(parseInt(arr1[0]),
                                       parseInt(arr1[1])-1,
                                       parseInt(arr1[2]))/1000);
            times1+=60*60*23+60*59;
            start_end_=[times1];
        }
        
    }
    //查找
    function updatesearch(isAlert){
         //查询类型
        var selecttype=0;
        //更新时间和日期 layer_datatimeVal
        $(".layer_datatimeVal span:nth-child(1)").innerHTML=day_text;
        var val="";
        if(start_time.value!="" && end_time.value!=""){
            val=start_time.value+" - "+end_time.value;
        }
        $(".layer_datatimeVal span:nth-child(2)").innerHTML=val;
        selecttype=parseInt(selecttype);
        var person_name="";//用户昵称
        var person_id="";//用户id
        var goods_name="";//商品名称
        var goods_id="";//商品id

       
      
        if(lastpage_size!=page_size){
            currPage=0;
        }
        lastpage_size=page_size;
        var event="pay";
        var eventType={
          "用户消费价值": "pay",
          "盈亏池注入": "inject",
          "碎片投放": "piece"
        }
        //兑换商列表获取	
        server.poolRecord_detail_pool_fund(event,{
            "day_num":day_num,
            "start_end":start_end_,
            "person_name":person_name,
            "person_id":person_id,
            "goods_name":goods_name,
            "goods_id":goods_id
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
        show:function(){
            
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
        var lineW=[200];
        var titleArr=["等级/日期"];
        var titleArr_1=[""];
        
        var maxLen=0;
        
        for(var i=0;i<curr_data_list.length;i++){
            var vals=curr_data_list[i];
            titleArr.push(vals.date);
            titleArr.push("");
            
            lineW.push(100);
            lineW.push(100);
            
            titleArr_1.push("人数");
            titleArr_1.push("占比");
            
            if(maxLen<vals.list.length){
                maxLen=vals.list.length;
            }
        }

        var ws=0;
        for(var i=0;i<lineW.length;i++){
            ws+=lineW[i];
        }
        $("#exchange_div3").style.width=ws+"px";
        downloadText="";
        //生成数据 mw15890517766
        var text='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr.length;i++){
            var val=titleArr[i];
            if(val==""){
                text+='<div class="lists" style="width:0px;height:40px;"></div>';
            }else{
                text+='<div class="lists" style="width:200px;height:40px;">'+val+'</div>';
            }
            downloadText+=val+",";
        }
        text+='</li>';
        downloadText+="\n";
        
        text+='<li class="iteminfo_list iteminfo_list_title">';
        for(var i=0;i<titleArr_1.length;i++){
            var val=titleArr_1[i];
            text+='<div class="lists" style="width:'+lineW[i]+'px;height:40px;">'+val+'</div>';
            downloadText+=val+",";
        }
        text+='</li>';
        downloadText+="\n";
        
        for(var p=0;p<maxLen;p++){
            var liheight=40;
            var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
            var ji= p%2==0 ? "iteminfo_ji" : "iteminfo_ou";
            text+='<li class="iteminfo_list '+ji+'" style="'+otherStyle+'">';
            text+='<div class="lists" style="width:'+lineW[0]+'px;">Lv'+(p+1)+'</div>';
            for(var i=0;i<curr_data_list.length;i++){
                var list=curr_data_list[i].list;
                var data=list[p];
                var val=parseFloat(data.percent*100000)/1000;
                val=val.toFixed(2);
                if(!data){
                    text+='<div class="lists" style="width:100px;">--</div>';
                    text+='<div class="lists" style="width:100px;">--</div>';
                }else{
                    text+='<div class="lists" style="width:100px;">'+data.num+'</div>';
                    text+='<div class="lists" style="width:100px;">'+val+'%</div>';
                }
             }
             text+='</li>';
        }
        downloadCall=function(curr_data_list){
              var downloadText="";
              for(var p=0;p<maxLen;p++){
                var liheight=40;
                var otherStyle='height:'+liheight+'px;line-height:'+liheight+'px;'
                var ji= p%2==0 ? "iteminfo_ji" : "iteminfo_ou";
                downloadText+="Lv"+(p+1)+",";
                for(var i=0;i<curr_data_list.length;i++){
                    var list=curr_data_list[i].list;
                    var data=list[p];
                    var val=parseFloat(data.percent*100000)/1000;
                    val=val.toFixed(2);
                    if(!data){
                        downloadText+="--,";
                        downloadText+="--,";
                    }else{
                        downloadText+=data.num+",";
                        downloadText+=val+"%,";
                    }
                 }
                 downloadText+="\n";
            }
            return downloadText;
        }
        
        
        
        $("#exchange_div3 ul").innerHTML=text;
    }
    
    function start(){
        //下载 
        var exchange_div4_3=$("#exchange_div4_3");
        exchange_div4_3.addEventListener("click",function(e){
            doLastSend(function(data){
                var text=downloadText;
                if(data.status=="success"){
                    text+=downloadCall(data.historyLevel_list);
                }
                downloadFile("用户等级统计.csv",text);
           });
            
        });
        //日期
        start_time=$("#exchange_div2_1");
        start_time.addEventListener("click",function(e){
            laydate();
            $('#laydate_box').style['margin-left']='0px';
            
        });
        var exchange_div2_5=$("#exchange_div2_5");
        exchange_div2_5.addEventListener("click",function(e){
            getstart_end();
            if(start_end_[0]){
                server.historyLevel(start_end_[0],function(data){
                    if(data.status=="success"){
                        curr_data_list=data.historyLevel_list;
                        //生产数据
                        buildDataList();
                    }

                });
            }
        });
    }
    ajax("html/tongji_dengji.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
    
    return {
        destory:destory
    }
}