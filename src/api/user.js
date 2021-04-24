import service from "@/utils/request"

/* 
* 角色列表
*/
export function GetRole(data = {}){  //外界有参数时会把参数传给data,没有传入参数时data默认为{}
    return service.request({
        method: "post",
        url: "/role/",
        data
    })
}

/* 
* 按钮权限
*/
export function GetPermButton(data = {}){  //外界有参数时会把参数传给data,没有传入参数时data默认为{}
    return service.request({
        method: "post",
        url: "/permButton/",
        data
    })
}

/* 
* 系统列表
*/
export function GetSystem(data = {}){  //外界有参数时会把参数传给data,没有传入参数时data默认为{}
    return service.request({
        method: "post",
        url: "/system/",
        data
    })
}

/* 
* 添加用户
*/
export function UserAdd(data = {}){
    return service.request({
        method: "post",
        url: "/user/add/",
        data
    })
}

/* 
* 删除用户
*/
export function UserDel(data = {}){
    return service.request({
        method: "post",
        url: "/user/delete/",
        data
    })
}

/* 
* 用户禁启用
*/
export function UserActives(data){
    return service.request({
        method: "post",
        url: "/user/actives/",
        data
    })
}

/* 
* 用户编辑
*/
export function UserEdit(data){
    return service.request({
        method: "post",
        url: "/user/edit/",
        data
    })
}

