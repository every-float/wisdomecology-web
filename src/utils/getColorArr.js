export default (type, valArr) => {
    return valArr.map(function(value){
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
}