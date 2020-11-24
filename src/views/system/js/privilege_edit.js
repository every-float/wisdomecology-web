
var form;
var privilegeId;
var menuId;
$(function() {
	layui.use(['form'], function() {
		form = layui.form;
		
		privilegeId = $.getUrlParam('privilegeId');
		menuId = $.getUrlParam('menuId');
		if(privilegeId != null){
			///初始化数据
			initDataInfo();
		}else{
			$('#menuId').val(menuId);
		}
		
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

function initDataInfo(){
	$.ajax({
		url : URL_privilege_detailInfo,
		data : {
			privilegeId: privilegeId
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
				// 初始赋值
				form.val('form1', {
					'privilegeId': res.data.privilegeId,
					'privilegeName': res.data.privilegeName,
					'privilegeCode': res.data.privilegeCode,
					'isMenu': res.data.isMenu+'',
					'isUse': res.data.isUse+'',
					'menuId': res.data.menuId,
					'privilegeUrl': res.data.privilegeUrl,
					'privilegeUrlOther': res.data.privilegeUrlOther
				});
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function checkCode(){
	$.ajax({
		url : URL_privilege_checkCode,
		data : {
			code : $('#privilegeCode').val(),
			pk : $('#privilegeId').val(),
			menuId : $('#menuId').val()
		},
		type : 'post',
		dataType : 'json',
		beforeSend: function() {
			// loading show
			layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				parent.layer.msg(res.msg);
			}else{
				parent.layer.msg(res.msg);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function save(){
	$.ajax({
		url : URL_privilege_save,
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
				parent.reloadPrivilege();
			}else{
				parent.layer.msg(res.msg);
			}
		},
		complete: function () {
			parent.layer.closeAll('loading');
		}
	});
}