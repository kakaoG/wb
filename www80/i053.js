// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i053', function ($scope,fileReader) {
    $scope.article = {"tips":"0/32","descTips":"0/120","title":"","descMsg":"","essay":"","now_time":""};
    $scope.info = {};
    $scope.info.msg = "";
    $scope.info.selectIndex = 0;
    $scope.info.selectString = "ALL";
    $scope.info.sendType = 0;
    $scope.menu_info = function(){
        $scope.show_menu_info = true;
    }
    $scope.info.selectPlat = function (index) {

        $scope.info.selectIndex = index;
        switch (index) {
            case 0:
                $scope.info.selectString = "ALL";
                break;
            case 1:
                $scope.info.selectString = "IOS";
                break;
            case 2:
                $scope.info.selectString = "ANDROID";
                break;
             case 3:
                 $scope.info.selectString = "WEB";
                 break;
        }
        $scope.show_menu_info = false;
    }
    //设置发送类型
    $scope.info.setSendType = function (index) {
        $scope.info.sendType = index;
    }

    //发送按钮监听
    $scope.sendData = function () {
        $('#send_remind').hide();
        var content = ue.getContent();
        var timestamp = "";
        if($scope.info.sendType == 1){
            timestamp = (new Date($scope.info.push_time+":00").valueOf())/1000;
        }
        var baseUrl = window.location.href;
        if(baseUrl.indexOf('index.html') > 0){
            baseUrl = baseUrl.substr(0, baseUrl.indexOf('index.html'));
        }else{
            baseUrl = baseUrl.substr(0, baseUrl.indexOf('#'));
        }
        var url = baseUrl + "i054.html?article_id=";
        apiconn.send_obj({
            "obj": "manage",
            "act": "essay_msg_push",
            "admin_id": localStorage.getItem("userid"),
            "url":url,
            "title":$scope.article.title,
            "image_fid":$scope.fengmianImg,
            "essay":content,
            "content": $scope.article.descMsg,
            "target_platform": $scope.info.selectString,
            "provinceCity": $scope.info.provinceCity,
            "is_time": $scope.info.sendType == 0?"true":"false",
            "push_time": timestamp
        });
    }

    //监听输入框
    $scope.$watch("article.title", function (newValue, oldValue, scope) {
        if(!newValue){
            newValue="";
        }
        if (newValue.length > 32)
            $scope.article.title = oldValue;
        $scope.article.tips = newValue.length + "/32";

    });
    $scope.$watch("article.descMsg", function (newValue, oldValue, scope) {
        if(!newValue){
            newValue="";
        }
        if (newValue.length > 120)
            $scope.article.descMsg = oldValue;
        $scope.article.descTips = newValue.length + "/120";

    });

    //预览
    $scope.preShow = function(){
        if(!$scope.article.title || !ue.hasContents()){
            alert("请输入文章标题和文章内容");
            return;
        }
        if(!$scope.article.descMsg){//摘要为空，抓取正文前54个字
            $scope.article.descMsg = ue.getContentTxt().substr(0,54);
        }
        document.getElementById("essay").innerHTML = ue.getContent();
        var date = new Date();
        $scope.article.now_time = date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
        $('#preview_div').show();
    }
    $scope.closePreview = function(){
        $('#preview_div').hide();
    }

    $scope.showSendData = function(){
        if(!$scope.article.title || !ue.hasContents()){
            alert("请输入文章标题和文章内容");
            return;
        }
        if(!$scope.fengmianImg){
            alert("请上传封面图");
            return;
        }
        if(!$scope.article.descMsg){//摘要为空，抓取正文前54个字
            $scope.article.descMsg = ue.getContentTxt().substr(0,54);
        }

        $('#send_remind').show();
    };

    $scope.cancelSend = function(){
        $('#send_remind').hide();
    };

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "manage" && jo.act == "essay_msg_push") {
            if (jo.status == "success") {
                alert("提交成功!");
            }
        }
    });

    //地图数据
    var cityPicker = new HzwCityPicker({
        data: window.mapData,
        target: 'cityChoice',
        valType: 'k-v',
        hideCityInput: {
            name: 'city',
            id: 'city'
        },
        hideProvinceInput: {
            name: 'province',
            id: 'province'
        },
        callback: function () {
            var province = $("#province").val();
            var x = province.indexOf('-');
            province = province.substr(x + 1, province.length - x);
            var city = $("#city").val();
            var y = city.indexOf('-');
            city = city.substr(y + 1, city.length - y);
            $scope.info.provinceCity = province + city;
        }
    });
    cityPicker.init();

    UE.delEditor("editor");//先删除掉以前的ueditor，否则第二次打开的时候会渲染失败
    var ue = UE.getEditor('editor',{
        enableAutoSave: false,
        elementPathEnabled : false,
        toolbars: [[
            'fullscreen', 'source','undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase',
            'horizontal'
         ]],
        retainOnlyLabelPasted: false,
        pasteplain:true,
        'filterTxtRules' : function(){
            function transP(node){
                node.tagName = 'p';
                node.setStyle();
            }
            return {
                //直接删除及其字节点内容
                '-' : 'script style object iframe embed input select',
                'p': {$:{}},
                'br':{$:{}},
                'div':{$:{}},
                'li':{$:{}},
                'caption':{$:{}},
                'th':{$:{}},
                'tr':{$:{}},
                'h1':{$:{}},'h2':{$:{}},'h3':{$:{}},'h4':{$:{}},'h5':{$:{}},'h6':{$:{}},
                'td':function(node){
                    //没有内容的td直接删掉
                    var txt = !!node.innerText();
                    if(txt){
                        node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
                    }
                    node.parentNode.removeChild(node,node.innerText())
                }
            }
        }()
    });

    //设置编辑器内容
    function setContent(text,isAppendTo) {
        isAppendTo=true;
        ue.setContent(text, isAppendTo);
    }

    $scope.getArticleDesc = function() {
        var desc = $scope.article.descMsg;
        if(!$scope.article.descMsg){//摘要为空，抓取正文前54个字
            desc = ue.getContentTxt().substr(0,54);
        }
        return desc;
    }

    $scope.getArticleContent = function() {
        return ue.getContent();
    }

    $scope.insertHtml = function(fid) {
        var value = '<img src="'+apiconn.server_info.download_path+fid+'">';
        ue.execCommand('insertHtml', value)
    }

    //初始化日期控件
    datetimepicker('sendTime');
    //时间控件
    function datetimepicker(id){
        $.datetimepicker.setLocale('ch');//设置中文
        $('#'+id).datetimepicker({
            lang:"ch",           //语言选择中文
            format:"Y-m-d H:m",      //格式化日期
            timepicker:true,    //关闭时间选项
            yearStart:2000,     //设置最小年份
            yearEnd:2050,        //设置最大年份
            todayButton:true    //关闭选择今天按钮
        });
    };

    //上传图片
    $scope.baseUrl=apiconn.server_info.download_path;
    $scope.openFile = function(index,isHead){
        isReplace = false;
        document.getElementById(index).click();
        $scope.isHead=isHead;
    };

    //打开文件
    $scope.getFile = function(file,fileAtributes){
        fileReader.readAsDataUrl(file,$scope).then(function(result){
            $scope.uploadFile('local_file',file,200)
        });
    };

    //上传文件
    $scope.uploadFile = function(src, data, sizes) {
        //console.log(apiconn.server_info.upload_to);
        var fd = new FormData();
        fd.append("local_file", data);
        fd.append("proj", apiconn.server_info.proj);
        fd.append("sizes", sizes);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", $scope.uploadComplete, false);
        xhr.open("POST", apiconn.server_info.upload_to);
        xhr.send(fd);
    };
    //上传完成
    $scope.uploadComplete = function(evt) {
        //console.log(evt.target.responseText);
        var jo = JSON.parse(evt.target.responseText.split(" ")[0]);
        var img = new Image();
        var count = 10;
        img.onload = function() {
            $scope.product_image = jo.fid;
            $scope.headURL = apiconn.server_info.download_path + jo.fid;
            //console.log($scope.product_image)
        };
        img.onerror = function() {
            if (count > 0) {
                count--;
                //img.src = apiconn.server_info.download_path + jo.fid + "&rn=" + Math.random();
            }
        };
        //img.src = apiconn.server_info.download_path + jo.fid;
        $scope.product_image = jo.fid;
        $scope.$apply(function(){
            if($scope.isHead||$scope.isHead==0){
                document.getElementById(0).value="";
                if($scope.isHead=="headImg"){
                    $scope.insertHtml(jo.fid);
                }else{
                    $scope.fengmianImg = jo.fid;
                    $scope.fengmianImgSrc = apiconn.server_info.download_path+$scope.fengmianImg;
                }
            }
        })
    };

});

