var datalistPrivilege;
$(function(){
	initDatagridPrivilege();
});
function initDatagridPrivilege() {
	layui.use('table', function(){
		datalistPrivilege = layui.table;
		var form = layui.form;
		datalistPrivilege.render({
			elem : '#dataGridPrivilege',
			url : URL_privilege_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'privilege_name',
				title : '权限名称',
				width : 120
			}, {
				field : 'privilege_code',
				title : '权限代码',
				width : 100,
				sort : true
			}, {
				field : 'is_menu',
				title : '是否菜单',
				width : 100,
				templet : '#menuTpl'
			}, {
				field : 'is_use',
				title : '是否使用',
				width : 100,
				templet : '#useTpl'
			}, {
				field : 'privilege_url',
				title : '权限资源',
				width: 200
			}, {
				field : 'privilege_url_other',
				title : '权限资源（其它）',
				width: 200
			}, {
				field : '',
				title : '操作',
				width : 120,
				fixed: 'right',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听排序
		datalistPrivilege.on('sort(dataGridPrivilege)', function(obj){
			initDatagridPrivilege.reload('dataGridPrivilege', {
				initSort : obj,
				where : { // 设定异步数据接口的额外参数，任意设
					field : obj.field, // 排序字段
					order : obj.type, // 排序方式
					menuId : $('#menuId').val()
				}
			});
		});
		//监听工具条
		datalistPrivilege.on('tool(dataGridPrivilege)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				editPrivilege(data.privilege_id);
			}
		});
		//监听操作
		form.on('switch(useTpl)', function(obj){
			//layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
			switchUsePrivilege(this.value, obj.elem.checked);
		});
	});
};

function searchPrivilege() {
	datalistPrivilege.reload('dataGridPrivilege', {
		where : { // 设定异步数据接口的额外参数，任意设
			menuId : $('#menuId').val()
		}
	});
	layer.closeAll('iframe');
}

//得到查询的参数
function queryParams(params) {
	var temp = { 
		menuId : $('#menuId').val()
	};
	return temp;
}

function searchPrivilege() {
	datalistPrivilege.reload('dataGridPrivilege', {
		where : queryParams()
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	layer.closeAll('iframe');
}

function reloadPrivilege() {
	datalistPrivilege.reload('dataGridPrivilege', {
		where : queryParams()
	});
	layer.closeAll('iframe');
}

function addPrivilege(){
	var menuId = $('#menuId').val();
	if(menuId==''){
		layer.alert('请先选择菜单');
		return;
	}
	layer.open({
		type : 2,
		title : '新增权限信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '90%' ],
		content : pageUrl+'views/system/privilege_edit.html?menuId='+menuId,
		btn: ['确定', '关闭'],
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

function editPrivilege(pid){
	layer.open({
		type : 2,
		title : '修改权限信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '90%' ],
		content : pageUrl+'views/system/privilege_edit.html?privilegeId='+pid,
		btn: ['确定', '关闭'],
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
function switchUsePrivilege(pid, sw) {
	$.ajax({
		url : URL_privilege_switch,
		data : {
			privilegeId : pid,
		},
		type : 'post',
		dataType : 'json',
		beforeSend : function() {
			// loading show
		},
		success : function(res) {
			if (res.code==0) {
				layer.msg(res.msg);
			} else {
				layer.msg(res.msg);
				
			}
		}
	});
}
