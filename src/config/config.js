// 接口统一配置
var baseUrl = profiles.baseUrl;//数据接口
var wsUrl = profiles.wsUrl;//websocket服务器
var baseUrl_https = profiles.baseUrl_https;//数据接口
var wsLiveUrl = profiles.wsLiveUrl;//websocket
var jsonUrl = profiles.jsonUrl;//有几个json文件的接口是这个路径（不要删）
var rtmpUrl = profiles.rtmpUrl;//RTMP
var chatUrl = profiles.chatUrl;//聊天


//50条分页
var lay_limits=[50,100,200,500];
var lay_limit=50;
//500条分页
var lay_more_limits = [500,1000,2000,5000];
var lay_more_limit = 500;
//1000条分页
var lay_most_limits = [1000,2000,5000,10000];
var lay_most_limit = 1000;

//基础信息
var URL_login = baseUrl + "login/check";		// 登录
var URL_logout = baseUrl + "login/logout";		// 退出登录
var URL_userInfo = baseUrl + "index/getUserInfo";		// 获取用户信息
var URL_index_menu_list = baseUrl + "index/getHomeInfo";		// 获取首页菜单列表