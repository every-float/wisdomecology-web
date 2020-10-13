export default (type,value,icon_y) => {
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