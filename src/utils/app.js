import cookie from "cookie_js";

const adminToKen = "admin_toKen";
const usernamekey = "username";

export function getToKen(){
    return cookie.get(adminToKen);
}

export function setToKen(toKen){
    return cookie.set(adminToKen, toKen);
}

export function removeToKen(){
    return cookie.remove(adminToKen);
}

export function setUserName(value){
    return cookie.set(usernamekey, value);
}

export function getUserName(){
    return cookie.get(usernamekey);
}

export function removeUserName(){
    return cookie.remove(usernamekey);
}
