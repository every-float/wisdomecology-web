/**
 * 人员多选
 */
//默认选中的人员ID。例如：aaa,ddd,ffff,
var checkUserIds = getQueryVariable("checkUserIds");
var setting_deptUser = {
	async: {
		enable: true,
		url: URL_userInfo_treeList + '?checkUserIds='+checkUserIds,
		dataFilter: filterDepartUser,
		otherParam: { 
			'orgId': function(){
				return $('#orgId').val();
			}
		}
	},
	check: {
		enable: true
	},
	callback: {
		//onCheck: zTreeOnCheckDepartUser,
		onAsyncSuccess: zTreeOnAsyncSuccessDepartUser
	}
};

function filterDepartUser(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

// function zTreeOnCheckDepartUser(event, treeId, treeNode) {
// 	var treeObj = $.fn.zTree.getZTreeObj("zTreeList");
// 	var nodes = treeObj.getChangeCheckedNodes();
// 	var chkids = '';
// 	var chknames = '';
// 	for (var i = 0; i < nodes.length; i++) {
// 		if(nodes[i].stype=="d"){
// 			continue;
// 		}
// 		chkids += nodes[i].id + ',';
// 		chknames += nodes[i].name + ',';
// 	}
// 	//去除最后一个逗号
// 	chkids = chkids.substring(0, chkids.lastIndexOf(','));
// 	chknames = chknames.substring(0, chknames.lastIndexOf(','));
//
// 	$("#selDeptUserId").val(chkids);
// 	$("#selDeptUserName").val(chknames);
// };

function zTreeOnAsyncSuccessDepartUser(event, treeId, treeNode, msg) {
	layer.closeAll('loading');
}

function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

var deptUserTree;
var form;
$(document).ready(function(){
	//deptUserTree = $.fn.zTree.init($("#zTreeList"), setting_deptUser);
	
	layui.use(['form'], function() {
		form = layui.form;
		//初始化
		initParamInfo();
		// 监听select
		form.on('select(orgList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			$('#orgId').val(data.value);
			//刷新树
			deptUserTree.reAsyncChildNodes(null, 'refresh');
		});
		
		deptUserTree = $.fn.zTree.init($("#zTreeList"), setting_deptUser);
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
				
				form.render('select');
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}

//获取所有选中节点
function getCheckedNodes(){
	var treeObj = $.fn.zTree.getZTreeObj("zTreeList");
	var nodes = treeObj.getCheckedNodes(true);
	var chkids = '';
	var chknames = '';
	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].stype=="d"){
			continue;
		}
		chkids += nodes[i].id + ',';
		chknames += nodes[i].name + ',';
	}
	//去除最后一个逗号
	chkids = chkids.substring(0, chkids.lastIndexOf(','));
	chknames = chknames.substring(0, chknames.lastIndexOf(','));

	$("#selDeptUserId").val(chkids);
	$("#selDeptUserName").val(chknames);
}
