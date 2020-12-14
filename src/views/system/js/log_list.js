var datalist;
$(function(){
	datalist = $('#dataGrid');
	initDatagrid();
	layui.use(['element','laydate'], function(){
		var element = layui.element;
		var laydate = layui.laydate;

		laydate.render({
			elem : '#search_kssj'
		});
		laydate.render({
			elem : '#search_jssj'
		});
	});
});

function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : baseUrl+'/system/log/getPageList',
			page : true,
			cols : [ [ // 表头
			{
				field : 'log_time',
				title : '登录时间',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.log_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'log_ip',
				title : '登录IP',
				width : 150,
				align : 'center'
			},{
				field : 'log_user',
				title : '登录用户',
				width : 180,
				align : 'center'
			},{
				field : 'log_operateCN',
				title : '操作类型',
				width : 100,
				align : 'center'
			},{
				field : 'paramValue',
				title : '登录设备',
				width : 130,
				align : 'center',
				templet: function(d){
					return JSON.parse(d.param_value).device;
				}
			},{
				field : 'paramValue',
				title : '设备名称',
				width : 180,
				align : 'center',
				templet: function(d){
					return JSON.parse(d.param_value).deviceName;
				}
			},{
				field : 'paramValue',
				title : '设备类型',
				width : 160,
				align : 'center',
				templet: function(d){
					return JSON.parse(d.param_value).deviceModel;
				}
			},{
				field : 'paramValue',
				title : '登录位置',
				minWidth : 200,
				align : 'center',
				templet: function(d){
					return JSON.parse(d.param_value).location;
				}
			} ] ]
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		logUser : $("#search_logUser").val(),
		logDesc : $("#search_logDesc").val(),
		kssj : $("#search_kssj").val(),
		jssj : $("#search_jssj").val()
	};
	return temp;
}

function search() {
	datalist.reload('dataGrid', {
		where : queryParams()
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	layer.closeAll('iframe');
}

function reload() {
	datalist.reload('dataGrid', {
		where : queryParams()
	});
	layer.closeAll('iframe');
}
