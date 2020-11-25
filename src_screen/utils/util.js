/**
 * 对象转queryString
 * @export
 * @param {Object} obj - 需要转换的对象
 * @author lvwenji
 */
export function o2u(obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    return keys.map((v, k) => {
        return `${v}=${values[k]}`;
    }).join("&");
}

/**
 * 函数防抖
 * @param {Function} fn 
 * @param {Number} delay 
 * @author lvwenji
 */
export function debounce(fn,delay = 200){
    let timer = 0;
    return function(...arg){
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.call(this,...arg);
        },delay);
    }
}