// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i041', function($scope,$filter) {
	$scope.searchTypeKu = '查询类型';
	$scope.dolListKu = 10;
	$scope.searchTypeKuEdit = '查询类型';
	$scope.dolListKuEdit = 10;
	$scope.suipianshu = 1;
	$scope.searchTypeSuipian = '查询类型';

	$scope.dgt_pageNumber = 1;//商品库当前页
	$scope.dgt_pageSize = 10;
	$scope.DGT_info = {pageNumber:1,pageSize:10,key:'',updateTime:'',searchType:''};
	$scope.select_datas=[];

	//碎片信息分页
	$scope.truckListSearch = {pageNumber:1,pageSize:5,searchType:'',key:''};

	$scope.export_flag = false; //点击导出按钮标记：true导出，false查询
	$scope.export_flag_info = false; //点击导出按钮标记：true导出，false查询

	$scope.selectTruck = function(x){
		if(x.truckList_check){
			if(isNaN(x.truckList_text)||x.truckList_text<=0){
				alert("请输入正确的商品数量");
				x.truckList_check= false;
				x.truckList_text = "";
				return;
			}
			$scope.select_datas.push({"truck_id":x.truck_id,"truckList_text": x.truckList_text});
		}else{
			var i=0;
			angular.forEach($scope.select_datas,function(a){
				if(a.truck_id== x.truck_id){
					$scope.select_datas.splice(i,1);
				}
				i++;
			});
		}
	};
	$scope.updateTruckText = function(x){
		var reg = /^[0-9]+$/;
		if(!reg.test(x.truckList_text)){
			alert("请输入正确的商品数量");
			return;
		}
		angular.forEach($scope.select_datas,function(a){
			if(a.truck_id== x.truck_id){
				a.truckList_text = x.truckList_text;
			}
		});
	};
	
	$scope.datetimepicker = function(){ 
	$.datetimepicker.setLocale('ch');//设置中文
		$('#datetimepicker_daily').datetimepicker({
		  lang:"ch",           //语言选择中文
		  format:"Y-m-d",      //格式化日期
		  timepicker:false,    //关闭时间选项
		  yearStart:2000,     //设置最小年份
		  yearEnd:2050,        //设置最大年份
		  todayButton:true    //关闭选择今天按钮
		});
		$('#datetimepicker_daily_edit').datetimepicker({
		  lang:"ch",           //语言选择中文
		  format:"Y-m-d",      //格式化日期
		  timepicker:false,    //关闭时间选项
		  yearStart:2000,     //设置最小年份
		  yearEnd:2050,        //设置最大年份
		  todayButton:true    //关闭选择今天按钮
		});
	apiconn.send_obj({
		// 典型的请求都有这两个字段，
		"obj": "associate",
		"act": "mock",
		"to_login_name": TOOLBOX_ACCOUNT,
		"data": {
			"obj":"test",
			"act":"ng-focus", // 区分不同的输入
			// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
			// data 可以是复杂的哈希数组
			"data":"输入时间"
		}
	});
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

	$scope.showList07 = function(){
		$('#type_list_ku_edit').slideToggle(200);
		$('#type_list_ku_edit').children().click(function(){ 
			$scope.searchTypeKuEdit=$(this).html();
		});
	};
	$scope.showList08 = function(){ 
		$('#dol_list_ku_edit').slideToggle(200);
		$('#dol_list_ku_edit').children().click(function(){ 
			$scope.dolListKuEdit=$(this).html();
			$scope.DGT_info.pageSize = $scope.dolListKuEdit;
			$scope.DGT_info.pageNumber = 1;
			$scope.DGT_infoFlush();
		});
	};
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

	$scope.highShow = function(y){
		if(y<1000){
			return "tab_em_red";
		}
		return "";
	}
	
	//打开商圈列表
	$scope.showCircleInfo = function(x){
		$('#circle_info').show();
		$scope.dgt_circle_info = x;
	};
	//关闭商圈列表
	$scope.closeCircleInfo = function(){
		$('#circle_info').hide();
	};
	
	//编辑商品库
	$scope.editKu = function(x){
		$('#menu_ku').hide();
		$('#menu_ku_edit').show();
		$scope.newDgtName = x.DGT_name;
		$scope.newDgtId = x.DGT_id;
		$scope.DGT_info = {pageNumber:1,pageSize:10,key:'',updateTime:'',searchType:''};
		$scope.DGT_infoInput="";
		$scope.DGT_infoInput1="";
		$scope.DGT_infoInput2="";
		$scope.DGT_infoFlush();
	};

	$scope.DGT_infoSearch_all = function(){
		$scope.DGT_info.pageNumber = 1;
		$scope.DGT_info.updateTime="";
		$scope.DGT_info.searchType="";
		$scope.DGT_info.key="";
		$scope.DGT_infoFlush();
	}

	$scope.DGT_infoSearch = function(){
		$scope.DGT_info.pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","兑换商ID":"merchant_id","商品名称":"name","商品ID":'truck_id',"商品价格区间":"price"};
		var key = a[$scope.searchTypeKuEdit];
		$scope.DGT_info.searchType = key;
		if(key=='price'){
			$scope.DGT_info.key = [parseInt($scope.DGT_infoInput1),parseInt($scope.DGT_infoInput2)];
		}else{
			$scope.DGT_info.key = $scope.DGT_infoInput;
		}
		var DGT_info_UdateTime=$('#datetimepicker_daily_edit').val()+' 00:00:00';
		$scope.DGT_info.updateTime = (new Date(DGT_info_UdateTime).valueOf())/1000;
		$scope.DGT_infoFlush();
	}

	//导出  编辑日常商品库
	$scope.export_xlsx_info = function(){
		if($scope.dgtInfo.list.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag_info = true;
		var records = $scope.DGT_info.pageSize*$scope.dgtInfo.total_page;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "DGT",
			"act": "info",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":localStorage.getItem("userid"),
			"DGT_id": $scope.newDgtId,
			"update_time":$scope.DGT_info.updateTime,
			"search_type":$scope.DGT_info.searchType,
			"key":$scope.DGT_info.key,
			"page_num":0,
			"page_size":records
		});
	};

	$scope.DGT_infoFlush = function(){
		$scope.export_flag_info = false;
		apiconn.send_obj({
			"obj":"DGT",
			"act":"info",
			"DGT_id": $scope.newDgtId,
			"update_time":$scope.DGT_info.updateTime,
			"search_type":$scope.DGT_info.searchType,
			"key":$scope.DGT_info.key,
			"page_num":$scope.DGT_info.pageNumber-1,
			"page_size":$scope.DGT_info.pageSize
		});
	}
	//编辑日常商品库 上一页
	$scope.DGT_info_prev = function(){
		if($scope.DGT_info.pageNumber>1){
			$scope.DGT_info.pageNumber--;
			$scope.DGT_infoFlush();
		}
	}
	//编辑日常商品库 下一页
	$scope.DGT_info_next = function(){
		if($scope.DGT_info.pageNumber<$scope.dgtInfo.total_page){
			$scope.DGT_info.pageNumber++;
			$scope.DGT_infoFlush();
		}
	}

	//返回商品库
	$scope.returnMenuKu = function(){
		$('#menu_ku').show();
		$('#menu_ku_edit').hide();
		$scope.searchTypeKu = '查询类型';
		$scope.dgt_pageNumber = 1;
		$scope.dgt_searchTtpe = "";
		$scope.dgt_input = "";
		$scope.dgt_updateTime = null;
		$('#datetimepicker_daily').val("");
		$scope.dgt_search();
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
			"obj":"DGT",
			"act":"delete",
			"DGT_id":$scope.dgt_id
		});
	};
	//添加新商品库
	$scope.addKu = function(){
		$scope.newDgtName = "";
		$('#add_ku_remind').show();
	};
	$scope.addKuNot = function(){ 
		$('#add_ku_remind').hide();
	};
	$scope.addKuYes = function(){
		apiconn.send_obj({
			"obj":"DGT",
			"act":"add",
			"DGT_name":$scope.newDgtName
		});
	};
	//改变库名称
	$scope.changeKuName = function(){ 
		$('#ku_name_remind').show();
	};
	$scope.changeKuNameNot = function(){ 
		$('#ku_name_remind').hide();
	};
	$scope.changeKuNameYes = function(){ 
		$('#ku_name_remind').hide();
		apiconn.send_obj({
			"obj":"DGT",
			"act":"update_name",
			"DGT_id":$scope.newDgtId,
			"name":$scope.newDgtName
		});
	};
	//修改碎片数量
	$scope.changeSuipianNum = function(x){
		$('#change_suipian_remind').show();
		$scope.suipian_num = x;
	};
	$scope.changeSuipianNot = function(){ 
		$('#change_suipian_remind').hide();
	};
	$scope.changeSuipianYes = function(id){
		if(!$scope.suipian_num_input){
			alert("请输入碎片数量");
			return;
		}
		$('#change_suipian_remind').hide();
		//编辑商品库(修改碎片数量)
		apiconn.send_obj({
			"obj":"DGT",
			"act":"update_piece",
			"truck_id":id,
			"piece_no":$scope.suipianshu,
			"piece_num":$scope.suipian_num_input
		});
	};
	//移除商品
	$scope.deleteGoods = function(id){
		$('#delete_edit_ku').show();
		$scope.truck_id = id;
	};
	$scope.deleteGoodsNot = function(){ 
		$('#delete_edit_ku').hide();
	};
	$scope.deleteGoodsYes = function(){ 
		$('#delete_edit_ku').hide();
		//移除
		apiconn.send_obj({
			"obj":"DGT",
			"act":"delete_truck",
			"DGT_id":$scope.newDgtId,
			"truck_id":$scope.truck_id
		});
	};
	//添加新碎片
	$scope.addNewSuipian = function(){ 
		$('#add_new_suipian').show();
		$scope.select_datas=[];
		//查询所有碎片
		$scope.truckListSearch.pageNumber = 1;
		$scope.searchTypeSuipian = "查询类型";
		$scope.truckListInput = "";
		$scope.truckListInput1 = "";
		$scope.truckListInput2 = "";
		$scope.truckListSearch.searchType = "";
		$scope.truckListSearch.key = "";
		$scope.truckListFlush();
	};

	$scope.truckListFlush=function(){
		apiconn.send_obj({
			"obj":"truck",
			"act":"list",
			"DGT_id":$scope.newDgtId,
			"search_type":$scope.truckListSearch.searchType,
			"key":$scope.truckListSearch.key,
			"page_num":$scope.truckListSearch.pageNumber-1,
			"page_size":5
		});
	}

	$scope.truckListSearch_all=function() {
		$scope.truckListSearch.pageNumber = 1;
		$scope.truckListSearch.searchType = "";
		$scope.truckListSearch.key = "";
		$scope.truckListFlush();
	}

	$scope.truckListSearch=function(){
		$scope.truckListSearch.pageNumber = 1;
		var a = {"兑换商名称":"merchant_name","兑换商ID":"merchant_id","商品名称":"name","商品ID":'truck_id',"商品价格区间":"price"};
		var key = a[$scope.searchTypeSuipian];
		$scope.truckListSearch.searchType = key;
		if(key=='price'){
			$scope.truckListSearch.key = parseInt($scope.truckListInput1)+"-"+parseInt($scope.truckListInput2);
		}else{
			$scope.truckListSearch.key = $scope.truckListInput;
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
		var truck_num = [];
		angular.forEach($scope.select_datas,function(x){
			truck_id.push(x.truck_id);
			truck_num.push(x.truckList_text);
		});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "DGT",
			"act": "put_truck",
			"DGT_id": $scope.newDgtId,
			"truck_id":truck_id,
			"truck_num":truck_num
		});
	};

	//跳转至商圈编辑
	$scope.circle_update = function(id,type){
		if(type=="circle"){
			apiconn.send_obj({
				// 典型的请求都有这两个字段，
				"obj": "circle",
				"act": "info",
				"circle_id":id
			});
		}else{

		}
	}
	
	
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
		$scope.dgt_updateTime = "";
		$scope.dgt_searchTtpe = "";
		$scope.dgt_input = "";
		$scope.flush();
	}
	//商品库查询
	$scope.dgt_search = function(){
		$scope.dgt_pageNumber = 1;
		var a = {"投放商圈名":"circle_name","商品库名":"DGT_name","商品库ID":"DGT_id","投放商圈ID":"circle_id"};
		$scope.dgt_searchTtpe = a[$scope.searchTypeKu];
		$scope.dgtUpdateTime=$('#datetimepicker_daily').val()+' 00:00:00';
		$scope.dgt_updateTime = (new Date($scope.dgtUpdateTime).valueOf())/1000;
		$scope.flush();
	}


	//导出
	$scope.export_xlsx = function(){
		if($scope.dgtList.DGT_list.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag = true;
		var records = $scope.dgt_pageSize*$scope.dgtList.total_page;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "DGT",
			"act": "list",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":localStorage.getItem("userid"),
			"update_time":$scope.dgt_updateTime,
			"search_type":$scope.dgt_searchTtpe,
			"key":$scope.dgt_input,
			"page_num":0,
			"page_size":records
		});
	};

	$scope.flush=function(){
		$scope.export_flag = false;
		apiconn.send_obj({
			"obj":"DGT",
			"act":"list",
			"update_time":$scope.dgt_updateTime,
			"search_type":$scope.dgt_searchTtpe,
			"key":$scope.dgt_input,
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

	if (jo.obj == "DGT" && jo.act == "list") {
		if($scope.export_flag==true){//导出
			$scope.filename = "日常商品库";
			var detail = "";
			var index = 1;
			var arr = [["修改日期","商品库名称","商品库ID","投放商圈/商店"]];
			angular.forEach(jo.DGT_list,function(x){
				detail = "";
				index = 1;
				angular.forEach(x.put_circle,function(y){
					detail += index+"."+y.circle_name+";";
					index ++;
				});
				angular.forEach(x.put_shop,function(z){
					detail += index+"."+z.shop_name+";";
					index ++;
				});
				arr.push([$filter('date')(x.update_time*1000,'yyyy-MM-dd HH:mm'), x.DGT_name,x.DGT_id, detail]);
			});
			export2xlsx(arr,$scope.filename);
		}else {//查询
			$scope.dgtList = jo;
		}
	}
	if (jo.obj == "DGT" && jo.act == "update_name") {
		if(jo.status=="success"){
			alert(jo.msg);
		}
	}
	  if (jo.obj == "DGT" && jo.act == "add") {
		  if(jo.status=="success"){
			  alert("添加成功！");
			  $scope.flush();
			  $('#menu_ku').hide();
			  $('#menu_ku_edit').show();
			  $('#add_ku_remind').hide();
			  $scope.newDgtId = jo.DGT_id;
			  $scope.newDgtName = jo.DGT_name;
			  $scope.DGT_info = {pageNumber:1,pageSize:10,key:'',updateTime:'',searchType:''};
			  $scope.DGT_infoInput="";
			  $scope.DGT_infoInput1="";
			  $scope.DGT_infoInput2="";
			  $scope.DGT_infoFlush();
		  }
	  }
	  if (jo.obj == "DGT" && jo.act == "put_truck") {
		  if(jo.status=="success"){
			  alert("添加商品碎片成功！");
			  $('#save_add_suipian').hide();
			  $('#add_new_suipian').hide();
			  $scope.DGT_infoFlush();
		  }
	  }
	  if (jo.obj == "DGT" && jo.act == "delete") {
		  alert(jo.msg);
		  $scope.flush();
	  }
	  if (jo.obj == "DGT" && jo.act == "delete_truck") {
		  if(jo.status=="success"){
			  alert("移除商品成功！");
			  $scope.DGT_infoFlush();
		  }
	  }
	  if (jo.obj == "DGT" && jo.act == "update_piece") {
		  if(jo.status=="success"){
			  alert("修改碎片数量成功！");
			  $scope.DGT_infoFlush();
		  }
	  }
	  if (jo.obj == "DGT" && jo.act == "info") {
		  if($scope.export_flag_info==true){//导出
			  $scope.filename = "编辑商品库";
			  var detail = "";
			  var index = 0;
			  var arr = [["修改日期","商品名称","商品ID","商品价格","最低可见等级","兑换商名称","兑换商ID","剩余碎片(个)"]];
			  angular.forEach(jo.list,function(x){
				  detail = "";
				  index = 0;
				  angular.forEach(x.piece_num,function(y){
					  detail += (index<4?index+1:index+2)+"号："+y+";";
					  index ++;
				  });
				  arr.push([$filter('date')(x.update_time*1000,'yyyy-MM-dd HH:mm'), x.name,x.truck_id, x.price,x.show_level, x.merchant_name, x.merchant_id,detail]);
			  });
			  export2xlsx(arr,$scope.filename);
		  }else{//查询
			  $scope.dgtInfo = jo;
		  }
	  }
	  if (jo.obj == "truck" && jo.act == "list") {//添加新商品碎片-获取商品碎片列表
		  if(jo.status=="success"){
			  $scope.truckList = jo;
			  angular.forEach($scope.select_datas,function(a){
				 angular.forEach($scope.truckList.truck_list,function(b){
					 if(a.truck_id == b.truck_id){
						 b.truckList_check = true;
						 b.truckList_text = a.truckList_text;
					 }
				 }) ;
			  });
		  }
	  }
	  if (jo.obj == "circle" && jo.act == "info") {//跳转至商圈编辑页面
		  $scope.circle_info = jo;
		  $('#circle_info').hide();
	  }
	if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
		$scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
	}
  });
	//初始化日期控件
	datetimepicker('datetimepicker_daily');
	datetimepicker('datetimepicker_daily_edit');
});

//时间控件
function datetimepicker(id){
	$.datetimepicker.setLocale('ch');//设置中文
	$('#'+id).datetimepicker({
		lang:"ch",           //语言选择中文
		format:"Y-m-d",      //格式化日期
		timepicker:false,    //关闭时间选项
		yearStart:2000,     //设置最小年份
		yearEnd:2050,        //设置最大年份
		todayButton:true    //关闭选择今天按钮
	});
};