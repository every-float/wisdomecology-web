/******设置根元素字体大小*******/
!function(win,doc){
    var d=doc.documentElement;
    function change(){
        d.style.fontSize= d.clientWidth/96+'px';
        win.fz = d.clientWidth/96
    }
    win.addEventListener('resize',change,false);
    change();
}(window,document);
