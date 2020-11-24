
$(function(){
	layui.use(['form'], function() {
		var form = layui.form;
		// 监听提交
		form.on('submit(setmypass)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			savePass();
			return false;
		});
		form.verify({
			pass: [
			       /^[\S]{6,16}$/,'密码必须6到16位，且不能出现空格'
			       ],
			repass: [
			           /^[\S]{6,16}$/,'密码必须6到16位，且不能出现空格'
			],
			repass:function(value) {
				if(value != $("#password").val()){
					$("#repassword").val("");
					return "两次密码输入不一致";
				}
			},
		});      
	});
});

function savePass() {
	 var oldPassword = $("#oldPassword").val();  
     var password = $("#password").val();  
     var repassword = $("#repassword").val(); 
	$.ajax({
		url : URL_index_checkPwd,
		data : {
				"oldPassword":oldPassword,
				"password":password,
				"repassword":repassword
				},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			$("#save").prop("disabled","disabled");
			$("#save").html("<i class=\"fa fa-spinner fa-pulse\"></i>正在保存...");
		},
		success : function(res) {			
			if(res.code==0){
				layer.msg(res.msg, {icon: 1});
				$("#oldPassword").val("");
				$("#password").val("");
				$("#repassword").val("");
			}else{
				layer.msg(res.msg, {icon: 2});
			}
		},
		complete: function () {
			$("#save").prop("disabled","");
			$("#save").html("<i class=\"fa fa-save\"></i>保存");
		}
	});
}