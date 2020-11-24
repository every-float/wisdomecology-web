let field;
let display;
let mapAnimator;
let overlay;
let url = 'http://scapi.weather.com.cn/weather/getwindmincas?type=1000&test=ncg';
let oData = {};

//数据处理
function getData(){
    $.getJSON('./res/lib/data.json',res=>{
        parseWindData(res);
    })
}
function parseWindData(data){
    field = VectorField.read(data, true);
    // 经度-180和180是一样的
    field.field.unshift(field.field[field.w - 1]);
    field.x0 = -180;
    field.w += 1;
    overlay = createOverlay(field);
    if(display){
        display.field = field;
    }else{
        L.canvasLayer()
            .delegate({
                onDrawLayer: info => {
                    initWindField(info.canvas, info.layer._map)
                }
            })
            .addTo(leafletMap)

        // 两个 色彩canvas，一个本来的，一个复制平移的（投影后x加上总宽度）
        L.canvasLayer()
            .delegate({
                onDrawLayer: info => {
                    initWindOverlay(info.canvas, info.layer._map)
                }
            })
            .addTo(leafletMap)
    }
}

function initWindOverlayMain(map) {
    overlay.isoBands.forEach(function (group) {
        let polygon = L.polygon(group.coords, {
            stroke: false,
            color: group.color,
            weight: 0,
            fill: true,
            fillColor: group.color,
            fillOpacity: 1,
            clickable: false,
        }).addTo(map)
    })
}

let hasDrawOverlay = false

function initWindOverlay(canvas, map) {
    if (!hasDrawOverlay) {
        hasDrawOverlay = true

        let ctx = canvas.getContext('2d');
        let handleStart = function (e) {
            // ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        let handleEnd = function (e) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            let _start = Date.now()
            overlay.draw(canvas, map)
            // console.log(Date.now() - _start)
        }
        map.off('zoomstart', handleStart)
        map.off('zoomend', handleEnd)
        map.on('movestart', handleStart)
        map.on('moveend', handleEnd)

        overlay.draw(canvas, map)
        initWindOverlayMain(map)
    }
}

function initWindField(canvas, map) {
    if (display) {
        display.makeNewParticles(null, true)
    } 
    else 
    {
        let ctx = canvas.getContext('2d')
        let handleStart = function (e) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            mapAnimator.stop = true
        }
        let handleEnd = function (e) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            mapAnimator.stop = false
        }
        map.off('zoomstart', handleStart)
        map.off('zoomend', handleEnd)
        map.on('movestart', handleStart)
        map.on('moveend', handleEnd)

        display = new MotionDisplay(canvas, field, map)
        mapAnimator = new Animator()
        mapAnimator.add(display)
        mapAnimator.start(40)
    }
}
getData();



