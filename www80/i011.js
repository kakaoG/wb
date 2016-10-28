// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i011', function($scope,$filter) {
	$scope.export_flag1 = false;
	$scope.export_flag2 = false;
	$scope.export_flag3 = false;
	$scope.export_flag4 = false;
	$scope.navi = 0;
	var userid = localStorage.getItem("userid");
	//表格一
	$scope.data1 = {}
	$scope.table1fix = {
		"obj":"launchRecord",
		"act":"circle",
		"admin_id":userid,
		"condition":{},
		"page_num":1,
		"page_size":10,
	}

	//导出
	$scope.export_xlsx1 = function(){
		if($scope.data1.result.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag1 = true;
		var data = $.extend({},$scope.table1fix);
		data.condition={};
		if(data.state){
			data.condition.status=data.state
		}
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_size = $scope.table1fix.page_size*$scope.data1.total_page;
		data.page_num = 0;
		apiconn.send_obj(data);
	};

	//导出
	$scope.export_xlsx3 = function(){
		if($scope.data3.result.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag3 = true;
		var data = $.extend({},$scope.table3fix);
		data.condition={};
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_size = $scope.table3fix.page_size*$scope.data3.total_page;
		data.page_num = 0;
		apiconn.send_obj(data);
	};

	//导出
	$scope.export_xlsx4 = function(){
		if($scope.data4.result.length==0){
			alert("请先查询想要导出的数据");
			return;
		}
		$scope.export_flag4 = true;
		var data = $.extend({},$scope.table4fix);
		data.condition={};
		if(data.state){
			data.condition.status=data.state
		}
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_size = $scope.table4fix.page_size*$scope.data4.total_page;
		data.page_num = 0;
		apiconn.send_obj(data);
	};

	$scope.setTable1=function() {
		$scope.export_flag1 = false;
		var data = $.extend({},$scope.table1fix);
		data.condition={};
		if(data.state){
			data.condition.status=data.state
		}
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_num-=1;
		apiconn.send_obj(data);
	}

	$scope.left1=function (ok) {
		if(ok){
			$scope.table1fix.page_num--;
			$scope.setTable1();
		}
	}
	$scope.right1=function (ok) {
		if(ok){
			$scope.table1fix.page_num++;
			$scope.setTable1();
		}
	}

	//表格二
	//表格三
	$scope.data3 = {}
	$scope.table3fix = {
		"obj":"launchRecord",
		"act":"monster",
		"admin_id":userid,
		"condition":{},
		"page_num":1,
		"page_size":10,
	}
	$scope.setTable3=function() {
		$scope.export_flag3 = false;
		var data = $.extend({},$scope.table3fix);
		data.condition={};
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_num-=1;
		apiconn.send_obj(data);
	}

	$scope.left3=function (ok) {
		if(ok){
			$scope.table3fix.page_num--;
			$scope.setTable3();
		}
	}
	$scope.right3=function (ok) {
		if(ok){
			$scope.table3fix.page_num++;
			$scope.setTable3();
		}
	}
	//表格四
	$scope.data4 = {}
	$scope.table4fix = {
		"obj":"circle",
		"act":"fund_record",
		"admin_id":userid,
		"condition":{},
		"page_num":1,
		"page_size":10,
	}
	$scope.setTable4=function() {
		$scope.export_flag4 = false;
		var data = $.extend({},$scope.table4fix);
		data.condition={};
		if(data.type&&data.key){
			data.condition[data.type]=data.key;
		}
		data.page_num-=1;
		apiconn.send_obj(data);
	}

	$scope.left4=function (ok) {
		if(ok){
			$scope.table4fix.page_num--;
			$scope.setTable4();
		}
	}
	$scope.right4=function (ok) {
		if(ok){
			$scope.table4fix.page_num++;
			$scope.setTable4();
		}
	}
	//结束表格
	setTimeout(function () {
		$scope.setTable1();
	}, 0);

	//获取日期
	$scope.getdate = function (data1) {
		function zero(n) {
			return n >= 10 ? n : ('0' + n);
		}
		var data = new Date(data1?data1*1000:0);
		return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
	}

	$scope.gonav=function (index) {
		$scope.navi=index;
		switch (index){
			case 0:$scope.setTable1();break;
			// case 1:$scope.setTable2();break;
			case 2:$scope.setTable3();break;
			case 3:$scope.setTable4();break;
		}

	}

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
		if (jo.obj == "circle" && jo.act == "fund_record") {
			if($scope.export_flag4==true){//导出
				$scope.filename = "基金库物品管理记录";
				var arr = [["投放时间","商圈名称","商圈ID","投放物品名称","投放物品ID","物品价值","操作管理员"]];
				angular.forEach(jo.result,function(x){
					arr.push([$filter('date')(x.put_time*1000,'yyyy-MM-dd HH:mm'), x.circle_name, x.circle_id, x.goods_name, x.goods_id, x.price, x.admin_name]);
				});
				export2xlsx(arr,$scope.filename);
			}else {//查询
				$scope.data4 = jo;
			}
		}
		if (jo.obj == "launchRecord" && jo.act == "monster") {
			if($scope.export_flag3==true){//导出
				$scope.filename = "精灵物品管理记录";
				var detail = "";
				var detail1 = "";
				var arr = [["修改日期","选择的商品库","操作管理员","操作记录"]];
				angular.forEach(jo.result,function(x){
					detail = "";
					detail1 = "";
					for(var key= 0; key< x.lists.length; key++){
						detail += x.lists[key]+";";
					}
					for(var key= 0; key< x.records.length; key++){
						detail1 += x.records[key]+";";
					}
					arr.push([$filter('date')(x.ut*1000,'yyyy-MM-dd HH:mm'), detail, x.admin_name,detail1]);
				});
				export2xlsx(arr,$scope.filename);
			}else {//查询
				$scope.data3 = jo;
			}
		}
		if (jo.obj == "launchRecord" && jo.act == "circle") {
			if($scope.export_flag1==true){//导出
				$scope.filename = "地图物品管理记录";
				var detail = "";
				var detail1 = "";
				var arr = [["修改日期","商圈名称","商圈ID","选择商品库","状态","操作管理员","操作记录"]];
				angular.forEach(jo.result,function(x){
					detail = "";
					detail1 = "";
					for(var key= 0; key< x.lists.length; key++){
						detail += x.lists[key]+";";
					}
					for(var key= 0; key< x.records.length; key++){
						detail1 += x.records[key]+";";
					}
					arr.push([$filter('date')(x.ut*1000,'yyyy-MM-dd HH:mm'), x.circle_name,x.circle_id, detail,(x.status=='hide'?'隐藏中':'已消除'), x.admin_name,detail1]);
				});
				export2xlsx(arr,$scope.filename);
			}else {//查询
				$scope.data1 = jo;
			}
		}
		if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
			$scope.message = "帐号：" + IWEB_ACCOUNT + " 这边已经自动登录。请在工具箱那边登录：" + TOOLBOX_ACCOUNT
		}
	});

});



