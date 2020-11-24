var datalist;
$(function(){
	layui.use(['form'], function(){
		var form = layui.form;

		//监听提交
		form.on('submit(formSearch)', function(data){
			search();
			return false;
		});
	});
	initDatagrid();
});
function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_thirdbind_list,
			page : true,
			toolbar: '#toolbar',
			cols : [[
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'user_name',
				title : '系统用户名',
				width : 160
			}, {
				field : 'platform_name',
				title : '三方平台',
				width : 120,
				templet: function(d){
					var ss='<span class="layui-badge layui-bg-gray">未配置</span>';
					if(d.platform_name=='water_cloud'){
						ss='<span class="layui-badge" style="background: #F56C6C">水利云</span>';
					}else if(d.platform_name=='wx'){
						ss='<span class="layui-badge" style="background: #409EFF">微信</span>';
					}
					return ss;
				}
			}, {
				field : 'platform_user_name',
				title : '三方平台用户名',
				width : 160
			}, {
				field : 'status',
				title : '是否绑定',
				width : 100,
				templet: function(d){
					var ss='<span class="layui-badge layui-bg-gray">未绑定</span>';
					if(d.status==1){
						ss='<span class="layui-badge layui-bg-green">已绑定</span>';
					}
					return ss;
				}
			}, {
				field : 'first_bind_time',
				title : '首次绑定时间',
				width : 180,
				templet: '<div>{{ new Date(d.first_bind_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'latest_bind_time',
				title : '最新绑定时间',
				width : 180,
				templet: '<div>{{ new Date(d.latest_bind_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : 'unbind_time',
				title : '解绑时间',
				width : 180,
				templet: function(d){
					var ss='';
					if(d.unbind_time==null){
						ss='-';
					}else{
						ss='<div>{{ new Date(d.unbind_time).format("yyyy-MM-dd hh:mm:ss") }}</div>';
					}
					return ss;
				}
			} ] ]
		});

	});
};

//得到查询的参数
function queryParams(params) {
	var temp = {
		sysUserName : $("#search_sysUserName").val(),
		platformUserName : $("#search_platformUserName").val()
	};
	return temp;
}

function search() {
	datalist.reload('dataGrid', {
		where : queryParams()
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	layer.closeAll('iframe');
}

function reload() {
	datalist.reload('dataGrid', {
		where : queryParams()
	});
	layer.closeAll('iframe');
}

function del() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].id;
	}
	layer.confirm('确定解绑选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_thirdbind_del,
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
					reload();
				}else{
					layer.msg(res.msg);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	});
}
