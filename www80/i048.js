// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i048', function($scope,$filter) {
	$scope.searchTypeKu = '查询类型';
	$scope.dolListKu = 10;
	$scope.searchTypeKuEdit = '查询类型';
	$scope.dolListKuEdit = 10;
	$scope.suipianshu = 1;
	$scope.searchTypeSuipian = '查询类型';

	$scope.dgt_pageNumber = 1;//商品库当前页
	$scope.dgt_pageSize = 10;
	$scope.dgt_condition = {};
	$scope.DGT_info = {pageNumber:1,pageSize:10,key:'',updateTime:'',searchType:''};
	$scope.info_condition = {};
	$scope.select_datas=[];

	//碎片信息分页
	$scope.truckListSearch = {pageNumber:1,pageSize:5,searchType:'',key:''};

	$scope.export_flag = false; //点击导出按钮标记：true导出，false查询

	$scope.selectTruck = function(x){
		if(x.truckList_check){
			$scope.select_datas.push({"goods_id":x.goods_id});
		}else{
			var i=0;
			angular.forEach($scope.select_datas,function(a){
				if(a.goods_id== x.goods_id){
					$scope.select_datas.splice(i,1);
				}
				i++;
			});
		}
	};

	$scope.showList05 = function(){ 
		$('#type_list_ku').slideToggle(200);
		$('#type_list_ku').children().click(function(){ 
			$scope.searchTypeKu=$(this).html();
		});
	};
	$scope.showList06 = function(){ 
		$('#dol_list_ku').slideToggle(200);
	};
	$scope.showList_child = function(num){
		$scope.dolListKu=num;
		$scope.dgt_pageSize = $scope.dolListKu;
		$scope.dgt_pageNumber = 1;
		$scope.flush();
	}

	$scope.showList09 = function(){ 
		$('#show_suipianshu').slideToggle(200);
		$('#show_suipianshu').children().click(function(){ 
			$scope.suipianshu=$(this).html();
		});
	};
	$scope.showList10 = function(){ 
		$('#show_add_suipian').slideToggle(200);
		$('#show_add_suipian').children().click(function(){ 
			$scope.searchTypeSuipian=$(this).html();
		});
	};


	//删除商品库
	$scope.deleteKu = function(id){
		$scope.dgt_id = id;
		$('#delete_ku_remind').show();
	};
	$scope.deleteKuNot = function(){ 
		$('#delete_ku_remind').hide();
	};
	$scope.deleteKuYes = function(){ 
		$('#delete_ku_remind').hide();
		apiconn.send_obj({
			"obj":"truck",
			"act":"newh_delete",
			"admin_id":localStorage.getItem("userid"),
			"goods_id":$scope.dgt_id
		});
	};
	//添加新手库
	$scope.addKu = function(){
		$scope.addNewSuipian();
	};

	//添加新手库
	$scope.addNewSuipian = function(){ 
		$('#add_new_suipian').show();
		$scope.select_datas=[];
		$scope.info_condition={};
		//查询所有碎片
		$scope.truckListSearch.pageNumber = 1;
		$scope.searchTypeSuipian = "查询类型";
		$scope.truckListInput = "";
		$scope.truckListInput1 = "";
		$scope.truckListInput2 = "";
		$scope.truckListFlush();
	};

	$scope.truckListFlush=function(){
		apiconn.send_obj({
			"obj":"truck",
			"act":"search",
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.info_condition,
			"sort":{"ut":1},
			"newh_search":"true",
		    "page_num":$scope.truckListSearch.pageNumber-1,
			"page_size":5
		});
	}

	$scope.truckListSearch_all=function() {
		$scope.info_condition = {};
		$scope.truckListSearch.pageNumber = 1;
		$scope.truckListSearch.searchType = "";
		$scope.truckListSearch.key = "";
		$scope.truckListFlush();
	}

	$scope.truckListSearch=function(){
		$scope.info_condition={};
		$scope.truckListSearch.pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","兑换商ID":"merchant_id","商品名称":"goods_name","商品ID":'goods_id',"商品价格区间":"price_range"};
		var key = a[$scope.searchTypeSuipian];
		$scope.truckListSearch.searchType = key;
		if(key=='price_range'){
			$scope.info_condition[key] = [parseInt($scope.truckListInput1),parseInt($scope.truckListInput2)];
		}else{
			$scope.info_condition[key] = $scope.truckListInput;
		}
		$scope.truckListFlush();
	}

	//添加新商品碎片-获取商品碎片列表 上一页
	$scope.truckList_prev = function(){
		if($scope.truckListSearch.pageNumber>1){
			$scope.truckListSearch.pageNumber--;
			$scope.truckListFlush();
		}
	}
	//添加新商品碎片-获取商品碎片列表 下一页
	$scope.truckList_next = function(){
		if($scope.truckListSearch.pageNumber<$scope.truckList.total_page){
			$scope.truckListSearch.pageNumber++;
			$scope.truckListFlush();
		}
	}

	//放弃添加新碎片
	$scope.giveupAddSuipian = function(){ 
		$('#cancel_add_suipian').show();
	};
	$scope.giveupAddSuipianNot = function(){ 
		$('#cancel_add_suipian').hide();
	};
	$scope.giveupAddSuipianYes = function(){ 
		$('#cancel_add_suipian').hide();
		$('#add_new_suipian').hide();
	};
	//保存添加新碎片
	$scope.saveAddSuipian = function(){ 
		$('#save_add_suipian').show();
	};
	$scope.saveAddSuipianNot = function(){ 
		$('#save_add_suipian').hide();
	};
	$scope.saveAddSuipianYes = function(){
		//保存
		var truck_id = [];
		angular.forEach($scope.select_datas,function(x){
			truck_id.push(x.goods_id);
		});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "truck",
			"act": "newh_edit",
			"admin_id":localStorage.getItem("userid"),
			"goods_ids":truck_id
		});
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

	//商品库上一页
	$scope.dgt_prev = function(){
		if($scope.dgt_pageNumber>1){
			$scope.dgt_pageNumber--;
			$scope.flush();
		}
	}
	//商品库下一页
	$scope.dgt_next = function(){
		if($scope.dgt_pageNumber<$scope.dgtList.total_page){
			$scope.dgt_pageNumber++;
			$scope.flush();
		}
	}
	$scope.dgt_search_all = function() {
		$scope.dgt_pageNumber = 1;
		$scope.dgt_condition = {};
		$scope.flush();
	}
	//商品库查询
	$scope.dgt_search = function(){
		$scope.dgt_condition = {};
		$scope.dgt_pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","商品ID":"goods_id","兑换商ID":"merchant_id","商品名称":"goods_name","商品价格区间":"price_range"};
		var key = a[$scope.searchTypeKu];
		if(key=='price_range'){
			$scope.dgt_condition[key] = [parseInt($scope.goods_input1),parseInt($scope.goods_input2)];
		}else{
			$scope.dgt_condition[key] = $scope.dgt_input;
		}
		$scope.flush();
	}


	//导出
	$scope.export_xlsx = function(){
		if($scope.dgtList.result.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag = true;
		var records = $scope.dgt_pageSize*$scope.dgtList.total_page;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "truck",
			"act": "newh_search",
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.dgt_condition,
			"page_num":0,
			"page_size":records
		});
	};

	$scope.flush=function(){
		$scope.export_flag = false;
		apiconn.send_obj({
			"obj":"truck",
			"act":"newh_search",
			"admin_id":localStorage.getItem("userid"),
			"condition":$scope.dgt_condition,
			"page_num":$scope.dgt_pageNumber-1,
			"page_size":$scope.dgt_pageSize
		});
	}

	setTimeout(function () {
		$scope.flush();
	}, 0);

  $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

	// 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户
	// 要处理。 ustr 是文本字符串的错误说明
	// 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。
	
    // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
    // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
    // 工具箱那里按键"send input" 这个： 
    // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}

	if (jo.obj == "truck" && jo.act == "newh_search") {
		if($scope.export_flag==true){//导出
			$scope.filename = "新手库";
			var arr = [["修改日期","商品名称","商品ID","商品价格","兑换商名称","兑换商ID"]];
			angular.forEach(jo.result,function(x){
				arr.push([$filter('date')(x.ut*1000,'yyyy-MM-dd HH:mm'), x.goods_name,x.goods_id, x.price, x.merchant_name, x.merchant_id]);
			});
			export2xlsx(arr,$scope.filename);
		}else {//查询
			$scope.dgtList = jo;
		}
	}

	  if (jo.obj == "truck" && jo.act == "search") {//添加新商品碎片-获取商品碎片列表
		  if(jo.status=="success"){
			  $scope.truckList = jo;
			  angular.forEach($scope.select_datas,function(a){
				 angular.forEach($scope.truckList.result,function(b){
					 if(a.goods_id == b.goods_id){
						 b.truckList_check = true;
					 }
				 }) ;
			  });
		  }
	  }

	  if (jo.obj == "truck" && jo.act == "newh_edit") {
		  if(jo.status=="success"){
			  alert("修改新手库成功！");
			  $('#save_add_suipian').hide();
			  $('#add_new_suipian').hide();
			  $scope.flush();
		  }
	  }

	  if (jo.obj == "truck" && jo.act == "newh_delete") {
		  if(jo.status=="success"){
			  alert("移除商品成功！");
			  $scope.flush();
		  }
	  }

	if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
		$scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
	}
  });
});
