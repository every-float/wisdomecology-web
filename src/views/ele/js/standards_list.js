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
			url : URL_standards_list,
			page : true,
			toolbar: '#toolbar',
			cols : [[
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'title',
				title : '标题',
				minWidth : 300,
				align : 'center'
			}, {
				field : 'is_top',
				title : '是否置顶',
				width : 100,
				align : 'center',
				templet: function(d){
					var s = '<span class="layui-badge layui-bg-gray">否</span>';
					if(d.is_top=='1'){
						s = '<span class="layui-badge">是</span>';
					}
					return s;
				}
			}, {
				field : 'column_name',
				title : '发布栏目',
				width : 180,
				align : 'center'
			}, {
				field : 'publicity_time',
				title : '公示时间',
				width : 180,
				align : 'center',
					templet: '<div>{{ new Date(d.publicity_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'status',
				title : '状态',
				width : 100,
				align : 'center',
				templet: function(d){
					var s = '<span class="layui-badge layui-bg-gray">草稿</span>';
					if(d.status=='1'){
						s = '<span class="layui-badge layui-bg-orange">未发布</span>';
					}else if(d.status=='2'){
						s = '<span class="layui-badge layui-bg-green">已发布</span>';
					}else if(d.status=='3'){
						s = '<span class="layui-badge">被驳回</span>';
					}
					return s;
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
				width : 190,
				fixed: 'right',
				align : 'center',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.standards_id);
			}else if (obj.event === 'detail') {
				detail(data.standards_id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		title : $("#search_title").val()
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
		title : '新增法规标准',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/standards_edit.html',
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
		title : '修改法规标准',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/standards_edit.html?standardsId='+pid,
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

function detail(pid, url) {
	var cont = pageUrl+'views/ele/standards_preview.html?standardsId='+pid;
	if(url!=null){
		cont = url;
	}
	layer.open({
		type : 2,
		title : '查看公告',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '1000px', '90%' ],
		content : cont,
		btn: ['关闭'],
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
		ids[i]= data[i].standards_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_standards_del,
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

function publish() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].standards_id;
	}
	layer.confirm('确定发布选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_standards_publish,
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

function revoke() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].standards_id;
	}
	layer.confirm('确定撤下选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_standards_revoke,
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