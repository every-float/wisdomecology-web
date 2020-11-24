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
			url : URL_companyInfo_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'company_name',
				title : '单位名称',
				width: 160,
				align : 'center'
			}, {
				field : 'address',
				title : '地址',
				width: 200,
				align : 'center'
			}, {
				field : 'legal_representative',
				title : '法定代表人',
				width : 160,
				align : 'center'
			}, {
				field : 'contact',
				title : '联系人',
				width : 80,
				align : 'center'
			},{
				field : 'phone',
				title : '联系电话',
				width: 130,
				align : 'center'
			}, {
				field : 'credit_code',
				title : '社会统一信用代码',
				minWidth: 160,
				align : 'center'
			}, {
				field : 'industry_type',
				title : '行业类别',
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
				fixed : 'right',
				width : 130,
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.company_id);
			}else if (obj.event === 'detail') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				detail(data.company_id);
		}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		companyName : $('#search_companyName').val()
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
		title : '新增基础信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/companyInfo_edit.html',
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_companyInfo_save,
				data : param,
				type : 'post',
				dataType : 'json',
				beforeSend: function() {
					// loading show
					layer.load(2, {shade: 0.6});
				},
				success : function(res) {
					if(res.code==0){
						layer.msg(res.msg, {icon:1});
						layer.close(index);
						search();
					}else{
						layer.msg(res.msg, {icon:2});
					}
				},
				complete: function () {
					layer.closeAll('loading');
				}
			});
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function edit(pid) {
	layer.open({
		type : 2,
		title : '修改企业基础信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/companyInfo_edit.html?companyId='+pid,
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_companyInfo_save,
				data : param,
				type : 'post',
				dataType : 'json',
				beforeSend: function() {
					// loading show
					layer.load(2, {shade: 0.6});
				},
				success : function(res) {
					if(res.code==0){
						layer.msg(res.msg, {icon:1});
						layer.close(index);
						search();
					}else{
						layer.msg(res.msg, {icon:2});
					}
				},
				complete: function () {
					layer.closeAll('loading');
				}
			});
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function detail(pid) {
	layer.open({
		type : 2,
		title : '企业信息详情',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+"views/ele/companyInfo_detail.html?companyId="+pid,
		btn: ['关闭'],
		success: function(layero, index){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//var param = body.find('#form1').serialize();
			
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
		ids[i]= data[i].company_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_companyInfo_del,
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

/**
 * 导出复杂表头数据问题
 * @return {[type]} [description]
 */
function exportExtendDemo() {
		console.log($('#search_companyName').val());
		layui.use(['layer', 'form', 'admin',  'table', 'util', 'dropdown', 'laydate'], function () {
			var $ = layui.jquery;
	        var layer = layui.layer;
	        var form = layui.form;
	        var table = layui.table;
	        var util = layui.util;
	        var admin = layui.admin;
	        var laydate = layui.laydate;

			var layIndex = admin.open({
			    type: 2,
			    title: '导出设置',
			    closeBtn:1,
			    content: 'export_excel.html',
			    area: ['90%', '450px'],
			    fixed: true,
			    offset: 'auto',
			    data: {
			        search_companyName:$('#search_companyName').val()
			    },
			    end: function () {  // 监听弹窗关闭
			        if (admin.getLayerData(layIndex, 'list')) {  // 判断表单操作成功标识
			            vm.list=admin.getLayerData(layIndex, 'list');
			        }
			    }
			});
		});
	
}
