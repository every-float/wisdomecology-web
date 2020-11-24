var URL_gb_areaTree = baseUrl + 'gb/getAreaTree';

//重点监管企业
var URL_companyInfo_list = baseUrl + 'we/company/getPageList';//企业列表信息
var URL_companyInfo_save = baseUrl + 'we/company/save';//保存重点监管企业信息
var URL_companyInfo_del = baseUrl + 'we/company/del';//删除重点监管企业信息
var URL_companyInfo_detailInfo = baseUrl+'we/company/getById';//重点监管企业信息详情
var URL_companyInfo_companyInfoType = baseUrl+'we/company/getCompanyInfoType';//企业分类

//闸口
var URL_gateInfo_list = baseUrl + 'we/gate/getPageList';//闸口列表信息
var URL_gateInfo_save = baseUrl + 'we/gate/save';//保存闸口信息
var URL_gateInfo_del = baseUrl + 'we/gate/del';//删除闸口信息
var URL_gateInfo_detailInfo = baseUrl+'we/gate/getById';//闸口信息详情
var URL_gateInfo_gateInfoType = baseUrl+'we/gate/getGateType';//闸口分类

// 河流监测数据
var URL_river_list = baseUrl + "we/river/getPageList";     // 获取河流列表
var URL_river_info = baseUrl + "we/river/getById";      // 获取河流信息
var URL_river_save = baseUrl + "we/river/save";         // 保存河流信息
var URL_river_delete = baseUrl + "we/river/del";        // 删除河流信息
var URL_river_site_list = baseUrl + "we/river/getDataPageList";     // 获取河流站点列表
var URL_river_site_info = baseUrl + "we/river/getDataById";     // 河流站点信息
var URL_river_site_save = baseUrl + "we/river/saveData";        // 保存河流站点信息
var URL_river_site_delete = baseUrl + "we/river/delData";       // 删除河流站点信息

// 断面预审数据
var URL_cross_section_list = baseUrl + "river/getRiverTree";      // 断面列表
var URL_approval_data_list = baseUrl + "river/getRiverData";      // 预审数据列表

// 独流减河
var URL_river_section_list = baseUrl + "river/getRiverDljhTree";        // 独流减河站点树
var URL_river_section_data = baseUrl + "river/getRiverDljhData";        // 独流减河数据

// 区域监测数据
var URL_area_list = baseUrl + "we/area/getPageList";     // 获取区域列表
var URL_area_info = baseUrl + "we/area/getById";      // 获取区域信息
var URL_area_save = baseUrl + "we/area/save";         // 保存区域信息
var URL_area_delete = baseUrl + "we/area/del";        // 删除区域信息
var URL_area_site_list = baseUrl + "we/area/getDataPageList";     // 获取区域站点列表
var URL_area_site_info = baseUrl + "we/area/getDataById";     // 区域站点信息
var URL_area_site_save = baseUrl + "we/area/saveData";        // 保存区域站点信息
var URL_area_site_delete = baseUrl + "we/area/delData";       // 删除区域站点信息

// 乡镇监测数据
var URL_town_list = baseUrl + "we/town/getPageList";     // 获取乡镇列表
var URL_town_info = baseUrl + "we/town/getById";      // 获取乡镇信息
var URL_town_save = baseUrl + "we/town/save";         // 保存乡镇信息
var URL_town_delete = baseUrl + "we/town/del";        // 删除乡镇信息
var URL_town_site_list = baseUrl + "we/town/getDataPageList";     // 获取乡镇站点列表
var URL_town_site_info = baseUrl + "we/town/getDataById";     // 乡镇站点信息
var URL_town_site_save = baseUrl + "we/town/saveData";        // 保存乡镇站点信息
var URL_town_site_delete = baseUrl + "we/town/delData";       // 删除乡镇站点信息

// 自动监测查询
var URL_monitor_search_list = baseUrl + "river/getRiverGridData";

// 报警管理
var URL_warning_value_list = baseUrl + "river/warning/getWarningValuesBySectionCode";   // 获取警告值列表
var URL_warning_value_set = baseUrl + "river/warning/setWarningValuesById";       // 报警值设定
var URL_warning_dealing_list = baseUrl + "river/warning/getWarningMsgPageList";        // 报警待处理清单
var URL_warning_dealt_list = baseUrl + "river/warning/getWarningMsgHistoryPageList";        // 报警已处理清单
var URL_warning_deal = baseUrl + "river/warning/processWarningMsg";     // 报警处理