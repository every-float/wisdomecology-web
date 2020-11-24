//人员组
var URL_group_list = baseUrl+'system/group/getPageList';//数据列表
var URL_group_save = baseUrl+'system/group/save';
var URL_group_del = baseUrl+'system/group/del'; //删除
var URL_group_initParamInfo = baseUrl+"system/group/initParamInfo";
var URL_group_detailInfo = baseUrl+'system/group/detailInfo'; //详情信息
var URL_group_userList = baseUrl+'system/group/getUserList'; //组内人员
var URL_group_switchUser = baseUrl+"system/group/switchUser";

var URL_menu_initParamInfo = baseUrl+'system/menu/initParamInfo';//菜单初始化
var URL_menu_moduleMenuList = baseUrl+'system/menu/getMenuTree';//子系统菜单
var URL_menu_save = baseUrl + 'system/menu/save';
var URL_menu_del = baseUrl+'system/menu/del';
var URL_menu_treeBtnList = baseUrl+'system/menu/getMenuBtnTree';//菜单树

var URL_privilege_list = baseUrl+'system/privilege/getList';//权限列表
var URL_privilege_switch = baseUrl+'system/privilege/switchUse';
var URL_privilege_save = baseUrl+'system/privilege/save';
var URL_privilege_detailInfo = baseUrl+'system/privilege/detailInfo'; //权限详情信息
var URL_privilege_checkCode = baseUrl+'/system/privilege/checkCode';

var URL_dataInfo_list = baseUrl+'system/dataInfo/getPageList';//数据字典列表
var URL_dataInfo_save = baseUrl+'system/dataInfo/save';
var URL_dataInfo_del = baseUrl+'system/dataInfo/del'; //删除
var URL_dataInfo_initParamInfo = baseUrl+"system/dataInfo/initParamInfo";
var URL_dataInfo_detailInfo = baseUrl+'system/dataInfo/detailInfo'; //详情信息

var URL_module_list = baseUrl+'system/module/getPageList';//子系统列表
var URL_module_save = baseUrl+'system/module/save';
var URL_module_del = baseUrl+'system/module/del'; //删除
var URL_module_initParamInfo = baseUrl+"system/module/initParamInfo";
var URL_module_detailInfo = baseUrl+'system/module/detailInfo'; //详情信息

var URL_config_list = baseUrl+'system/config/getPageList';//列表
var URL_config_save = baseUrl+'system/config/save';
var URL_config_del = baseUrl+'system/config/del'; //删除
var URL_config_initParamInfo = baseUrl+"system/config/initParamInfo";
var URL_config_detailInfo = baseUrl+'system/config/detailInfo'; //详情信息

var URL_inteRole_list = baseUrl+'system/inteRole/getPageList';//数据权限列表
var URL_inteRole_save = baseUrl+'system/inteRole/save';
var URL_inteRole_savebatch = baseUrl+'system/inteRole/savebatch';
var URL_inteRole_del = baseUrl+'system/inteRole/del'; //删除
var URL_inteRole_initParamInfo = baseUrl+"system/inteRole/initParamInfo";
var URL_inteRole_detailInfo = baseUrl+'system/inteRole/detailInfo'; //详情信息

var URL_depart_treeList = baseUrl+'system/depart/getTreeList';//组织结构树
var URL_depart_initParamInfo = baseUrl+"system/org/initParamInfo";//组织结构初始化
var URL_depart_save = baseUrl+'system/depart/save';//组织结构保存
var URL_depart_del = baseUrl+'system/depart/del';//组织结构删除
var URL_depart_checkCode = baseUrl+'system/depart/checkCode';//组织结构校验编码
var URL_position_list = baseUrl+'system/position/getList';//岗位列表
var URL_position_detailInfo = baseUrl+'system/position/detailInfo';//岗位详情
var URL_position_initParamInfo = baseUrl+'system/position/getByDepartId';//岗位初始化
var URL_position_save = baseUrl+'system/position/save';//岗位保存
var URL_position_del = baseUrl+'system/position/del';//岗位删除

var URL_userInfo_positionList = baseUrl+'/system/userInfo/getPositionList';//岗位人员列表
var URL_userInfo_switchUser = baseUrl+'/system/userInfo/switchUserPostion';//设定岗位人员

var URL_userInfo_treeList = baseUrl+'system/userInfo/getUserTreeList';//人员结构树
var URL_userInfo_list = baseUrl+'system/userInfo/getList';//用户列表
var URL_userInfo_del = baseUrl+"system/userInfo/del";//删除用户
var URL_userInfo_save = baseUrl+'system/userInfo/save';//保存用户信息
var URL_userInfo_initParamInfo = baseUrl+'system/userInfo/initParamInfo';//用户初始化
var URL_userInfo_detailInfo = baseUrl+'system/userInfo/detailInfo';//用户信息
var URL_userInfo_selectDepartList = baseUrl+'system/userInfo/getDepartJsonForSelect';//用户部门

var URL_role_list = baseUrl+'system/role/getPageList';//角色列表
var URL_role_del = baseUrl+"system/role/del";//删除角色
var URL_role_save = baseUrl+'system/role/save';//保存角色信息
var URL_role_detailInfo = baseUrl+'system/role/detailInfo';//角色信息
var URL_role_initParamInfo = baseUrl+'system/role/initParamInfo';//角色初始化
var URL_role_savePurview = baseUrl+'system/role/savePurview';
var URL_role_initParamInfo2 = baseUrl+'system/role/initParamInfo2';//角色初始化子系统
var URL_role_savePurview2 = baseUrl+'/system/role/savePurview2';
var URL_role_userList=baseUrl+'system/role/getUserList';//角色用户列表
var URL_role_switchUser = baseUrl+"system/role/switchUser";

var URL_onlineUser_list = baseUrl+'system/onlineUser/getPageList';//在线用户列表
var URL_onlineUser_del = baseUrl+'system/onlineUser/del'; //踢出

var URL_thirdbind_list = baseUrl+'system/thirdbind/getPageList';//三方绑定用户列表
var URL_thirdbind_del = baseUrl+'system/thirdbind/del'; //解绑

var URL_appMenu_treeBtnList = baseUrl+'app/menu/getMenuBtnTree';//菜单树
var URL_appRole_savePurview = baseUrl+'app/role/savePurview';

// 噪音管理
var URL_area_list = baseUrl + "noise/getPointList";     // 区域列表
var URL_area_noise_list = baseUrl + "noise/getPageList";     // 区域噪音列表
var URL_over_noise_list = baseUrl + "noise/getExceedPageList";     // 超标噪音列表