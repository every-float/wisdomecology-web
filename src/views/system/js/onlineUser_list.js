var datalist;
$(function(){
	initDatagrid();
});
function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_onlineUser_list,
			page : true,
			autoSort: false,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'user_name',
				title : '用户名称',
				width : 120,
				sort: true
			}, {
				field : 'real_name',
				title : '真实姓名',
				width : 120
			}, {
				field : 'token',
				title : 'token',
				width: 120
			}, {
				field : 'origin',
				title : '登录方式',
				width : 100,
				templet: function(d){
					var ss='';
					if(d.origin=='web'){
						ss='<span class="layui-badge" style="background: #F56C6C">WEB</span>';
					}else if(d.origin=='app'){
						ss='<span class="layui-badge" style="background: #409EFF">APP</span>';
					}
					return ss;
				}
			}, {
				field : 'ip',
				title : 'IP',
				width : 160
			}, {
				field: 'create_time',
				title: '创建时间',
				width: 180,
				sort: true,
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'last_access_time',
				title : '最后操作时间',
				width : 180,
				sort: true,
				templet: '<div>{{ new Date(d.last_access_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'browser',
				title : '浏览器',
				width : 120
			}, {
				field : 'unique_id',
				title : '设备标识',
				width : 330
			}, {
				field : 'device',
				title : '设备',
				width : 100
			}, {
				field : 'device_name',
				title : '设备名称',
				width : 200
			}, {
				field : 'device_model',
				title : '设备型号',
				width : 150
			}, {
				field : 'location',
				title : '地址',
				width : 220
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;

		});
		//监听排序
		datalist.on('sort(dataGrid)', function(obj){
			reload(obj);
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = {
		userName : $("#search_userName").val(),
		field: params.field, //排序字段
		order: params.type //排序方式
	};
	return temp;
}
//默认排序
var defaultSort = {
	field: 'create_time', //排序字段
	type: 'desc' //排序方式
};

function search() {
	//默认排序方式
	var obj = defaultSort;
	datalist.reload('dataGrid', {
		where : queryParams(obj)
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	//layer.closeAll('iframe');
}

function reload(obj) {
	obj = obj==undefined?defaultSort:obj;
	datalist.reload('dataGrid', {
		initSort: obj,
		where : queryParams(obj)
	});
	//layer.closeAll('iframe');
}

function del() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].online_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_onlineUser_del,
			data : {
				"ids":ids.toString()
			},
			type : "post",
			dataType : "json",
			beforeSend: function() {
				// loading show
				layer.load(2, {shade: 0.6});
			},
			success : function(res) {
				if(res.code==0){
					layer.msg(res.msg);
					reload();
				}else{
					layer.msg(res.msg);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	});
}
