var la;
function addDept1(id){
	la = layer.open({
		type : 2,
		title : '选择部门',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '400px', '360px' ],
		content: pageUrl+'views/common/scheme_win_depart.html',
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//获取选中的部门信息
			var selDeptId = body.find('#selDeptId').val();
			var selDeptName = body.find('#selDeptName').val();
			var departFlag = body.find('#departFlag').val();
			if(selDeptId==''){
				layer.msg('请选择部门');
				return;
			}
			//赋值
			if($('#contList #tr_seq_'+selDeptId).length==0){
				var departFlagCN = checkFlag(departFlag);
				var list = '<tr id="tr_seq_'+selDeptId+'"><td>'+selDeptName+'</td><td>'+departFlagCN+'</td>'+
				'<td><a href="javascript:;" onclick="removeTr(\''+selDeptId+'\')">删除</a></td></tr>'+
				'<input type="hidden" id="departName_'+selDeptId+'" value="'+selDeptName+'">'+
				'<input type="hidden" id="departFlag_'+selDeptId+'" value="'+departFlag+'">';
				$('#contList tr:last').after(list);
			}
			
			layer.close(index);
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function checkFlag(departFlag){
	var ss='无';
	if(departFlag=='1'){
		ss = '本部门';
	}else if(departFlag=='2'){
		ss = '本部门及以下部门';
	}
	return ss;
}