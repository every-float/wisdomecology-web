var companyId = $.getUrlParam('companyId');
$(function() {
	
	layui.use(['form'], function() {
		var form = layui.form;
		
		form.on('switch(isZdpwdwTO)', function(data){
			 if(data.elem.checked){
				 $("#isZdpwdw").val("1");
			 }else{
				 $("#isZdpwdw").val("0");
			 }
			
		}); 
		
		var isZdpwdw =  $("#isZdpwdw").val();
		if(isZdpwdw == '1'){
			$("#sw_isZdpwdw").prop("checked","checked");
		}
		
		form.render();
	});

	initDataInfo()
});

function initDataInfo(){
	$.ajax({
		url : URL_companyInfo_detailInfo,
		data : {
			companyId: companyId
		},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			// layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var form = layui.form;
				// 初始赋值
				console.log(res.data.fsZlgy);
				form.val('form1', {
					'companyId': res.data.companyId,
					'companyName': res.data.companyName,
					'legalRepresentative': res.data.legalRepresentative,
					'contact': res.data.contact,
					'phone': res.data.phone,
					'color': res.data.color,
					'address': res.data.address,
					'creditCode': res.data.creditCode,
					'industryType': res.data.industryType,
					'djbBawh': res.data.djbBawh,
					'isZdpwdw': res.data.isZdpwdw,
					'pwxkzbh': res.data.pwxkzbh,
					'djbBawh': res.data.djbBawh,
					'isZdpwdw': res.data.isZdpwdw,
					'pwxkzbh': res.data.pwxkzbh,
					'bgsPfwh': res.data.bgsPfwh,
					'bgsYswh': res.data.bgsYswh,
					'wrwFs': res.data.wrwFs,
					'wrwFq': res.data.wrwFq,
					'wrwFw': res.data.wrwFw,
					'wrwZs': res.data.wrwZs,
					'zyscgy': res.data.zyscgy,
					'zycp': res.data.zycp,
					'zyyl': res.data.zyyl,
					'fsZlgy': res.data.fsZlgy,
					'fsPfksl': res.data.fsPfksl,
					'fsPfqs': res.data.fsPfqs,
					'fsSfgf': res.data.fsSfgf,
					'fqZlgy': res.data.fqZlgy,
					'fqPfksl': res.data.fqPfksl,
					'fqSfgf': res.data.fqSfgf,
					'fwSfywfbz': res.data.fwSfywfbz,
					'fwSfgf': res.data.fwSfgf,
					'fwSfflcf': res.data.fwSfflcf,
					'zdJcfs': res.data.zdJcfs,
					'zdJcfq': res.data.zdJcfq,
					'zdLwqk': res.data.zdLwqk,
					'gkSfaz': res.data.gkSfaz,
					'gkAzsl': res.data.gkAzsl,
					'gkGkfs': res.data.gkGkfs,
					'gkGkwz': res.data.gkGkwz,
					'fxSfyjya': res.data.fxSfyjya,
					'fxSfyaba': res.data.fxSfyaba,
					'fsyFsyzl': res.data.fsyFsyzl,
					'fsyTwsmc': res.data.fsyTwsmc,
					'fsyFsysl': res.data.fsyFsysl,
					'fsyXkzbh': res.data.fsyXkzbh,
					'sxZzzl': res.data.sxZzzl,
					'sxZzmc': res.data.sxZzmc,
					'sxZzsl': res.data.sxZzsl,
					'tqyjSfsyyjdw': res.data.tqyjSfsyyjdw,
					'tqyjSfyjya': res.data.tqyjSfyjya,
					'tqyjSfhmqy': res.data.tqyjSfhmqy
				});
			
				
				//是否可用
				var isZdpwdw =  $("#isZdpwdw").val();
				if(isZdpwdw == '1'){
					$("#sw_isZdpwdw").prop("checked","checked");
				}
				form.render();	
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
