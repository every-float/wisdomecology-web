
$(function(){
	
});

function save() {
	$.ajax({
		url : URL_user_updatePhoto,
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
				search();
			}else{
				layer.msg(res.msg);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
