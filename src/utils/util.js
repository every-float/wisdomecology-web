/**
 * 对象转queryString
 * @export
 * @param {Object} obj - 需要转换的对象
 * @returns
 * @author lvwenji
 */
export function o2u(obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    return keys.map((v, k) => {
        return `${v}=${values[k]}`;
    }).join("&");
}