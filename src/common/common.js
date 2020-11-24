var BmapConfig={
	strokeWeight:3,
}
//基础框架配置
layui.config({
	base : pageUrl+'/layuiadmin/modules/' //静态资源所在路径
	,closeFooter: true
	,chcheTab:false
}).extend({
	//index : 'lib/index' //主入口模块
	admin : 'admin'//新的管理模板
	,index : 'index' //新的主入口模块
	,formSelects: 'formSelects-v4'
	,iconPicker: 'iconPicker'
	,treetable: 'treetable'
	,layPhoto: 'layPhoto'
	,layUploader: 'layUploader'
	,soulTable: 'soulTable'
	,tableFilter: 'tableFilter'
	,tableChild: 'tableChild'
	,excel: 'excel'
	,tableMerge: 'tableMerge'
	,xmSelect: 'xm-select'
	,treeSelect: 'treeSelect'
	,dataGrid: 'dataGrid'
	,fileChoose: 'fileChoose/fileChoose'
	,dropdown: 'dropdown/dropdown'
	,notice: 'notice/notice'
}).use(['admin']);

//权限控制
var configjson = layui.data('layuiAdmin')['configjson_000'];
// console.info(configjson);
// ajax统一处理
if (window.jQuery) {
	// ajax预处理 后置处理
	jQuery(document).bind("ajaxSend", function(event, request, settings) {
		var userToken = getUserToken();
		if(!userToken){
			top.location.href = pageUrl + 'views/login.html';
		}
		var token = 'Bearer ' + userToken;
		// baseUrl 为需要设置token的 全局host,严格判断防止
		// token发送到其他站点被盗取
		if (token && baseUrl
				&& settings.url) {
			var headers = settings.headers || {};
			headers["Authorization"] = token;
			request.setRequestHeader("Authorization", token);
			settings.headers = headers;
		}
	}).bind( "ajaxComplete", function(event, xhr, settings) {
		if (baseUrl && settings.url
				&& (settings.dataType === 'JSON' || settings.dataType === 'json')) {
			if (xhr.status == 200 && xhr.responseText) {
				try {
					var resObj = JSON.parse(xhr.responseText);
					if(resObj && resObj.code==101){
						//token失效
						$.cookie('login_sid_t_we', '', {path: '/'});
						top.location.href = pageUrl + 'views/login.html';
					}else if(resObj.code==102){
						//无权限
						location.href = pageUrl + 'views/noAuthority.html';
					}
				} catch (e) {
					// console.error(e)
				}
			}
		}
	});
}

function getUserToken(){
	var value = $.cookie('login_sid_t_we');
	return value;
}

/** 获取当前项目的根路径，通过获取layui.js全路径截取assets之前的地址 */
function getProjectUrl() {
    var layuiDir = layui.cache.dir;
    if (!layuiDir) {
        var js = document.scripts, last = js.length - 1, src;
        for (var i = last; i > 0; i--) {
            if (js[i].readyState === 'interactive') {
                src = js[i].src;
                break;
            }
        }
        var jsPath = src || js[last].src;
        layuiDir = jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }
    return layuiDir.substring(0, layuiDir.indexOf('assets'));
}
