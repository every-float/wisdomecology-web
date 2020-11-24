var datalist;
$(function(){
	initDatagrid();
});
function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_module_list,
			page : true,
			toolbar: '#toolbar',
			cols : [[
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'module_name',
				title : '模块名称',
				width : 200,
				align : 'center'
			}, {
				field : 'module_code',
				title : '模块编码',
				width : 140,
				align : 'center'
			}, {
				field : 'module_path',
				title : '路径地址',
				minWidth : 360,
				align : 'center'
			}, {
				field : 'sort_num',
				title : '排序',
				width : 100,
				align : 'center'
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : '',
				title : '操作',
				width : 120,
				fixed : 'right',
				align : 'center',
				toolbar : '#barOpt'
			} ]]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.module_id);
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
		title : '新增模块',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '560px', '450px' ],
		content : pageUrl+"views/system/module_edit.html",
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
		title : '修改模块',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '560px', '450px' ],
		content : pageUrl+"views/system/module_edit.html?moduleId="+pid,
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
		ids[i]= data[i].module_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_module_del,
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
