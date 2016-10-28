var lastSendServer={
    maxsize:0
};

function doLastSend(callback){
    if(lastSendServer.attr){
        lastSendServer.attr.page_num=0;
        lastSendServer.attr.page_size=lastSendServer.maxsize;
        getData(lastSendServer.attr,callback,true);
    }
}

function getData(attr,callback,nosava){
    //attr.person_id=person_id;
    if(!nosava){
        lastSendServer.attr=attr;
    }
    //console.info("send:",JSON.stringify(attr));
    //发送信息 
    apiCallback[attr.obj+"_"+attr.act]=function(data){
        //console.log("获取信息:",data);
        if(callback){
            callback(data);
        }
        if(data.status!="success"){
            alert(data.ustr);
        }else{
            if(!nosava){
                lastSendServer.maxsize=1000;
                if(attr.page_size!=undefined && data.total_page!=undefined){
                    lastSendServer.maxsize=parseInt(attr.page_size)*parseInt(data.total_page);
                   // console.error("maxsize:",lastSendServer.maxsize);
                }
            }
            
        }
    }
    apiconn.send_obj(attr);
}
var person_id="";

var server={
   login_in:function(account,code){
        apiCallback["person_login"]=function(data){
            if(data.status=="success"){
                var id=data.user_info._id;
                localStorage.setItem("koaccount","yes");
                var kodata={
                    account:account,
                    code:code,
                    _id:id
                }
                localStorage.setItem("kodata",JSON.stringify(kodata));
                if(searchObj.url=="exchange"){
                    location.href="exchange.html";
                }else{
                    location.href="index.html";
                }
               
            }else{
                alert(data.ustr);
            }
        }
        var attr={
            "ctype": "normal",
            "login_name":account,
            "login_passwd":code
        }
        apiconn.credentialx(attr);
        apiconn.connect();
        
    },
    person_ar_giveup:function(ar_id,call){
        //用户ar对战过程中点击放弃
        //获取夺宝列表
        var attr={
            "obj":"person",
            "act":"ar_giveup",
             person_id:person_id,
            "ar_id":ar_id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    online_info_get:function(call){
        //在线人数管理
        var attr={
            "obj":"online",
            "act":"info_get",
             admin_id:person_id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    online_info_change:function(num,call){
        //在线人数上限修改
        var attr={
            "obj":"online",
            "act":"info_change",
            "limit_num":num,
            "admin_id":person_id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    post_goods_update:function(exchge_id,exchge_memo,logistics_company,call){
        //商品兑换模块：添加邮寄物品兑换信息(添加实物兑换信息)
        var attr={
            "obj":"manage",
            "act":"post_goods_update",
            "exchge_id":exchge_id,//要更改的兑换id
            "exchge_memo":exchge_memo,//物流编号
            "logistics_company":logistics_company,//物流公司
            "admin_id":person_id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    
    store_goods_exchge:function(phone,exchge_code,call){
        //商品兑换模块：输入实体商品兑换码完成兑换(兑换实体商品)
        var attr={
            "obj":"manage",
            "act":"store_goods_exchge",
            "phone":phone,//账户
            "exchge_code":exchge_code,//兑换码
            "admin_id":person_id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    ticket_goods_update:function(exchge_id,exchge_code,exchge_platform,start_time,out_time,exchge_addr,call){
        //商品兑换模块：券码物品兑换信息编辑(编辑券码兑换信息)
        var attr={
            "obj":"manage",
            "act":"ticket_goods_update",
            "admin_id":person_id,
            "exchge_id":exchge_id,//要更改的兑换id
            "exchge_code":exchge_code,//兑换码
            "exchge_platform":exchge_platform,//兑换平台
            "start_time":start_time,//有效期开始时间戳
            "out_time":out_time,//有效期结束时间戳
            "exchge_addr":exchge_addr,//兑换地址
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },

    merchant_add_update:function(do_type,merchant_name,merchant_addr,phone,merchant_id,call){
        //添加or编辑兑换商信息
        var attr={
            "obj":"manage",
            "act":"merchant_add_update",
            "admin_id":person_id,
            "do_type":do_type,//执行类型,add/添加新兑换商,update/编辑兑换商信息
            "merchant_name":merchant_name,//商家名称
            "merchant_addr":merchant_addr,//商家地址
            "phone":phone,//联系地址
            merchant_id:merchant_id //update时需要输入兑换商id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
     merchant_teamwork_update:function(is_teamwork,merchant_id,call){
        //兑换商合作状态更改
        var attr={
            "obj":"manage",
            "act":"merchant_teamwork_update",
            "admin_id":person_id,
            "is_teamwork":is_teamwork,//更改成的状态，true/合作,false/取消合作
            merchant_id:merchant_id //update时需要输入兑换商id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
     merchant_goods_info_get:function(merchant_id,call){
        //兑换商合作状态更改
        var attr={
            "obj":"manage",
            "act":"merchant_goods_info_get",
            "admin_id":person_id,
            merchant_id:merchant_id //update时需要输入兑换商id
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    merchant_list_get:function(condition,page_num,page_size,call){
        //兑换商管理模块：兑换商列表获取	
        var attr={
            "obj":"manage",
            "act":"merchant_list_get",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                "merchant_name":condition.merchant_name,//兑换商名称
                "meichant_id":condition.meichant_id,//兑换商id
                "goods_name":condition.goods_name,//提供的商品名
                "phone":condition.phone,//联系方式
                "merchant_addr":condition.merchant_addr,//兑换商地址
                "is_teamwork":condition.is_teamwork//合作状态,true/合作中,false/未合作
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
     post_goods_list_get:function(condition,page_num,page_size,call){
        //商品兑换模块：邮寄物品列表获取	
        var attr={
            "obj":"manage",
            "act":"post_goods_list_get",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                "exchge_status":condition.exchge_status,//wait_send/待发货|待发放，wait_received待收货|已发放，finish/已收货|已使用
                "person_name":condition.person_name,//用户名称
                "person_id":condition.person_id,//用户id
                "person_account":condition.person_account,//用户账号
                "goods_name":condition.goods_name,//物品名称
                "full_name":condition.full_name,//收货人
                "phone":condition.phone,//联系方式
                "exchge_memo":condition.exchge_memo,//物流编号
                "order_num":condition.order_num//订单号
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    store_goods_list_get:function(condition,page_num,page_size,call){
        //商品兑换模块：实体店物品列表获取
        var attr={
            "obj":"manage",
            "act":"store_goods_list_get",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                "exchge_status":condition.exchge_status,//wait_send/待发货|待发放，wait_received待收货|已发放，finish/已收货|已使用
                "person_name":condition.person_name,//用户名称
                "person_id":condition.person_id,//用户id
                "person_account":condition.person_account,//用户账号
                "goods_name":condition.goods_name,//物品名称
                "merchant_name":condition.merchant_name,//收货人
                "order_num":condition.order_num//订单号
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },

     p_manage_recharge_count:function(condition,page_num,page_size,call){
        //综合统计模块：用户充值统计
        var attr={
            "obj":"manage",
            "act":"recharge_count",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                 "display_name":condition.display_name,//用户昵称
                 "account":condition.account,//用户账号
                 "pay_type":condition.pay_type,//充值渠道,"wechat"/微信支付,"alipay"/支付宝支付
                 "transaction_id":condition.transaction_id,//平台订单号
                 "order_id":condition.order_id,//商户订单号
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    
    ticket_goods_list_get:function(condition,page_num,page_size,call){
        //商品兑换模块：实体店物品列表获取
        var attr={
            "obj":"manage",
            "act":"ticket_goods_list_get",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                "exchge_status":condition.exchge_status,//wait_send/待发货|待发放，wait_received待收货|已发放，finish/已收货|已使用
                "person_name":condition.person_name,//用户名称
                "person_id":condition.person_id,//用户id
                "person_account":condition.person_account,//用户账号
                "merchant_name":condition.merchant_name,//收货人
                "order_num":condition.order_num//订单号
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }

        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    exchgeRecord_list_get:function(condition,page_num,page_size,call){
        //商品兑换模块：兑换记录列表获取
        var attr={
            "obj":"manage",
            "act":"exchgeRecord_list_get",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[], //开始（unix）时间戳  结束（unix）时间戳
                "exchge_way":condition.exchge_status,//wait_send/待发货|待发放，wait_received待收货|已发放，finish/已收货|已使用
                "person_name":condition.person_name,//用户名称
                "person_id":condition.person_id,//用户id
                "person_account":condition.person_account,//用户账号
                "merchant_name":condition.merchant_name,//收货人
                "order_num":condition.order_num//订单号
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    poolRecord_detail_pool_fund:function(event,condition,page_num,page_size,call){
        //行为池/基金池/盈亏池明细查询接口		
        var attr={
            "obj":"poolRecord",
            "act":"detail",
            "admin_id":person_id,
             "pool_name":"pool_fund",//pool_action"行为池，"pool_fund"基金池，"pool_gain"盈亏池，
            "event":event,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[] //开始（unix）时间戳  结束（unix）时间戳
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        if(condition.person_name && condition.person_name!=""){
            attr.condition.person_name=condition.person_name;
        }
        if(condition.person_id && condition.person_id!=""){
            attr.condition.person_id=condition.person_id;
        }
        if(condition.goods_name && condition.goods_name!=""){
            attr.condition.goods_name=condition.goods_name;
        }
        if(condition.goods_id && condition.goods_id!=""){
            attr.condition.goods_id=condition.goods_id;
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
   poolRecord_detail:function(event,condition,page_num,page_size,call){
        //行为池/基金池/盈亏池明细查询接口		
        var attr={
            "obj":"poolRecord",
            "act":"detail",
            "admin_id":person_id,
             "pool_name":"pool_gain",//pool_action"行为池，"pool_fund"基金池，"pool_gain"盈亏池，
            "event":event,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[] //开始（unix）时间戳  结束（unix）时间戳
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        if(condition.person_name && condition.person_name!=""){
            attr.condition.person_name=condition.person_name;
        }
        if(condition.person_id && condition.person_id!=""){
            attr.condition.person_id=condition.person_id;
        }
        if(condition.goods_name && condition.goods_name!=""){
            attr.condition.goods_name=condition.goods_name;
        }
        if(condition.goods_id && condition.goods_id!=""){
            attr.condition.goods_id=condition.goods_id;
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    
    
    poolRecord_search_fund:function(condition,page_num,page_size,call){
        //行为池/基金池/盈亏池记录查询接口	
        var attr={
            "obj":"poolRecord",
            "act":"search",
            "admin_id":person_id,
             "pool_name":"pool_fund",//pool_action"行为池，"pool_fund"基金池，"pool_gain"盈亏池，
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[] //开始（unix）时间戳  结束（unix）时间戳
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        if(condition.event_name && condition.event_name!=""){
            attr.condition.event_name=condition.event_name;
        }
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    
    poolRecord_search:function(condition,page_num,page_size,call){
        //行为池/基金池/盈亏池记录查询接口	
        var attr={
            "obj":"poolRecord",
            "act":"search",
            "admin_id":person_id,
             "pool_name":"pool_gain",//pool_action"行为池，"pool_fund"基金池，"pool_gain"盈亏池，
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[] //开始（unix）时间戳  结束（unix）时间戳
            },
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        
        attr.condition.day_num=condition.day_num;
        attr.condition.start_end=condition.start_end;
        if(condition.event_name && condition.event_name!=""){
            attr.condition.event_name=condition.event_name;
        }
        console.info(attr);
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    
    pool_gain_events:function(pool_name,call){
        //盈亏池注入获取当前已有的事件类型接口	
        var attr={
            "obj":"pool",
            "act":"gain_events",
            "admin_id":person_id,
            "pool_name":pool_name,//pool_action"行为池，"pool_fund"基金池，"pool_gain"盈亏池，
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    pool_gain_injact:function(event,money,call){
        //盈亏池注入接口	
        var attr={
            "obj":"pool",
            "act":"gain_inject",
            "admin_id":person_id,
             "event":event,//"注入行为池"，"注入盈亏池"，"xxx"(自定义)
             "money":money//（正数表示增加）， -1000（负数表示减少）
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    store_goods_exchge:function(exchge_code,call){
        //商品兑换模块：输入实体商品兑换码核对兑换信息	
        var attr={
            "obj":"manage",
            "act":"store_goods_exchge",
            "admin_id":person_id,
             "exchge_code":exchge_code //兑换码
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    store_goods_finish:function(exchge_id,exchge_code,call){
        //商品兑换模块：输入实体商品兑换码核对兑换信息	
        var attr={
            "obj":"manage",
            "act":"store_goods_finish",
            "admin_id":person_id,
            "exchge_id":exchge_id,
            "exchge_code":exchge_code //兑换码
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    historyLevel:function(end_time,call){
        //商品兑换模块：输入实体商品兑换码核对兑换信息	
        var attr={
            "obj":"historyLevel",
            "act":"list",
            "start_time":end_time-3600*24*7,
            "end_time":end_time,
            "page_num":0,
            "page_size":100
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    exchange_count:function(start_time,end_time,call){
        //商品管理模块：兑换汇总统计
        var attr={
            "obj":"manage",
            "act":"exchange_count",
            "admin_id":person_id,
            "condition":{
                "day_num":-1,//要查看的最近的天数(0:今天|1:昨天|7:近7日|30:近30日|-1:全部),字段没有则表示没有该检索条件
                "start_end":[] //开始（unix）时间戳  结束（unix）时间戳
            },
            "page_num":0,        //页码 0、1、2、3....
            "page_size":1000      //每页大小，没有则默认7
        }
        //end_time-3600*24*7,end_time
        attr.condition.start_end=[
            start_time-3600*24*1,end_time
        ];
        
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    },
    day_exchange_info:function(end_time,page_num,page_size,call){
        //商品管理模块：每日物品兑换详情
        var attr={
            "obj":"manage",
            "act":"day_exchange_info",
            "admin_id":person_id,
            "date":end_time,
            "page_num":page_num,        //页码 0、1、2、3....
            "page_size":page_size,      //每页大小，没有则默认7
        }
        getData(attr,function(data){
            if(call){
                call(data);
            }
        });
    }
}
