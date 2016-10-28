window.onload=function(){
    var data=localStorage.getItem("kodata");
    if(!data || data==""){
        location.href="../index.html";
        //location.href="login.html";
        return;   
    }else{
        data=JSON.parse(data);
        apiInfoData= JSON.parse(localStorage.getItem("server_info"));
    }
    person_id=data._id;
    connObj.init(function(){
        koIndex();
    });
}
function goto_view(url){
    location.href="../index.html?#/"+url;
}

//key  location.hash  或者 data-type
var pageCfg={
    "rolenum":["rolenum",[1,1]],//在线人数
    "exchangebus":["exchangebus",[2,1]],//兑换商管理
    "exchangeshop":["exchangeshop",[2,2]],//商品兑换
    "exchange_additem":["exchange_additem",[2,3]],//添加实物兑换信息
    "exchange_item":["exchange_item",[2,2]],//兑换实体商品
    "exchange_edit":["exchange_edit",[2,2]],//编辑券兑换信息
    "yingkui_110":["yingkui_110",[3,2]],//盈亏池
    "yingkui_111":["yingkui_111",[3,2]],//盈亏池
    "yingkui_112":["yingkui_112",[3,2]],//盈亏池
    "yingkui_113":["yingkui_113",[3,2]],//盈亏池
    "yingkui_114":["yingkui_114",[3,2]],//盈亏池
    "yingkui_115":["yingkui_115",[3,2]],//盈亏池
    "yingkui_116":["yingkui_116",[3,2]],//盈亏池
    "yingkui_117":["yingkui_117",[3,2]],//盈亏池
    "jijin_130":["jijin_130",[3,3]],//基金池
    "jijin_131":["jijin_131",[3,3]],//基金池
    "jijin_132":["jijin_132",[3,3]],//基金池
    "jijin_133":["jijin_133",[3,3]],//基金池
    "tongji_dengji":["tongji_dengji",[5,5]],//等级统计
    "tongji_chongzhi":["tongji_chongzhi",[5,6]],//用户充值统计
    "tongji_huizong":["tongji_huizong",[2,6]],//兑换汇总
    "tongji_huizong_num":["tongji_huizong_num",[2,6]],//每日兑换汇总统计详情
}
var sceneObj={};


function koIndex(){
    function bind(){
        //展开列表
        var lis=$("#bottom_left_ul .bottom_left_ul_li div",true);
        for(var i=0;i<lis.length;i++){
            tapBind(lis[i],function(e,that){
                var dom=that.parentElement;
                changeZhan(dom);
            });
        }
        //选择列表
        var lis=$("#bottom_left_ul .bottom_left_ul_li ul li",true);
        for(var i=0;i<lis.length;i++){
            tapBind(lis[i],function(e,that){
                selectList(that);
            });
        }
        var btn_cancel=$("#top_break");
        btn_cancel.addEventListener("click",function(e){
            localStorage.clear();
            location.href="../index.html";
            location.reload();
        });
    }

    var selectObj={
        type:"",//选择类型
        listType:""//实际内容类型
    }
    //改变展开
    function changeZhan(dom,isOpen){
        var zhedie=dom.getAttribute("data-zhedie");
        if(zhedie!="ok"){
            dom.setAttribute("data-zhedie","ok");
            dom.querySelector("ul").style.display="block";
            dom.querySelector(".img2").src="img/arrow_down.png";
        }else{
            if(!isOpen){
                dom.setAttribute("data-zhedie","no");
                dom.querySelector("ul").style.display="none";
                dom.querySelector(".img2").src="img/arrow_left.png";
            }
        }
        //设置类型
        selectObj.type=dom.getAttribute("data-type");
    }
    var otherdom=null;
    function selectList(dom,data){
        //恢复
        if(otherdom){
            otherdom.style.color="#a0a0a0";
            otherdom.style["background-color"]="#3e3e3e";
        }
        //选择列表
        otherdom=dom;
        otherdom.style.color="white";
        otherdom.style["background-color"]="#3e9ad9";
        //设置类型
        selectObj.listType=otherdom.getAttribute("data-type");
        runList(data);
        console.log("selectObj:",selectObj);
    }
    function runList(data){
        if(pageCfg[selectObj.listType]){
            if(sceneObj.destory){
                sceneObj.destory();
            }
            sceneObj=window[pageCfg[selectObj.listType][0]+"_"](data);
            location.hash=selectObj.listType;
        }else{
            //location.href="http://www.baidu.com?#"+selectObj.listType;
        }
    }

    //只跳转，不修改页面
    window.runListMove=function(type,data){
        selectObj.listType=type;
        runList(data);
    }

    window.setScene=function(key,data){
        var page=[1,1];
        if(pageCfg[key]){
            page=pageCfg[key][1];
        }
        var seletdom=$("#bottom_left_ul .bottom_left_ul_li:nth-child("+page[0]+")");
        changeZhan(seletdom,true);
        selectList(seletdom.querySelector("ul li:nth-child("+page[1]+")"),data);
    }
    bind();
    var key=location.hash.split("?");
    
    var search=key[1];
    var hashObj={};
    if(search && search!=""){
        search.split("&").forEach(function(data){
            var datas=data.split("=");
            hashObj[datas[0]]=datas[1];
        });
    }
    window.setScene(key[0].replace("#",""),hashObj);
}