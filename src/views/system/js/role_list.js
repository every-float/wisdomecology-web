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
			url : URL_role_list,
			toolbar: '#toolbar',
			page : true,
			cols : [[
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'role_name',
				title : '角色名称',
				width : 230,
				align : 'center'
			}, {
				field : 'role_code',
				title : '角色编码',
				width : 150,
				align : 'center'
			}, {
				field : 'remark',
				title : '备注',
				minWidth : 300,
				align : 'center'
			}, {
				field : 'is_use',
				title : '使用状态',
				width : 120,
				align : 'center',
				templet: function(d){
					var ss='<span class="layui-badge layui-bg-gray">未用</span>';
					if(d.is_use=='1'){
						ss = '<span class="layui-badge layui-bg-green">在用</span>';
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
				width : 150,
				align : 'center',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.role_id);
			}else if (obj.event === 'users') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				users(data.role_id, data.role_name);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		roleName : $("#search_roleName").val()
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
		title : '新增角色',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '600px', '500px' ],
		content : pageUrl+'views/system/role_edit.html',
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
		title : '修改角色',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '600px', '500px' ],
		content : pageUrl+'views/system/role_edit.html?roleId='+pid,
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
		ids[i]= data[i].role_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_role_del,
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
					search();
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
//功能授权
function purview() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length!=1){
		layer.alert('请选择1条记录',{icon: 2});
		return;
	}
	var pid = data[0].role_id;
	
	layer.open({
		type : 2,
		title : '功能授权：'+data[0].role_name,
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '500px', '90%' ],
		content : pageUrl+"views/system/role_purview.html?roleId="+pid,
		btn: ['保存', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//提交
			iframeWin.checkForm();
			
			return false;
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}
//子系统授权
function purview2() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length!=1){
		layer.alert('请选择1条记录',{icon: 2});
		return;
	}
	var pid = data[0].role_id;
	
	layer.open({
		type : 2,
		title : '子系统授权：'+data[0].role_name,
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '500px', '90%' ],
		content :pageUrl+"views/system/role_purview2.html?roleId="+pid,
		btn: ['保存', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//提交
			iframeWin.checkForm();
			
			return false;
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

//APP功能授权
function purview3() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length!=1){
		layer.alert('请选择1条记录',{icon: 2});
		return;
	}
	var pid = data[0].role_id;

	layer.open({
		type : 2,
		title : 'APP功能授权：'+data[0].role_name,
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '500px', '90%' ],
		content : pageUrl+"views/system/role_purview3.html?roleId="+pid,
		btn: ['保存', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//提交
			iframeWin.checkForm();

			return false;
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function users(roleId, roleName) {
	layer.open({
		type : 2,
		title : '人员管理：' + roleName,
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/system/role_users.html?roleId='+roleId,
		btn: ['关闭'],
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}
