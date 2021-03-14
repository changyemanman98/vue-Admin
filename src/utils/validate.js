/* 过滤器 */
export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

/* 邮箱正则验证 */
export function validateEmail(value) {
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(value) ? false : true;
}

/* 密码正则验证 */
export function validatePass(value) {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return reg.test(value) ? false : true;
}

/* 验证码正则验证 */
export function validateCo(value) {
    let reg = /^[a-z0-9]{6}$/;
    return reg.test(value) ? false : true;
}

/* 
*没使用default时,可以同时生命多个export
*文件import引用时需要带花括号
*/