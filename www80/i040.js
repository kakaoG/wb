// 页面逻辑定制在这里，布局在 i.html 和 i.css
iweb.controller('i040', function($scope,fileReader,$filter ) {
	$scope.searchTypeMenu = '查询类型';
	$scope.dolListMenu = 10;
	$scope.exchangeListEdit = '兑换方式';
	$scope.sellerShoeType = '查询类型';
	$scope.merchants=[];
	$scope.showImgSrc="";
	var b = {"邮寄":"post","实体店":"store","团购券":"ticket"};

	$scope.addGoodsData = {};

	$scope.merchants_pageNumber = 1;//兑换商当前页
	$scope.merchants_condition = {};

	$scope.goods_pageNumber = 1;//商品目录当前页
	$scope.goods_pageSize = 10;
	$scope.goods_condition = {};
	$scope.goods_sort = {"ut":-1}; //商品排序方式："price":1（按商品价格升序），-1就降序；"init_price":1（按商品成本价格升序），-1就降序；"ut":1（按修改时间升序），-1就降序
	$scope.ut_sort = "sort_class1";
	$scope.price_sort = "sort_class";
	$scope.init_price_sort = "sort_class";


	$scope.singleGoodsData = {};//单个商品信息

	$scope.export_flag = false; //点击导出按钮标记：true导出，false查询

	$scope.goods_search_all = function(){
		$scope.goods_condition = {};
		$scope.goods_pageNumber = 1;
		$scope.flush();
	}

	$scope.goods_search = function(){
		$scope.goods_condition = {};
		$scope.goods_pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","商品ID":"goods_id","兑换商ID":"merchant_id","商品名称":"goods_name","商品价格区间":"price_range"};
		var key = a[$scope.searchTypeMenu];
		if(key=='price_range'){
			$scope.goods_condition[key] = [parseInt($scope.goods_input1),parseInt($scope.goods_input2)];
		}else{
			$scope.goods_condition[key] = $scope.goods_input;
		}
		var startTime = document.getElementById("startTime").value;
		var endTime = document.getElementById("endTime").value;
		if(startTime!="" || endTime!=""){
			var dgt_startTime = new Date(startTime).valueOf()/1000;
			var dgt_endTime = new Date(endTime).valueOf()/1000;
			if(startTime==""){
				dgt_startTime = 0;
			}
			if(endTime==""){
				dgt_endTime = Number.MAX_VALUE;
			}else{
				dgt_endTime = dgt_endTime+24*60*60;
			}
			$scope.goods_condition.start_end=[dgt_startTime,dgt_endTime];
		}
		$scope.flush();
	}

	$scope.merchants_search = function(){
		$scope.merchants_condition = {};
		$scope.merchants_pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","兑换商ID":"merchant_id","联系方式":"phone","兑换商地址":"address"};
		var key = a[$scope.sellerShoeType];
		$scope.merchants_condition[key] = $scope.merchants_input;
		$scope.changeMerchantName(0,5);
	}

/*
	//图片预览
	$scope.choose_pic = function(){ 
		$("#file_upload").change(function() {
var $file = $(this);
var fileObj = $file[0];
var windowURL = window.URL || window.webkitURL;
var dataURL;
var $img = $("#preview");
 
if(fileObj && fileObj.files && fileObj.files[0]){
dataURL = windowURL.createObjectURL(fileObj.files[0]);
$img.attr('src',dataURL);
}else{
dataURL = $file.val();
var imgObj = document.getElementById("preview");
// 两个坑:
// 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
// 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
 	console.log($(this).val());
}
});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "associate",
			"act": "mock",
			"to_login_name": TOOLBOX_ACCOUNT,
			"data": {
				"obj":"test",
				"act":"choose_pic", // 区分不同的输入
				// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
				// data 可以是复杂的哈希数组
				"data":"图片插入"
			}
		});
	};
*/
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
		console.log(apiconn.server_info.upload_to);
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
		console.log(evt.target.responseText);
		var jo = JSON.parse(evt.target.responseText.substring(0,evt.target.responseText.lastIndexOf(" ")));
		var img = new Image();
		var count = 10;
		img.onload = function() {
			$scope.product_image = jo.fid;
			$scope.headURL = apiconn.server_info.download_path + jo.fid;
			console.log($scope.product_image)
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
				$scope.head_fid = jo.fid;
				$scope.showImgSrc = $scope.baseUrl+$scope.head_fid;
			}
			alert('上传成功');
			document.getElementById("img_text").style.visibility = "hidden";
		})
	};

	$scope.showList01 = function(){ 
		$('#type_list_menu').slideToggle(200);
		$('#type_list_menu').children().click(function(){ 
			$scope.searchTypeMenu=$(this).html();
		});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "associate",
			"act": "mock",
			"to_login_name": TOOLBOX_ACCOUNT,
			"data": {
				"obj":"test",
				"act":"showList01", // 区分不同的输入
				// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
				// data 可以是复杂的哈希数组
				"data":"商品类型列表下拉"
			}
		});
	};
	$scope.showList02 = function(){ 
		$('#dol_list_menu').slideToggle(200);
		$('#dol_list_menu').children().click(function(){ 
			$scope.dolListMenu=$(this).html();
			$scope.goods_pageSize = $scope.dolListMenu;
			$scope.goods_pageNumber = 1;
			$scope.flush();
		});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "associate",
			"act": "mock",
			"to_login_name": TOOLBOX_ACCOUNT,
			"data": {
				"obj":"test",
				"act":"showList02", // 区分不同的输入
				// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
				// data 可以是复杂的哈希数组
				"data":"商品下载页数列表下拉"
			}
		});
	};
	$scope.showList03 = function(){ 
		$('#exchange_list_edit').slideToggle(200);
		$('#exchange_list_edit').children().click(function(){
			var a = $(this).html();
			$scope.exchangeListEdit=b[a];
			$scope.exchangeName=a;
		});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "associate",
			"act": "mock",
			"to_login_name": TOOLBOX_ACCOUNT,
			"data": {
				"obj":"test",
				"act":"showList03", // 区分不同的输入
				// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
				// data 可以是复杂的哈希数组
				"data":"兑换商列表下拉"
			}
		});
	};
	$scope.showList04 = function(){ 
		$('#seller_show_type').slideToggle(200);
		$('#seller_show_type').children().click(function(){ 
			$scope.sellerShoeType=$(this).html();
		});
	};
	
	$scope.addGoods = function(){
		$scope.newExchgeWay = $scope.exchangeListEdit;
		if(isNaN($scope.newPrice)){
			alert("价格只能填写数值，请重新输入");
			return;
		}
		if(isNaN($scope.newInitPrice)){
			alert("成本价只能填写数值，请重新输入");
			return;
		}
		if($scope.newId){
			apiconn.send_obj(
				{
					"obj":"truck",
					"act":"edit_goods",
					"admin_id":localStorage.getItem("userid"),
					"goods_id":$scope.newId,
					"goods_info":{
						"name":$scope.newName,
						"image_fid":$scope.head_fid,
						"price":$scope.newPrice,
						"init_price":$scope.newInitPrice,
						"introduce":$scope.newIntroduce,
						"exchge_way":$scope.newExchgeWay,
						"merchant_name":$scope.newMerchantName,
						"min_visible_lv":$scope.newMinVisibleLv
					}
				});
		}else{
		apiconn.send_obj({
				"obj":"truck",
				"act":"add_goods",
				"admin_id":localStorage.getItem("userid"),
				"goods_info":{
					"name":$scope.newName,
					"image_fid":$scope.head_fid,
					"price":$scope.newPrice,
					"init_price":$scope.newInitPrice,
					"introduce":$scope.newIntroduce,
					"exchge_way":$scope.newExchgeWay,
					"merchant_name":$scope.newMerchantName,
					"min_visible_lv":$scope.newMinVisibleLv
				}
			});
		}
	};
	//取消保存
	$scope.giveupSave = function(){ 
		$('#giveup_save').show();
		$scope.cancelCan= false;
	};	
	$scope.cancel = function(){ 
		$scope.cancelCan = true;
	};
	
	//确定取消保存，编辑窗口关闭，清空编辑内容
	$scope.sure = function(){ 
		$scope.sureGiveup = true;
		$scope.cancelCan= true;
		$scope.newName = '';
		$scope.newImageFid ='';
		$scope.newPrice = '';
		$scope.newInitPrice = '';
		$scope.newIntroduce = '';
		$scope.newExchgeWay = '';
		$scope.newMerchantName = '';
		$scope.newMinVisibleLv = '';	
	};
	$scope.menuEdit = function(){
		//显示商品信息
		$scope.sureGiveup = false;
		$scope.newId = '';
		$scope.newName = '';
		$scope.newImageFid ='';
		$scope.newPrice = '';
		$scope.newInitPrice = '';
		$scope.newIntroduce = '';
		$scope.exchangeName = '';
		$scope.newMerchantName = '';
		$scope.newMinVisibleLv = '';
		$scope.showImgSrc="";
		$scope.headImg="";
		$scope.head_fid="";
		$(".headImg").removeAttr("src");
		$('#menu_edit').show();
	};
	
	//查看碎片详情
	$scope.showSuipian = function(id){
		apiconn.send_obj({
			"obj":"truck",
			"act":"piece_record",
			"admin_id":localStorage.getItem("userid"),
			"goods_id":id
		});
		$('#suipian_info').show();
	};
	$scope.closeSuipian = function(){ 
		$('#suipian_info').hide();
	};
	//点击上架
	$scope.shangjia = function(id){
		$('#shangjia_remind').show();
		$scope.merchant_id = id;
	};
	$scope.shangjiaNot = function(){ 
		$('#shangjia_remind').hide();	
	};
	$scope.shangjiaYes = function(){
		apiconn.send_obj({
			"obj":"truck",
			"act":"up_down",
			"admin_id":localStorage.getItem("userid"),
			"goods_id":$scope.merchant_id,
			"type":"up"
		});
		$('#shangjia_remind').hide();
		$scope.goods_pageNumber = 1;
		$scope.flush();
	};
	//点击上架
	$scope.xiajia = function(id){
		$('#xiajia_remind').show();
		$scope.merchant_id = id;
	};
	$scope.xiajiaNot = function(){ 
		$('#xiajia_remind').hide();
	};
	$scope.xiajiaYes = function(){
		apiconn.send_obj({
			"obj":"truck",
			"act":"up_down",
			"admin_id":localStorage.getItem("userid"),
			"goods_id":$scope.merchant_id,
			"type":"down"
		});
		$('#xiajia_remind').hide();
		$scope.goods_pageNumber = 1;
		$scope.flush();
	};
	//编辑商品
	$scope.editGoods = function(goods){
		$('#menu_edit').show();
		//显示商品信息
		$scope.sureGiveup = false;
		$scope.newId = goods.goods_id;
		$scope.newName = goods.goods_name;
		$scope.newImageFid =goods.image_fid;
		$scope.head_fid = goods.image_fid;
		$scope.showImgSrc = $scope.baseUrl+$scope.head_fid;
		$scope.newPrice =goods.price;
		$scope.newInitPrice = goods.init_price;
		$scope.newIntroduce = goods.introduce;
		//$scope.exchangeName = b[goods.exchge_way];
		for(var key in b){
			if(b[key] == goods.exchge_way){
				$scope.exchangeName = key;
			}
		}
		$scope.exchangeListEdit=goods.exchge_way;

		$scope.newMerchantName = goods.merchant_name;
		$scope.newMinVisibleLv = goods.min_visible_lv;
	};
	
	//修改兑换商
	$scope.changeMerchantName = function(page_num,page_size){
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "merchant",
			"act": "search",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.merchants_condition,
			"page_num":page_num,        //页码 0、1、2、3....
			"page_size":page_size      //每页大小，没有则默认7
		});
		$('#seller_edit').show();
	};
	
	$scope.chooseMerchantName = function(name){
		$('#choose_MerchantName').show();
		$scope.merchant_name = name;
	};
	$scope.chooseMerchantNameNot = function(){ 
		$('#choose_MerchantName').hide();
	};
	$scope.chooseMerchantNameYes = function(){ 
		$('#choose_MerchantName').hide();
	};
	
	$scope.giveupMerchantName = function(){
		$('#seller_edit').hide();
	};
	$scope.saveMerchantName = function(){
		$('#choose_MerchantName').hide();
		$('#seller_edit').hide();
		$scope.newMerchantName = $scope.merchant_name;
	};
	
  // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到
  // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期
  $scope.input = function(event) {
  	apiconn.send_obj({
		// 典型的请求都有这两个字段，
		"obj": "associate",
		"act": "mock",
		"to_login_name": TOOLBOX_ACCOUNT,
		"data": {
			"obj":"test",
			"act":"input1", // 区分不同的输入
			// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
			// data 可以是复杂的哈希数组
			"data":$scope.inputMsg
		}
	});

	// 典型的接口请求，构造一个请求包 调用 send_obj 就可以了
	// 就是这个send可能会被SDK拒绝。接收后，如果服务端超时，
	// 会在15秒内给出响应： uerr: ERR_CONNECTION_EXCEPTION
  };

  $scope.output = "等待服务端数据";

	//排序
	$scope.sort_way = function(type){
		//修改排序
		if(type == "ut"){
			$scope.price_sort = "sort_class";
			$scope.init_price_sort = "sort_class";
			if($scope.goods_sort.ut == -1){
				$scope.goods_sort = {"ut":1};
				$scope.ut_sort = "sort_class2";
			}else {
				$scope.goods_sort = {"ut":-1};
				$scope.ut_sort = "sort_class1";
			}
		}else if(type == "price"){
			$scope.ut_sort = "sort_class";
			$scope.init_price_sort = "sort_class";
			if($scope.goods_sort.price == -1){
				$scope.goods_sort = {"price":1};
				$scope.price_sort = "sort_class2";
			}else {
				$scope.goods_sort = {"price":-1};
				$scope.price_sort = "sort_class1";
			}
		}else if(type == "init_price"){
			$scope.ut_sort = "sort_class";
			$scope.price_sort = "sort_class";
			if($scope.goods_sort.init_price == -1){
				$scope.goods_sort = {"init_price":1};
				$scope.init_price_sort = "sort_class2";
			}else {
				$scope.goods_sort = {"init_price":-1};
				$scope.init_price_sort = "sort_class1";
			}
		}
		$scope.flush();
	}

	//导出
	$scope.export_xlsx = function(){
		if($scope.addGoodsData.result.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag = true;
		var records = $scope.goods_pageSize*$scope.addGoodsData.total_page;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "truck",
			"act": "search",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.goods_condition,
			"page_num":0,
			"page_size":records,
			"sort":$scope.goods_sort
		});
	};


	$scope.flush=function(){
		$scope.export_flag = false;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "truck",
			"act": "search",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.goods_condition,
			"page_num":$scope.goods_pageNumber-1,
			"page_size":$scope.goods_pageSize,
			"sort":$scope.goods_sort
		});
	}
	//商品目录上一页
	$scope.goods_prev = function(){
		if($scope.goods_pageNumber>1){
			$scope.goods_pageNumber--;
			$scope.flush();
		}
	}
	//商品目录下一页
	$scope.goods_next = function(){
		if($scope.goods_pageNumber<$scope.addGoodsData.total_page){
			$scope.goods_pageNumber++;
			$scope.flush();
		}
	}
	//兑换商上一页
	$scope.merchants_prev = function(){
		if($scope.merchants_pageNumber>1){
			$scope.merchants_pageNumber--;
			$scope.changeMerchantName($scope.merchants_pageNumber-1,5);
		}
	}
	//兑换商下一页
	$scope.merchants_next = function(){
		if($scope.merchants_pageNumber<$scope.merchants.total_page){
			$scope.merchants_pageNumber++;
			$scope.changeMerchantName($scope.merchants_pageNumber-1,5);
		}
	}

	setTimeout(function () {
		$scope.flush();
	}, 0);
	$scope.getExchgeName = function(code){
		for(var key in b){
			if(b[key]==code){
				return key;
			}
		}
	}

  $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

	// 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户
	if (jo.obj == "truck" && jo.act == "search") {
		// 服务端的数据来了，呈现
		if($scope.export_flag==true){//导出
			$scope.filename = "商品目录(总库)";
			var detail = "";
			var arr = [["修改日期","商品名称","商品ID","商品价格","商品成本价","兑换商名称","商品简介","兑换方式","已投放的碎片(个)","最低可视等级"]];
			angular.forEach(jo.result,function(x){
				detail = "";
				for(var key in x.piece_list){
					detail += key+"号:"+x.piece_list[key]+";";
				}
				arr.push([$filter('date')(x.ut*1000,'yyyy-MM-dd HH:mm'), x.goods_name,x.goods_id, x.price,x.init_price, x.merchant_name, x.introduce,$scope.getExchgeName(x.exchge_way),detail,x.min_visible_lv]);
			});
			export2xlsx(arr,$scope.filename);
		}else{//查询
			$scope.addGoodsData = jo;
		}
	}
	if (jo.obj == "truck" && jo.act == "add_goods") {
		if(jo.status=="success"){
			alert("添加成功！");
			$scope.showImgSrc="";
			$scope.headImg="";
			$scope.head_fid="";
			$scope.flush();
			$('#menu_edit').hide();
		}
	}
	  if (jo.obj == "truck" && jo.act == "edit_goods") {
		  if(jo.status=="success"){
			  alert("保存成功！");
			  $scope.showImgSrc="";
			  $scope.headImg="";
			  $scope.head_fid="";
			  $scope.flush();
			  $('#menu_edit').hide();
		  }
	  }
	if (jo.obj == "merchant" && jo.act == "search") {
		if(jo.status=="success"){
			$scope.merchants = jo;
		}
	}
	  //查看碎片
	if (jo.obj == "truck" && jo.act == "piece_record") {
			$scope.pieces = jo.result;
	}
	if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
		$scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
	}
  });
	//初始化日期控件
	initDate('startTime');
	initDate('endTime');
	//时间控件
	function initDate(id){
		$.datetimepicker.setLocale('ch');//设置中文
		$('#'+id).datetimepicker({
			lang:"ch",           //语言选择中文
			format:"Y-m-d",      //格式化日期
			timepicker:false,    //关闭时间选项
			yearStart:2000,     //设置最小年份
			yearEnd:2050,        //设置最大年份
			onSelectDate:function(){
				$scope.goods_search();
			},
			todayButton:true    //关闭选择今天按钮
		});
	}
});

angular.module("starter.directive", [])
	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function($scope ,element, attrs, ngModel) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function(event){
					$scope.$apply(function(){
						modelSetter($scope, element[0].files[0]);
					});
					//附件预览
					$scope.file = (event.srcElement || event.target).files[0];
					$scope.getFile($scope.file,attrs.fileModel);
				});
			}
		};
	}])
	.factory('fileReader', function($q, $log) {

		var onLoad = function(reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.resolve(reader.result);
				});
			};
		};
		var onError = function (reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.reject(reader.result);
				});
			};
		};
		var getReader = function(deferred, scope) {
			var reader = new FileReader();
			reader.onload = onLoad(reader, deferred, scope);
			reader.onerror = onError(reader, deferred, scope);
			return reader;
		};
		var readAsDataURL = function (file, scope) {
			var deferred = $q.defer();
			var reader = getReader(deferred, scope);
			reader.readAsDataURL(file);
			return deferred.promise;
		};
		return {
			readAsDataUrl: readAsDataURL
		};

	})


