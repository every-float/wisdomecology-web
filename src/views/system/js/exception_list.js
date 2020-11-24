var datalist;
$(function(){
	datalist = $('#dataGrid');
	initDatagrid();
	layui.use(['laydate'], function() {
		var laydate = layui.laydate;
		laydate.render({ 
			elem: '#search_kssj'
			,type: 'datetime'
		});
	});
});

function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : baseUrl+'/system/exception/getPageList',
			page : true,
			cols : [ [ // 表头
			{
				field : 'create_time',
				title : '时间',
				width : 180,
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'class_name',
				title : '异常类'
			},{
				field : 'method_name',
				title : '异常方法'
			},{
				field : 'exception',
				title : '异常内容'
			} ] ]
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		kssj : $("#search_kssj").val()
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
