var form;
var $userRole;
//var $appuserRole;
var userId;
$(function() {
	layui.use(['form','tree','xmSelect'], function() {
		form = layui.form;

		form.verify({
			password : function(value, item){
				if(value!=''){
					var regExp=/^[\S]{6,12}$/;
					if(!regExp.test(value)){
						return '密码必须6到12位，且不能出现空格';
					}
				}
			},
			passwordConfirm : function(value) {
				var pass = $('#password').val();
				if (value != pass) {
					return '两次密码不一致';
				}
			}
		});
		$userRole = xmSelect.render({
			el: '#userRole',
			name: 'userRole',
			direction: 'down',
			filterable: true,
			data: []
		});
		// $appuserRole = xmSelect.render({
		// 	el: '#appuserRole',
		// 	name: 'appuserRole',
		// 	direction: 'down',
		// 	filterable: true,
		// 	data: []
		// });

		initParamInfo();

		//组织切换
		form.on('select(orgId)', function(data){
			$("#departId").val('');
			$("#departName").val('');
			changeOrg(data.value);
		});

		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
	});
});

function checkForm(){
	$('#btnSave').click();
}

function initParamInfo(){
	$.ajax({
		url : URL_userInfo_initParamInfo,
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
				$('#orgId').html(option);
				
				var list_role = res.data.list_role;
				var arr = new Array();
				for (var i = 0; i < list_role.length; i++) {
					arr[i] = {"name": list_role[i].role_name, "value": list_role[i].role_id};
				}
				$userRole.update({
					data: arr,
					autoRow: true,
				});

				// var list_approle = res.data.list_approle;
				// var apparr = new Array();
				// for (var i = 0; i < list_approle.length; i++) {
				// 	apparr[i] = {"name": list_approle[i].role_name, "value": list_approle[i].role_id};
				// }
				// $appuserRole.update({
				// 	data: apparr,
				// 	autoRow: true,
				// })

				// formSelects.render({
				// 	name : 'roles'
				// });
				// appformSelects.render({
				// 	name : 'approles'
				// });
				// formSelects.data('roles', 'local', {
				// 	arr: arr
				// });
				// formSelects.data('approles', 'local', {
				// 	arr: apparr
				// });
				//初始化
				//$('#orgList').val(orgId);
				form.render('select');
				
				userId = $.getUrlParam('userId');
				if(userId != null){
					///初始化数据
					initDataInfo();
				}
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}

function initDataInfo(){
	$.ajax({
		url : URL_userInfo_detailInfo,
		data : {
			userId: userId
		},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var form = layui.form;
				// 初始赋值
				form.val('form1', {
					'userId': res.data.userId,
					'userType': res.data.userType,
					'realName': res.data.realName,
					'orgId': res.data.orgId,
					'departId': res.data.departId,
					'departName': res.data.departName,
					'sex': res.data.sex,
					'userName': res.data.userName,
					'status': res.data.status,
					'phone': res.data.phone,
					'email': res.data.email
				});
				changeOrg(res.data.orgId);
				//alert(res.data.userRole);
				var userRole = new Array();
				var urs = res.data.userRole.split(',');
				for (var i = 0; i < urs.length; i++) {
					userRole[i] = urs[i];
				}
				//赋值
				//formSelects.value('roles', userRole);
				$userRole.setValue(userRole);
				
				// var appuserRole = new Array();
				// var aurs = res.data.appuserRole.split(',');
				// for (var i = 0; i < aurs.length; i++) {
				// 	appuserRole[i] = aurs[i];
				// }
				// //赋值
				// //appformSelects.value('approles', appuserRole);
				// $appuserRole.setValue(appuserRole);

				form.render('select');
				
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function save(){
	//获取权限
	// $('#userRole').val(formSelects.value('roles', 'val'));
	// $('#appuserRole').val(appformSelects.value('approles', 'val'));
	$.ajax({
		url : URL_userInfo_save,
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
				parent.reload();
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
function changeOrg(orgId){
	$.ajax({
		url : URL_userInfo_selectDepartList,
		data : {
			orgId: $('#orgId').val()
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
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function showTip(){
	layer.tips('说明：<br>1.普通用户：企业真实存在员工<br>2.虚拟用户：非现实存在用户，例如：微信账户', '#ut', {
		tips: [2, '#3595CC'],
		time: 0,
		tipsMore: true ,
		success: function(lay, index){
			//$(lay["selector"]).css({"cursor":"pointer","user-select":"none"});
			$(document).click(function(event){
				if(!(event.target.id=='ut'||$(event.target).parents()[0].id==('layui-layer'+index))){
					layer.close(index);
				}
			});
		}
	});
}

/*********部门**********/
var setting_dept = {
	data:{
		simpleData: {
			enable:true,
			idKey: 'id',
			pIdKey: 'parentId',
			rootPId: '1'
		}
	},
	callback: {
		onClick: onClickDept,
		onAsyncSuccess: zTreeOnAsyncSuccessDept
	}
};

function filterDept(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function zTreeOnAsyncSuccessDept(event, treeId, treeNode, msg) {
	
}

function onClickDept(event, treeId, treeNode, clickFlag) {
	$('#departId').val(treeNode.id);
	$('#departName').val(treeNode.name);
	$('#deptList').fadeOut('fast');
}

function showDeptList() {
	$.fn.zTree.init($('#deptTreeList'), setting_dept, zNodes);
	
	var parent = $('#departName');
	var parentOffset = $('#departName').offset();
	$('#deptList').slideDown('fast');
	$('body').bind('mousedown', onBodyDownD);
	
}

function onBodyDownD(event) {
	if (!(event.target.id == 'deptList' || $(event.target).parents('#deptList').length>0)) {
		$('#deptList').fadeOut('fast');
		$('body').unbind('mousedown', onBodyDownD);
	}
}

