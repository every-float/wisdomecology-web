var URL_gb_areaTree = baseUrl + 'gb/getAreaTree';
var URL_company_list = baseUrl + 'sop/getPageList';
var URL_company_info_detail = baseUrl + "sop/getById";  // 详情
var URL_company_info_save = baseUrl + "sop/save";  // 保存
var URL_company_info_update = baseUrl + "sop/update";  // 修改
var URL_company_info_delete = baseUrl + "sop/del";  // 删除
var URL_get_company_type = baseUrl + "sop/getIndustryAll";  // 获取行业类别

var URL_sop_video_list = baseUrl + 'sop/video/getPageList';

// 污染源企业树形图
var URL_pollution_company_list = baseUrl + "wry/psbaseinfo/getTreeList";

// 污染源监控
var URL_waste_gas_list = baseUrl + "wry/psbaseinfo/getFQPageList";      // 废气监控
var URL_waste_water_list = baseUrl + "wry/psbaseinfo/getFSPageList";      // 废水监控

// 污染源报表
var URL_waste_gas_report_daily = baseUrl + "wry/fq/statistics/getDayStatList";  // 废气-日报表
var URL_waste_gas_report_monthly = baseUrl + "wry/fq/statistics/getMonthStatList";  // 废气-月报表
var URL_waste_gas_report_quarter = baseUrl + "wry/fq/statistics/getQuarterStatList";  // 废气-季报表
var URL_waste_gas_report_yearly = baseUrl + "wry/fq/statistics/getYearStatList";  // 废气-年报表
var URL_waste_water_report_daily = baseUrl + "wry/fs/statistics/getDayStatList";  // 废水-日报表
var URL_waste_water_report_monthly = baseUrl + "wry/fs/statistics/getMonthStatList";  // 废水-月报表
var URL_waste_water_report_quarter = baseUrl + "wry/fs/statistics/getQuarterStatList";  // 废水-季报表
var URL_waste_water_report_yearly = baseUrl + "wry/fs/statistics/getYearStatList";  // 废水-年报表

// 同比报表
var URL_common_size_report = baseUrl + "wry/fq/statistics/getComparisonSame";

// 预警信息
var URL_waste_gas_beyond_index = baseUrl + "wry/fq/statistics/getWarnStatList";     // 废气超标统计
var URL_waste_water_beyond_index = baseUrl + "wry/fs/statistics/getWarnStatList";     // 废水超标统计