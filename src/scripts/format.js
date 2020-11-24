function timeStamp2Date(timeStamp) {
	if(timeStamp==null){
		return new Date();
	}
	var datetime = new Date();
	datetime.setTime(timeStamp.time);
	return datetime;
};
function timeStamp2String(timeStamp) {
	if(timeStamp==null){
		return "1970-01-01 00:00:00";
	}
	var datetime = new Date();
	datetime.setTime(timeStamp.time);
	return datetime.format("yyyy-MM-dd hh:mm:ss");
};
/**
 * 日期格式化 date.Format('yyyy年MM月dd日')
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
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

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