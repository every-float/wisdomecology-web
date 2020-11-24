window.onload=	function getSubject() {
		var shopId ;
		$.ajax({
			url : path+"/platform/special_lw/getSubject",
			type : "post",
			dataType : "json",
			success : function(result) {
				if (result.success) {
					var list = result.list;
					$("#shopId").empty();
					shopId = '<option value="">---请选择---</option>';
					for ( var i = 0; i < list.length; i++) {
						if(list[i].subject_name.length > 90){
							var conte = list[i].subject_name;
							var value = conte.substring(0,10);
							value += '......';
							value += conte.substr(conte.length-4);
							shopId += '<option value="'+list[i].subject_id+'" title="'+list[i].subject_name+'">'+value+'</option>';
						}else {
							shopId += '<option value="'+list[i].subject_id+'">'+list[i].subject_name+'</option>';
						}
					}
					$("#shopId").html(shopId);
					options=$("#shopId option:selected"); 
					optionVal = options.val();
					for ( var j = 0; j < list.length; j++) {
						if(optionVal == list[j].subject_id) {
							if(/^[1-9]\d*|0$/ig.test(list[j].price)){
								$("#price").val(String(list[j].price) + ".00");
							}else{
								$("#price").val(list[j].price);
							}
							break;
						}
					}
//					sel();
				} else {
					alert(result.message);
				}
			}
		});
	}
	//商品对应价格
	var val;
	var options,optionVal;
	function changePrice(obj) {
		val = obj.value;
		$("#subjectId").val(val);
		$.ajax({
			url : path+"/platform/special_lw/getPriceBySubjectId",
			type : "post",
			data : $('#form1').serialize(),
			dataType : "json",
			success : function(result) {
				if (result.success) {
					var list = result.message;
					if(/^[1-9]\d*|0$/ig.test(list[0].price)){
						$("#price").val(String(list[0].price) + ".00");
					}else{
						$("#price").val(list[0].price);
					}
				} else {
					alert(result.message);
				}
			}
		});
		sel();
	}
	//商品对应图片
	function sel() {
		options=$("#shopId option:selected"); 
		optionVal = options.val();
		$("#subjectId").val(optionVal);
		$.ajax({
			url : path+"/platform/special_lw/getFileIdBySubjectId",
			type : "post",
			data : $('#form1').serialize(),
			dataType : "json",
			success : function(result) {
				if (result.success) {
					var list = result.message;
					$("#webImgPath").attr('src', webFilePath+list[0].file_path);
				} else {
					alert(result.message);
				}
			}
		});
	}
	//确定
	dialog.onok = function() {
		var list = [],conte = [];
		options=$("#shopId option:selected"); 
		var optionText = options.text();
		var optionVal = options.val();
		var price =  $("#price").val();
		var img = $("#webImgPath").attr("src");
		list.push(img);
		list.push(optionText);
		list.push(price);
		list.push(optionVal);
		var str = {
			'preHtml':'<div style="background:#EDFBFB!important;height:180px;position:relative;">'+
					    '<div style="float:left;margin:3% 4%;clear:both;"><img src="'+list[0]+'" width="120px" height="120px"></div>'+
						'<div id="conte" class="conte aui-ellipsis aui-ellipsis-2" style="position:absolute;top:10%;left:30%;font-size:20px;width:60%;"><span name="subjectName" style="display:block;line-height:25px;color:B2BEC4;text-align:left">'+list[1]+'</span><br>'+
						'<span name="price" style="display:block;text-align:left"><strong style="color:#FC9B59;">￥'+list[2]+'</strong></span></div>'+
						'<div float="right" style="position:absolute;top:110px;right:10%;"><button id="button" style="color:#56D5DD;border-color:#56D5DD;border-style:solid;border-width:1px;background-color:#EDFBFB;width:80px;height:40px;font-size:16px;border-radius:5px:;vertical-align:middle;text-align:center;" onclick="vm.buy(\''+list[3]+'\')">立即购买</button></div>'+
						'</div><br>',
			   'html':'<div style="background:#EDFBFB!important;height:180px;position:relative;">'+
					    '<div style="float:left;margin:3% 4%;clear:both;"><img src="'+list[0]+'" width="120px" height="120px"></div>'+
						'<div id="conte" class="conte aui-ellipsis aui-ellipsis-2" style="position:absolute;top:10%;left:30%;font-size:20px;width:60%;"><span name="subjectName" style="display:block;line-height:25px;color:B2BEC4;text-align:left">'+list[1]+'</span><br>'+
						'<span name="price" style="display:block;text-align:left"><strong style="color:#FC9B59;">￥'+list[2]+'</strong></span></div>'+
						'<div float="right" style="position:absolute;top:110px;right:10%;"><button id="button" style="color:#56D5DD;border-color:#56D5DD;border-style:solid;border-width:1px;background-color:#EDFBFB;width:80px;height:40px;font-size:16px;border-radius:5px;vertical-align:middle;text-align:center;" onclick="vm.buy(\''+list[3]+'\')">立即购买</button></div>'+
						'</div><br>'
		};
		var obj = {html:str && str.html};
		editor.execCommand('addsub',obj);
	}
