/**
 * 对应后端涉及的 API
 * User: jiaomx
 * Date: 2016/12/22
 * Time: 14:59
 */

import xhr from './xhr/'
import fetch from './fetch';
import { success, error } from 'UTIL/notification';
class RoleManageService {

    /**
     * 获取角色列表请求逻辑
     * @returns {{}}
     */
    async readRoleManage() {
        return fetch({
            url: '/RoleManager/listRole',
            success: function (data) {
                if (data.code == '0') {
                    return data;
                }
                error(data.msg);
                return {};
            }
        });
    }
    // readRoleManage() {
    //     let roleManageList = {};
    //     xhr({
    //         url: '/RoleManager/listRole',
    //         async: false,
    //         success: function (data) {
    //             if (data.code == '0') {
    //                 roleManageList = data;
    //             } else {
    //                 error(data.msg);
    //             }
    //         }
    //     });
    //     return roleManageList;
    // }

    // 删除角色
    async deleteRole(RoleId, callback) {
        return fetch({
            url: '/RoleManager/delete',
            data: {
                names: RoleId
            },
            success: function (data) {
                if (data.code == '0') {
                    success('删除成功！');
                    if (typeof callback == 'function') {
                        callback();
                    }
                    return RoleId;
                }
                for (let key in data.result.status) {
                    error('角色[' + key + ']删除失败！' + data.result.status[key]);
                }
            }
        });
    }
    // deleteRole(RoleId) {
    //     var isDelSuccess = false;
    //     xhr({
    //         url: '/RoleManager/delete',
    //         async: false,
    //         data: {
    //             names: RoleId
    //         },
    //         success: function (data) {
    //             if (data.code == '0') {
    //                 success('删除成功！');
    //                 isDelSuccess = true;
    //             } else {
    //                 for (let key in data.result.status) {
    //                     error('角色[' + key + ']删除失败！' + data.result.status[key]);
    //                 }
    //             }
    //         }
    //     });
    //     if (isDelSuccess) {
    //         return RoleId;
    //     }
    // }
    // 创建角色

    // 创建角色
    async createRole(roleOption) {
        return fetch({
            url: '/RoleManager/create',
            data: roleOption,
            success: function (data) {
                if (data.code == '0') {
                    success('创建成功！');
                    return data;
                }
                error(data.msg);
                return data;
            }
        });
    }
    // createRole(roleOption) {
    //     let datas = {}
    //     xhr({
    //         url: '/RoleManager/create',
    //         data: roleOption,
    //         success: function (data) {
    //             datas = data;
    //             if (data.code == '0') {
    //                 success('创建成功！');
    //             } else {
    //                 error(data.msg);
    //             }
    //         }
    //     });
    //     return datas;
    // }

    // 查看角色详情
    getRole(RoleId) {
        let roleDetail = {};
        xhr({
            url: '/RoleManager/getRoleInfo',
            data: {
                datasetName: RoleId
            },
            success: function (data) {
                if (data.code == '0') {
                    roleDetail = data.result.detail;
                } else {
                    error(data.msg);
                }
            }
        });
        // 此时拿到角色对象
        return roleDetail;
    }

    async saveUserRole(roleName, roleUserList) {
        return fetch({
            url: '/RoleManager/modify',
            data: {roleName: roleName, member: roleUserList},
            success: function (data) {
                if (data.code == '0') {
                    success('保存成功！');
                    return data;
                }
                error(data.msg);
                return {};
            }
        });
    }
    // saveUserRole(roleName, roleUserList) {
    //     let saveUserRole = {};
    //     xhr({
    //         url: '/RoleManager/modify',
    //         data: {roleName: roleName, member: roleUserList},
    //         success: function (data) {
    //             if (data.code == '0') {
    //                 saveUserRole = data;
    //                 success('保存成功！');
    //             }else {
    //                 error(data.msg);
    //             }
    //         }
    //     });
    //     return saveUserRole;
    // }

}

// 导出实例化对象
export default new RoleManageService()
