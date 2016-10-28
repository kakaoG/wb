function test1_(prop){
    //prop是页面跳转过来时的传递的参数
    //通过 window.runListMove("key",{a:2,b:[1,2]}) 方法来跳转当前页面的二级页面
    //比如从 商品兑换 的 邮寄兑换 里面点击 编辑兑奖信息，就跳转到了二级页面  exchange_additem
    //这时候的 prop就是 {a:2,b:[1,2]}
    
    //这里是各种方法自己可以定义
    
    function start(){
        //这是开始方法   
    }
    ajax("html/test1.html",function(text){
        $("#gamebottomdiv").innerHTML=text;
        start();
    });
}