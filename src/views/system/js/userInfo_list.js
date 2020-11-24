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
			url : URL_userInfo_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'user_name',
				title : '用户名/账号',
				width: 160,
				align : 'center'
			}, {
				field : 'real_name',
				title : '姓名',
				width: 160,
				align : 'center'
			}, {
				field : 'sex',
				title : '性别',
				width : 80,
				align : 'center'
			}, {
				field : 'phone',
				title : '手机号',
				width: 130,
				align : 'center'
			}, {
				field : 'depart_name',
				title : '部门',
				minWidth: 200,
				align : 'center'
			}, {
				field : 'status',
				title : '状态',
				width : 100,
				align : 'center',
				templet : '#statusTpl'
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : '',
				title : '操作',
				fixed : 'right',
				width : 100,
				align : 'center',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.user_id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		userName : $('#search_userName').val(),
		realName : $('#search_realName').val(),
		departName : $('#search_departName').val()
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
		title : '新增用户',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/system/userInfo_edit.html',
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
		title : '修改用户',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/system/userInfo_edit.html?userId='+pid,
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
		ids[i]= data[i].user_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_userInfo_del,
			data : {
				'ids':ids.toString()
			},
			type : 'post',
			dataType : 'json',
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
