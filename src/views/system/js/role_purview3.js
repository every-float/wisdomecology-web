var roleId = $.getUrlParam('roleId');
$(function() {
	layui.use(['form'], function() {
		var form = layui.form;
		
		form.on('select(moduleList)', function(data){
			$('#moduleCode').val(data.value);
			getModuleTree();
		});
		

		if(roleId != null){
			///初始化数据
			$('#roleId').val(roleId);
		}
		
		initParamInfo();
		
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
	});
});

function initParamInfo(){
	getModuleTree();
}

function getCheckValue() {
	var zTree = $.fn.zTree.getZTreeObj("menuTree");
	var nodes = zTree.getCheckedNodes(true);
	var result = "[";
	for ( var i = 0; i < nodes.length; i++) {
		//var halfCheck = nodes[i].getCheckStatus();
		//if (!halfCheck.half) {
			result += "{'id':'"+nodes[i].id+"'},";
		//}
	}
	if(result!="[")
		result = result.substring(0, result.lastIndexOf(","));
	result += "]";
	return result;
}

function checkForm(){
	$('#btnSave').click();
}

function save(){
	var btns = getCheckValue();
	$('#btn_json').val(btns);
	$.ajax({
		url : URL_appRole_savePurview,
		data : $('#form1').serialize(),
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			parent.layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				parent.layer.msg(res.msg);
			}else{
				parent.layer.msg(res.msg);
			}
		},
		complete: function () {
			parent.layer.closeAll('loading');
		}
	});
}

var zNodes=[];
function getModuleTree(){
	//layer.load(2, {shade: 0.6});
	$.ajax({
		url : URL_appMenu_treeBtnList,
		data : {
			moduleCode: $('#moduleCode').val(),
			roleId: $('#roleId').val()
		},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				zNodes = res.data.tree;
				$.fn.zTree.init($("#menuTree"), setting_menu, zNodes);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
	
}

var setting_menu = {
//	async: {
//		enable: true,
//		url: URL_menu_treeBtnList,
//		dataFilter: filter,
//		otherParam: { 
//			'moduleCode': function(){
//				return $('#moduleCode').val();
//			},
//			'roleId': function(){
//				return $('#roleId').val();
//			}
//		}
//	},
	check: {
		enable: true
	},
	callback: {
		onClick: onClickM,
		onAsyncSuccess: zTreeOnAsyncSuccessM
	}
};
function filter(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}
function onClickM(event, treeId, treeNode, clickFlag) {
	
}
function zTreeOnAsyncSuccessM(event, treeId, treeNode, msg) {
	
}