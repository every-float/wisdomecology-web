var datalistPosition;
$(function(){
	initDatagridPosition();
});
function initDatagridPosition() {
	layui.use('table', function(){
		datalistPosition = layui.table;
		var form = layui.form;
		datalistPosition.render({
			elem : '#dataGridPosition',
			url : URL_position_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'position_name',
				title : '岗位名称',
				width: 150
			}, {
				field : 'parent_name',
				title : '上级岗位',
				width: 180
			}, {
				field : 'cntUser',
				title : '成员数量',
				width: 100
			}, {
				field : 'depart_name',
				title : '所属部门',
				width: 180
			}, {
				field : 'sort_num',
				title : '排序',
				width: 60
			}, {
				field : 'remark',
				title : '备注',
				width: 200
			}, {
				field : '',
				title : '操作',
				width : 150,
				fixed: 'right',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听排序
		datalistPosition.on('sort(dataGridPosition)', function(obj){
			initDatagridPosition.reload('dataGridPosition', {
				initSort : obj,
				where : { // 设定异步数据接口的额外参数，任意设
					field : obj.field, // 排序字段
					order : obj.type, // 排序方式
					menuId : $('#menuId').val()
				}
			});
		});
		//监听工具条
		datalistPosition.on('tool(dataGridPosition)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				editPosition(data.position_id);
			}else if(obj.event === 'user'){
				userPosition(data);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		departId : $('#departId').val()
	};
	return temp;
}

function searchPosition() {
	datalistPosition.reload('dataGridPosition', {
		where : queryParams()
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	//layer.closeAll('iframe');
}

function reloadPosition() {
	datalistPosition.reload('dataGridPosition', {
		where : queryParams()
	});
	layer.closeAll('iframe');
}

function addPosition(){
	var departId = $("#departId").val();
	if(departId==''){
		layer.alert('请先选择部门');
		return;
	}
	layer.open({
		type : 2,
		title : '新增岗位信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '800px', '520px' ],
		content : pageUrl+'views/system/position_edit.html?departId='+departId,
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

function editPosition(pid) {
	layer.open({
		type : 2,
		title : '修改岗位信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '800px', '520px' ],
		content : pageUrl+'views/system/position_edit.html?positionId='+pid,
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

function delPosition() {
	var checkStatus = datalistPosition.checkStatus('dataGridPosition'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].position_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_position_del,
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
					searchPosition();
					
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
//成员管理
function userPosition(data) {
//	var checkStatus = datalistPosition.checkStatus('dataGridPosition'),data = checkStatus.data;
//	if(data.length!=1){
//		layer.alert('请选择1条记录',{icon: 2});
//		return;
//	}
	var pid = data.position_id;
	var did = data.depart_id;
	var oid = data.org_id;
	layer.open({
		type : 2,
		title : '岗位成员管理【当前部门：'+data.depart_name+'，当前岗位：'+data.position_name+'】',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/system/userInfo_position.html?positionId='+pid+'&departId='+did+'&orgId='+oid
	});
}