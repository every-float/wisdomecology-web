// 接口地址汇总
// var URL_detailHisInfo = baseUrl + "txwwin/detailHisInfo";

var left_3_1 = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '28%',
		top: '6%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var left_4_1 = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#F6C03C'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var left_4_2 = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#EF4DA2'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var left_4_3 = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var right_2_1 = {
	title: {
		text: '区域考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 10
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 2;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '参数',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#F7D536'
				}
			},
			data: [50, 44, 36, 30, 25, 20, 16, 11, 8, 3]
		}
	]
}

var right_2_2 = {
	title: {
		text: '街镇考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 10
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '参数',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#1CE8C3'
				}
			},
			data: [4, 10, 15, 20, 26, 32, 39, 41, 45, 55]
		}
	]
}

var right_2_3 = {
	title: {
		text: '微站考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 10
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 7,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 3;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 7
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '参数',
			type: 'bar',
			barMaxWidth: 8,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [50, 44, 36, 30, 25, 20, 16, 11, 8, 3]
		}
	]
}

var left_3_1_layer = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '15%',
		top: '3%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
};

var left_4_1_layer = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: 2,
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#F6C03C'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var left_4_2_layer = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: 2,
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#EF4DA2'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
}

var left_4_3_layer = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '15%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [12, 22, 32, 36, 40, 36, 29, 32, 35, 18]
		}
	]
};

var right_2_1_layer = {
	title: {
		text: '区域考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 15
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#F7D536'
				}
			},
			data: [50, 44, 36, 30, 25, 20, 16, 11, 8, 3]
		}
	]
}

var right_2_2_layer = {
	title: {
		text: '街镇考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 15
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#1CE8C3'
				}
			},
			data: [4, 10, 15, 20, 26, 32, 39, 41, 45, 55]
		}
	]
}

var right_2_3_layer = {
	title: {
		text: '微站考核排名',
		textStyle: {
			color: '#FFFFFF',
			fontSize: 15
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '7%',
		right: '3%',
		bottom: '25%',
		top: '23%'
	},
	xAxis: [{
		type: 'category',
		data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
		axisPointer: {	//指示器
			type: 'line',
			lineStyle: {
				color: "#ff0000",
				width: 2,
				type: "dotted"
			}
		},
		axisLabel: {
			interval: 0,
			color: '#00DEFF',
			fontSize: 13,
			margin: 4,
			formatter:function(value,index) {
				var ret = "";//拼接加\n返回的类目项  
				var maxLength = 5;//每项显示文字个数  
				var valLength = value.length;//X轴类目项的文字个数  
				var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
				if (rowN > 1)//如果类目项的文字大于3,  
				{  
					for (var i = 0; i < rowN; i++) {  
						var temp = "";//每次截取的字符串  
						var start = i * maxLength;//开始截取的位置  
						var end = start + maxLength;//结束截取的位置  
						//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
						temp = value.substring(start, end) + "\n";  
						ret += temp; //凭借最终的字符串  
					}  
					return ret;  
				}  
				else {  
					return value;  
				}  
			}
		},
		axisLine: {
			lineStyle: {
				type: 'solid',
				color: '#00DEFF',
				width: 1
			}
		},
		axisTick: {
			show: false
		}
	}],
	yAxis: [
		{
			type: 'value',
			name: '',
			// interval: 5,
			splitLine: {
				show: false
			},
			axisLine: {
				lineStyle: {
					type: 'solid',
					color: '#00DEFF',
					width: 1
				}
			},
			axisLabel: {
				formatter: '{value}',
				margin: 4,
				color: '#00DEFF',
				fontSize: 13
			},
			axisTick: {
				inside: true,
				length: 3
			}
		}
	],
	series: [
		{
			name: '值',
			type: 'bar',
			barMaxWidth: 24,
			itemStyle: {
				normal: {
					color: '#1CBFE8'
				}
			},
			data: [50, 44, 36, 30, 25, 20, 16, 11, 8, 3]
		}
	]
}

function getColorArr(type, valArr) {
	var colorArr = valArr.map(function(value){
		switch (type) {
			case 'aqi':
				if(value<=50){
					return 'rgb(0,228,0)'
				}else if(50<value&&value<=100){
					return 'rgb(255,255,0)'
				}else if(100<value&&value<=150){
					return 'rgb(255,126,0)'
				}else if(150<value&&value<=200){
					return 'rgb(255,0,0)'
				}else if(200<value&&value<=300){
					return 'rgb(153,0,76)'
				}else if(300<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'so2':
				if(value<=150){
					return 'rgb(0,228,0)'
				}else if(150<value&&value<=500){
					return 'rgb(255,255,0)'
				}else if(500<value&&value<=650){
					return 'rgb(255,126,0)'
				}else if(650<value&&value<=800){
					return 'rgb(255,0,0)'
				}else if(800<value){
					return 'rgb(153,0,76)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'no2':
				if(value<=100){
					return 'rgb(0,228,0)'
				}else if(100<value&&value<=200){
					return 'rgb(255,255,0)'
				}else if(200<value&&value<=700){
					return 'rgb(255,126,0)'
				}else if(700<value&&value<=1200){
					return 'rgb(255,0,0)'
				}else if(1200<value&&value<=2340){
					return 'rgb(153,0,76)'
				}else if(2340<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'pm2_5':
				if(value<=35){
					return 'rgb(0,228,0)'
				}else if(35<value&&value<=75){
					return 'rgb(255,255,0)'
				}else if(75<value&&value<=115){
					return 'rgb(255,126,0)'
				}else if(115<value&&value<=150){
					return 'rgb(255,0,0)'
				}else if(150<value&&value<=250){
					return 'rgb(153,0,76)'
				}else if(250<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'pm10':
				if(value<=50){
					return 'rgb(0,228,0)'
				}else if(50<value&&value<=150){
					return 'rgb(255,255,0)'
				}else if(150<value&&value<=250){
					return 'rgb(255,126,0)'
				}else if(250<value&&value<=350){
					return 'rgb(255,0,0)'
				}else if(350<value&&value<=420){
					return 'rgb(153,0,76)'
				}else if(420<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'co':
				if(value<=5){
					return 'rgb(0,228,0)'
				}else if(5<value&&value<=10){
					return 'rgb(255,255,0)'
				}else if(10<value&&value<=35){
					return 'rgb(255,126,0)'
				}else if(35<value&&value<=60){
					return 'rgb(255,0,0)'
				}else if(60<value&&value<=90){
					return 'rgb(153,0,76)'
				}else if(90<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
			case 'o3':
				if(value<=160){
					return 'rgb(0,228,0)'
				}else if(160<value&&value<=200){
					return 'rgb(255,255,0)'
				}else if(200<value&&value<=300){
					return 'rgb(255,126,0)'
				}else if(300<value&&value<=400){
					return 'rgb(255,0,0)'
				}else if(400<value&&value<=800){
					return 'rgb(153,0,76)'
				}else if(800<value){
					return 'rgb(126,0,35)'
				}else if(isNaN(value)){
					return 'rgb(0,228,0)'
				}
				break;
		}
	});
	return colorArr;
}

function fnMarkerMore(type,value,icon_y) {
	icon_y = icon_y || 0;
	var result={
		color:'',
		icon_x:1,
		icon_y:icon_y
	};
	switch (type) {
		case 'aqi':
			if(value<=50){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(50<value&&value<=100){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(100<value&&value<=150){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(150<value&&value<=200){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(200<value&&value<=300){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(300<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'so2':
			if(value<=150){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(150<value&&value<=500){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(500<value&&value<=650){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(650<value&&value<=800){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(800<value){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'no2':
			if(value<=100){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(100<value&&value<=200){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(200<value&&value<=700){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(700<value&&value<=1200){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(1200<value&&value<=2340){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(2340<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'pm2_5':
			if(value<=35){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(35<value&&value<=75){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(75<value&&value<=115){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(115<value&&value<=150){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(150<value&&value<=250){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(250<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'pm10':
			if(value<=50){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(50<value&&value<=150){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(150<value&&value<=250){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(250<value&&value<=350){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(350<value&&value<=420){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(420<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'co':
			if(value<=5){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(5<value&&value<=10){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(10<value&&value<=35){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(35<value&&value<=60){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(60<value&&value<=90){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(90<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;
		case 'o3':
			if(value<=160){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}else if(160<value&&value<=200){
				result.value=value;
				result.bgcolor='rgb(255,255,0)';
				result.color='black';
				result.icon_x=2;
				result.level='良';
			}else if(200<value&&value<=300){
				result.value=value;
				result.bgcolor='rgb(255,126,0)';
				result.color='white';
				result.icon_x=3;
				result.level='轻度';
			}else if(300<value&&value<=400){
				result.value=value;
				result.bgcolor='rgb(255,0,0)';
				result.color='white';
				result.icon_x=4;
				result.level='中度';
			}else if(400<value&&value<=800){
				result.value=value;
				result.bgcolor='rgb(153,0,76)';
				result.color='white';
				result.icon_x=5;
				result.level='重度';
			}else if(800<value){
				result.value=value;
				result.bgcolor='rgb(126,0,35)';
				result.color='white';
				result.icon_x=6;
				result.level='严重';
			}else if(isNaN(value)){
				result.value=value;
				result.bgcolor='rgb(0,228,0)';
				result.color='white';
				result.icon_x=1;
				result.level='优';
			}
			break;

	}
	return result;
}