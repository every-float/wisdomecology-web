<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/taglib.jsp"%>
<!DOCTYPE HTML>
<html>
  <head>
	<%@ include file="/common.jsp"%>
    <title>ueditor添加商品</title>
	    <script type="text/javascript" src="../internal.js"></script>
	    <link href="${path }/scripts/chosen/chosen.min.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="${path }/scripts/chosen/chosen.min.js"></script>
  </head>
  
  <body>
  	<div class="main">  	
    	<div class="panel-body">
    		<form id="form1" class="form-horizontal">
				<input type="hidden" id="subjectId" name="subjectId">
				<input type="hidden" id="price" name="price">
				<div style="display:none">
					<img src="" id="webImgPath" />
				</div>
				<div class="form-group">
					<label class="col-md-3 control-label" for="">选择商品</label>
					<div class="col-md-2">
						<select class="chosen-select form-control" id="shopId" name="shopId" onchange="changePrice(this)">
						</select>
						<script type="text/javascript">
							$("#shopId").focus(function(){
								$(this).chosen({
									width: '100%',
									no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
									disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
									search_contains: true         // 从任意位置开始检索
								});
							});
 						</script>
					</div>
				</div>	
			</form>
    	</div>
    </div>	
    
<!--     模态框（folder）
<div class="modal fade" id="myModal_folder" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
				<h4 class="modal-title" id="myModalLabel_folder">模态框（Modal）标题</h4>
			</div>
			<div class="modal-body">
				<form id="form1" class="form-horizontal">
				<input type="hidden" id="subjectId" name="subjectId">
				<input type="hidden" id="price" name="price">
				<div class="form-group">
					<label class="col-md-3 control-label" for="">选择商品<</label>
					<div class="col-md-8">
						<select class="selectpicker form-control" id="shopId" name="shopId" title="---请选择---" data-live-search="true" onchange="changePrice(this)">
						</select>
					</div>
				</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				<button type="button" class="btn btn-primary" id="btn_submit2" onclick="saveFolder()">提交</button>
			</div>
		</div>
		/.modal-content
	</div>
	/.modal-dialog
</div> -->
<!-- /.modal -->	
  </body>
  <script type="text/javascript" src="addsub.js"></script>
</html>
