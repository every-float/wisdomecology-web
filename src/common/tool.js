/********************* js工具类 **********************/
/**
 * //获取到Url里面的参数
 * @param $
 * @returns
 */
(function ($) {
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
})(jQuery);

// 日期格式化(年月日时分秒)
Date.prototype.toLocaleString = function() {
	return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() 
		+ "时" + this.getMinutes() + "分" + this.getSeconds() + "秒";
};
// 日期格式化(年月日)
Date.prototype.toLocaleYMDString = function() {
	return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 ";
};
/**
 * 日期格式化 date.format('yyyy年MM月dd日')
 * @param fmt
 * @returns
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, //月份 
		"d+" : this.getDate(), //日 
		"h+" : this.getHours(), //小时 
		"m+" : this.getMinutes(), //分 
		"s+" : this.getSeconds(), //秒 
		"q+" : Math.floor((this.getMonth() + 3) / 3), //季度 
		"S" : this.getMilliseconds()
	//毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

function gettingTime(time){
	if(time == "" || time == null){
		return "";
	}else{
		var date = new Date();
		date.setTime(time);
		return date.format("yyyy-MM-dd");
	}
}

//CST时间转化日期格式
// 使用   :   dateFormat(mData.transfer_time,'yyyy-MM-dd HH:mm:ss')
function dateFormat (date, format) {
	date = new Date(date);
	// date.setHours(date.getHours()-14);
	var o = {
		'M+' : date.getMonth() + 1, // month
		'd+' : date.getDate(), // day
		'H+' : date.getHours(), // hour
		'm+' : date.getMinutes(), // minute
		's+' : date.getSeconds(), // second
		'q+' : Math.floor((date.getMonth() + 3) / 3), // quarter
		'S' : date.getMilliseconds() // millisecond
	};
	
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	
	for (var k in o)
		if (new RegExp('(' + k + ')').test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	return format;
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ','
				+ num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 人民币金额转大写程序 JavaScript版
 * @param num
 * @returns
 */
function AmountLtoU(num) {
	///<summery>小写金额转化大写金额</summery>
	///<param name=num type=number>金额</param>
	if (isNaN(num))
		return "无效数值！";
	var strPrefix = "";
	if (num < 0)
		strPrefix = "(负)";
	num = Math.abs(num);
	if (num >= 1000000000000)
		return "无效数值！";
	var strOutput = "";
	var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
	var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
	num += "00";
	var intPos = num.indexOf('.');
	if (intPos >= 0) {
		num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
	}
	strUnit = strUnit.substr(strUnit.length - num.length);
	for ( var i = 0; i < num.length; i++) {
		strOutput += strCapDgt.substr(num.substr(i, 1), 1)
				+ strUnit.substr(i, 1);
	}
	return strPrefix
			+ strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(
					/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/,
					'元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};

function formatUNIXTime(time) { 
	var d = new Date(parseInt(time) * 1000);
	var month = d.getMonth() + 1;
	var day =  d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	hour = hour < 10 ? '0' + hour : hour;
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	return d.getFullYear() + '-' + month + '-' +  day + ' ' + hour + ':' + minute + ':' + second; 
}


//转对象,支持字符串和对象参数
function ObjectParse(obj) {
	if(obj==null || obj==''){
		return '';
	}
  var thetype = typeof (obj);
  if (thetype == "undefined") {
      obj = {};
  }
  else if (thetype == "string") {
      try {
          obj = eval("(" + obj + ")"); ;
      } catch (err) {
          alert(obj + "的ObjectParse转换失败，请检测格式!");
          return;
      } finally {
      }
  }
  else if (thetype == "object") {
      return obj;
  }
  else {
      obj = {};
  }
  return obj;
}

/**
* 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
**/
function isNumber(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}
function gettingTimeYYYMMddhhmmss(time){
	if(time == "" || time == null){
		return "";
	}else{
		var date = new Date();
	    date.setTime(time);
	    return date.format("yyyy-MM-dd hh:mm:ss");
	}
}
var layuiUtil = {
	getCurSelectValue: function (jqSelect) {
		return $(jqSelect).next().find('dl dd.layui-this').attr('lay-value');
	}
};

//判断是否为当天时间
function isCurrentDate(time){
	var time1 = gettingTime(time).split(" ")[0];
	var currentTime = new Date();
	var time2 = currentTime.getFullYear()+"-"
				+((currentTime.getMonth()<9)?("0"+(currentTime.getMonth()+1)):(currentTime.getMonth()+1))+"-"
				+((currentTime.getDate() < 10)?("0"+currentTime.getDate()):currentTime.getDate());
	if(time1 == time2){
		return true;
	}else{
		return false;
	}
}

// 获取模板编号
function getDemoCode(listType){
	layui.use('layer', function(){
		var layer = layui.layer;
		var modeValue = "";

		$.ajax({
			type:"post",
			async:false,
			url:URL_get_demo_code,
			dataType:"json",
			data:{
				listType:listType
			},
			success:function(ret){
				modeValue = ret.modeValue;
			},
			error:function(){
				layer.msg("网络访问出错，获取编号失败！");
			},
			complete:function(){
				layer.closeAll("loading");
			}
		})
		console.log(modeValue);
		return modeValue;
	})
}

/**
 * js文件按需加载
 * @param url js文件路径(String)
 * @param callback js文件加载完成回调(Function)
 * @author 吕文基
 */
function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	document.body.appendChild(script);
	if(typeof(callback) !== "undefined"){
		script.onload = function () {
			callback();
		};
	}
}

/**
 * 去除字符串中空格
 * @param str (String)
 * @param type (Number): 1-所有空格 2-前后空格 3-前空格 4-后空格
 * @author 吕文基
 */
function trim(str, type) {
    type = type || 1
    switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}


function JsonParse(obj){
	if(obj==null || obj==''){
		return '';
	}
	if (obj == undefined) {
		obj = {};
	}
	return JSON.parse(obj);
}

/**
 * @author 张腾瑞
 */
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}

/**
 * @author 张腾瑞
 * 获取当前月份的天数
 */
function mGetDate(){
     var date = new Date();
     var year = date.getFullYear();
     var month = date.getMonth()+1;
     var d = new Date(year, month, 0);
     return d.getDate();
}

/** * 自定义函数名：formatZero
* @param num： 需要补零的数值
* @param len： 补零后的总位数
*/
function formatZero(num, len) {
    if(String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
}


/**
 * @author 张腾瑞
 * 创建补0函数
 */
function pTime(s) {
    return s < 10 ? '0' + s: s;
}

/** 
* @author 张腾瑞
* 获得相对当月AddMonthCount个月的起止日期 
* AddMonthCount为0 代表当月 为-1代表上一个月 为1代表下一个月 以此类推
* ***/ 
function getMonthStartAndEnd(AddMonthCount) { 
	//起止日期数组  
	var startStop = new Array(); 
	//获取当前时间  
	var currentDate = new Date();
	var month=currentDate.getMonth()+AddMonthCount;
	if(month<0){
	  var n = parseInt((-month)/12);
	  month += n*12;
	  currentDate.setFullYear(currentDate.getFullYear()-n);
	}
	currentDate = new Date(currentDate.setMonth(month));
	//获得当前月份0-11  
	var currentMonth = currentDate.getMonth(); 
	//获得当前年份4位年  
	var currentYear = currentDate.getFullYear(); 
	//获得上一个月的第一天  
	var currentMonthFirstDay = new Date(currentYear, currentMonth,1); 
	//获得上一月的最后一天  
	var currentMonthLastDay = new Date(currentYear, currentMonth+1, 0); 
	//添加至数组  
	startStop.push(getDateStr3(currentMonthFirstDay)); 
	startStop.push(getDateStr3(currentMonthLastDay)); 
	//返回  
	return startStop; 
}

//获取当前日期yy-mm-dd
//date 为时间对象
function getDateStr3(date) {
	var year = "";
	var month = "";
	var day = "";
	var now = date;
	year = ""+now.getFullYear();
	if((now.getMonth()+1)<10){
	  month = "0"+(now.getMonth()+1);
	}else{
	  month = ""+(now.getMonth()+1);
	}
	if((now.getDate())<10){
	  day = "0"+(now.getDate());
	}else{
	  day = ""+(now.getDate());
	}
	return year+"-"+month+"-"+day;
}

/** 
* @author 张腾瑞
* js获取当前时间前后N天前后日期的方法
* ***/ 
function GetDateStr(AddDayCount) { 
   var dd = new Date();
   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
   var y = dd.getFullYear(); 
   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
   return y+","+m+","+d; 
}