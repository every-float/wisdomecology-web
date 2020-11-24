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
			url : URL_companyIllegal_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'doc_no',
				title : '文号',
				width: 160,
				align : 'center'
			}, {
				field : 'company_name',
				title : '处罚企业名称',
				width: 160,
				align : 'center',
				templet: function(d){
					var ss='<a href="javascript:;"style="color: red;font-weight: bold;text-decoration:underline" onclick="companyInfo(\''+d.company_id+'\')">'+d.company_name+'</a>';
					return ss;
				}
			}, {
				field : 'create_time',
				title : '立案日期',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'penalty_decision_date',
				title : '处罚决定日期',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.penalty_decision_date).format("yyyy-MM-dd") }}</div>'
			}, {
				field : 'penalty_amount',
				title : '处罚金额',
				width : 100,
				align : 'center'
			},{
				field : 'penalty_date',
				title : '罚款缴纳日期',
				width: 180,
				align : 'center',
				templet: '<div>{{ new Date(d.penalty_date).format("yyyy-MM-dd") }}</div>'
			}, {
				field : 'punishment_basis',
				title : '处罚依据',
				minWidth: 160,
				align : 'center'
			}, {
				field : 'enforcer',
				title : '执法人',
				width : 100,
				align : 'center'
			}, {
				field : 'team',
				title : '所属大队',
				width : 100,
				align : 'center'
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				align : 'center',
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd") }}</div>'
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
				edit(data.illegal_id);
			}else if (obj.event === 'detail') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				detail(data.illegal_id);
		}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		companyName : $('#search_companyName').val(),
		docNo : $('#search_docNo').val()
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
		title : '新增违法信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/companyIllegal_edit.html',
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_companyIllegal_save,
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
		title : '修改违法信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+'views/ele/companyIllegal_edit.html?illegalId='+pid,
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_companyIllegal_save,
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
		title : '企业违法信息详情',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+"views/ele/companyIllegal_detail.html?illegalId="+pid,
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
		ids[i]= data[i].illegal_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_companyIllegal_del,
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

function companyInfo(pid) {
	layer.open({
		type : 2,
		title : '企业基础信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl + "views/ele/companyInfo_detail.html?companyId="+pid
	});
}