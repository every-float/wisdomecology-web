var datalist;
$(function(){
	layui.use(['form'], function(){
		var form = layui.form;

		//监听提交
		form.on('submit(formSearch)', function(data){
			search();
			return false;
		});
	});
	initDatagrid();
});
function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_config_list,
			page : true,
			toolbar: '#toolbar',
			cols : [[
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'config_name',
				title : '配置名称',
				width : 260,
				align : 'center'
			}, {
				field : 'config_code',
				title : '配置编码',
				width : 160,
				align : 'center'
			}, {
				field : 'config_value',
				title : '配置信息',
				minWidth: 300,
				align : 'center'
			}, {
				field : 'config_type',
				title : '配置类型',
				width : 160,
				align : 'center',
				templet: function(d){
					var ss='<span class="layui-badge layui-bg-gray">未配置</span>';
					if(d.config_type=='1'){
						ss='<span class="layui-badge" style="background: #F56C6C">核心配置</span>';
					}else if(d.config_type=='2'){
						ss='<span class="layui-badge" style="background: #409EFF">附件配置</span>';
					}
					return ss;
				}
			}, {
				field : 'is_use',
				title : '是否使用',
				width : 100,
				align : 'center',
				templet: function(d){
					var ss='<span class="layui-badge layui-bg-gray">未使用</span>';
					if(d.is_use==1){
						ss='<span class="layui-badge layui-bg-green">使用中</span>';
					}
					return ss;
				}
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : '',
				title : '操作',
				fixed: 'right',
				width : 120,
				align : 'center',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				edit(data.config_id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		configName : $("#search_configName").val(),
		configCode : $("#search_configCode").val()
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

function add(){
	layer.open({
		type : 2,
		title : '新增配置',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '800px', '520px' ],
		content : pageUrl+"views/system/config_edit.html",
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			
			iframeWin.checkForm();
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function edit(pid) {
	layer.open({
		type : 2,
		title : '修改配置',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '800px', '520px' ],
		content : pageUrl+"views/system/config_edit.html?configId="+pid,
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			
			iframeWin.checkForm();
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function del() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].config_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_config_del,
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
