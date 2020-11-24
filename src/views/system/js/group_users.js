var setting = {
	async: {
		enable: true,
		url: URL_depart_treeList,
		dataFilter: filter,
		otherParam: { 
			'orgId': function(){
				return $('#orgId').val();
			}
		}
	},
	data:{
		simpleData: {
			enable:true,
			idKey: 'id',
			pIdKey: 'parentId',
			rootPId: '1'
		}
	},
	callback: {
		onClick: onClick,
		onAsyncSuccess: zTreeOnAsyncSuccess
	}
};

function filter(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}
function onClick(event, treeId, treeNode, clickFlag) {
	$('#departId').val(treeNode.id);
	search();
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	layer.closeAll('loading');

	$("#isChecked").attr("checked", false);
	form.render("checkbox");
}
var departTree;
var datalist;
var form;
var groupId = $.getUrlParam('groupId');
$(function() {
	layui.use(['form'], function() {
		form = layui.form;

		initParamInfo();
		
		// 监听select
		form.on('select(orgList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			$('#orgId').val(data.value);
			//刷新树
			departTree.reAsyncChildNodes(null, 'refresh');

			initDatagrid();
		});
		form.on('checkbox(isChecked)', function(data){
			//console.log(data.elem); //得到checkbox原始DOM对象
			//console.log(data.elem.checked); //是否被选中，true或者false
			//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
			//console.log(data.othis); //得到美化后的DOM对象
			if(data.elem.checked){
				datalist.reload('dataGrid', {
					where : { // 设定异步数据接口的额外参数，任意设
						names : $("#search_name").val(),
						departId: '',
						ischecked: '1'
					}
				});
			}else{
				search();
			}
		});
		
	});
});

function initParamInfo(){
	$.ajax({
		url : URL_depart_initParamInfo,
		data : {},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			this.layerIndex = layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var list = res.data.list_org;
				var option = '<option value=""></option>';
				for (var i = 0; i < list.length; i++) {
					option += '<option value="'+list[i].value+'">'+list[i].name+'</option>';
				}
				$('#orgList').html(option);
				
				//部门
				departTree = $.fn.zTree.init($('#departTree'), setting);

				form.render('select');
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}

function initDatagrid() {
	layui.use('table', function(){
		var form = layui.form;
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_group_userList+'?groupId='+groupId,
			where : { 
				departId: $('#departId').val(),
				ischecked: '0'
			},
			page : false,
			cols : [ [ // 表头
			{
				type : 'numbers'
			},{
				field : 'user_name',
				title : '用户名/账号'
			}, {
				field : 'real_name',
				title : '姓名'
			}, {
				field : 'sex',
				title : '性别',
				width : 80
			}, {
				field : 'depart_name',
				title : '部门'
			}, {
				field : 'user_check',
				title : '是否选择',
				width : 100,
				templet : '#checkTpl'
			} ] ]
		});
		//监听操作
		form.on('switch(checkTpl)', function(obj){
			//layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
			switchUseCheck(this.value, obj.elem.checked);
		});
	});
};

function search() {
	datalist.reload('dataGrid', {
		where : { // 设定异步数据接口的额外参数，任意设
			names : $("#search_name").val(),
			departId: $("#departId").val(),
			ischecked: '0'
		}
	});
	$("#isChecked").attr("checked", false);
	layui.use(['form'], function() {
		var form = layui.form;
		form.render("checkbox");
	});
	layer.closeAll('iframe');
}
function switchUseCheck(pid, sw){
	$.ajax({
		url : URL_group_switchUser,
		data : {
			groupId: groupId,
			userId: pid
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
				parent.reload();
			}else{
				layer.msg(res.msg);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
