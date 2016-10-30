// Based on AngularJS 1.4.2


// 【初始化和登录 执行顺序 A--G】

// 【1】开发者应该有自己两个帐号，一个在工具箱登录，一个是本程序APP登录用的。
// IWEB_ACCOUNT 是本程序APP用的，TOOLBOX_ACCOUNT 是工具箱登录用的。工具箱
// 登录后可以观察APP发送的数据，也可以给APP发送数据
// APP 发送的数据叫 “输入” 输入可以是用户输入，界面操作，按键按下等

var IWEB_ACCOUNT    = "18046092141"; // APP启动时候登录
var TOOLBOX_ACCOUNT = "18046092142"; // 工具箱配合的账号



var iweb = angular.module('iweb', ['ngRoute','starter.directive',"ngSanitize", "ngCsv"]);

// AngularJS 路由。所有UI页的配置，每个都有UI布局页面 html文件 和对应的控制器代码
iweb.config(['$routeProvider',
  	function($routeProvider) {

		// 我们的风格是进入页面在这里创建 controller 所以具体的 html 里面不用声明 ng-controller 了
    		$routeProvider.
      		when('/i000', {
    			templateUrl: 'i000.html',
    			controller: 'i000'
      		}).
			when('/i010', {
    			templateUrl: 'i010.html',
    			controller: 'i010'
      		}).
			when('/i011', {
    			templateUrl: 'i011.html',
    			controller: 'i011'
      		}).
			when('/i012', {
    			templateUrl: 'i012.html',
    			controller: 'i012'
      		}).
      		when('/i040', {
    			templateUrl: 'i040.html',
    			controller: 'i040'
      		}).
      		when('/i041', {
    			templateUrl: 'i041.html',
    			controller: 'i041'
      		}).
      		when('/i042', {
    			templateUrl: 'i042.html',
    			controller: 'i042'
      		}).
				when('/i048', {
					templateUrl: 'i048.html',
					controller: 'i048'
				}).
			when('/i051', {
				templateUrl: 'i051.html',
				controller: 'i051'
			}).
				when('/i052', {
					templateUrl: 'i052.html',
					controller: 'i052'
				}).
				when('/i053', {
					templateUrl: 'i053.html',
					controller: 'i053'
				}).
				when('/i054', {
					templateUrl: 'i054.html',
					controller: 'i054'
				}).
				when('/i055', {
					templateUrl: 'i055.html',
					controller: 'i055'
				}).
      		when('/i072', {
    			templateUrl: 'i072.html',
    			controller: 'i072'
      		}).
      		when('/main', {
    			templateUrl: 'main.html',
    			controller: 'main'
      		}).
				when('/i020', {
					templateUrl: 'i020.html',
					controller: 'i020'
				}).
				when('/i021', {
					templateUrl: 'i021.html',
					controller: 'i021'
				}).
				when('/i022', {
					templateUrl: 'i022.html',
					controller: 'i022'
				}).
				when('/i023', {
					templateUrl: 'i023.html',
					controller: 'i023'
				}).
				when('/i060', {
					templateUrl: 'i060.html',
					controller: 'i060'
				}).
				when('/i061', {
					templateUrl: 'i061.html',
					controller: 'i061'
				}).
				when('/i062', {
					templateUrl: 'i062.html',
					controller: 'i062'
				}).
				when('/i070', {
					templateUrl: 'i070.html',
					controller: 'i070'
				}).
				when('/i082', {
					templateUrl: 'i082.html',
					controller: 'i082'
				}).
				when('/i120', {
					templateUrl: 'i120.html',
					controller: 'i120'
				}).
				when('/i121', {
					templateUrl: 'i121.html',
					controller: 'i121'
				}).
				when('/i122', {
					templateUrl: 'i122.html',
					controller: 'i122'
				}).
				when('/i123', {
					templateUrl: 'i123.html',
					controller: 'i123'
				}).
			when('/i200', {
				templateUrl: 'i200.html',
				controller: 'i200'
			}).
      		otherwise({
    			redirectTo: '/main'
      		});
}]);

// save a handle to the $rootScope obj
var rootScope;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 跳转到某个控制器，一个UI页就是一个控制器
function goto_view(v) {
  	var baseUrl = window.location.href;
	baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
	window.location.href = baseUrl + "#/" + v;
	return false;
}

// 全局SDK用的变量 【初始化和登录 A】
var apiconn = new APIConnection();

// client_info 可选，每次请求，会自动带上，发送给服务端
apiconn.client_info.clienttype = "web";

// 定义这样一个监听器，用来处理SDK 来的说与服务端连接状态改变了的通知 【初始化和登录 B】
apiconn.state_changed_handler = function() {

	rootScope.$apply(function() {
	
		console.log("state: "+apiconn.from_state+" => "+apiconn.conn_state);
	
		// 这时候成功进入登录状态了。没登录时候只是访客状态。【初始化和登录 G】
		if (apiconn.conn_state == "IN_SESSION") {
	
			sessionStorage.setItem("login_name", apiconn.login_name);
			sessionStorage.setItem("login_passwd", apiconn.login_passwd);
				
		// 连接状态，表明SDK和服务端已经成功连上，获得了 server_info
		// 客户端可以允许用户输入密码（或从客户端保存密码）进行登录了 【初始化和登录 E】
		} else if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {
	
			// auto re login after page refresh
			// 处理网页刷新自动登录的机制
			/*
			if (apiconn.login_name == "" && apiconn.credential_data == null) {
	
				var login_name = sessionStorage.getItem("login_name");
	            var login_passwd = sessionStorage.getItem("login_passwd");
			
				var cred = sessionStorage.getItem("credential_data");
				var cred_obj = null;
				if (cred !== "") cred_obj = JSON.parse(cred);
	
				if (login_name != "" && login_name != null) {
					apiconn.credential(login_name, login_passwd);
	                apiconn.connect();
	
				} else if (cred_obj != null) {
					apiconn.credentialx(cred_obj);
	                apiconn.connect();
					
				} else {
				}
			}*/
			
		}
		
		rootScope.$broadcast("STATE_CHANGED_HANDLER", {});
	});
};


// SDK 说服务端有数据过来了，这可以是请求的响应，或推送 【初始化和登录 C】
apiconn.response_received_handler = function(jo) {
    var key=jo.obj+"_"+jo.act;
    
    if(key=="server_info"){
        localStorage.setItem("server_info",JSON.stringify(jo));
    }
    
    if(key=="person_login"){
        if(jo.status=="success"){
            localStorage.setItem("koaccount","yes");
            var kodata={
                _id:jo.user_info._id,
                sess:jo.sess
            }
            localStorage.setItem("kodata",JSON.stringify(kodata));
        }else{
            localStorage.removeItem("koaccount");
            localStorage.removeItem("kodata");
        }
           
    }

	rootScope.$apply(function() {
		
		// 通用报错机制
		if (jo.ustr != null && jo.ustr != "") alert(jo.ustr);

		// 通过这个机制，分发到所有控制器，感兴趣的控制器可以这样监听
		// $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {}
		if (jo.obj == "sdk" && jo.act == "switchreq") {
			return goto_view(jo.ixxx);
		}
		
		rootScope.$broadcast("RESPONSE_RECEIVED_HANDLER", jo);
	});
};


// 【初始化和登录 D】
apiconn.wsUri = common_wsUri;

iweb.run(['$rootScope', function ($rootScope) {
	rootScope = $rootScope;
    
    if(!apiconn.server_info || apiconn.server_info && apiconn.server_info.download_path==undefined){
        //如果登录页面
        if(window.location.href.match("index.html#/main")){
            apiconn.connect();
        }else if(!window.location.href.match("#/")){
            apiconn.connect();
        }else{
            //不是登录直接从缓存拿
            var server_info=localStorage.getItem("server_info");
            if(!server_info || server_info==""){
                apiconn.connect();
            }else{
                apiconn.server_info=JSON.parse(server_info);
            }
        }
    }
}]);


