/**
 * 对应后端涉及的 API
 * User: gaogy
 * Date: 2017/1/09
 * Time: 10:47
 */

import xhr from './xhr/';
import fetch from './fetch';
// import fetch from 'isomorphic-fetch';
import { error, success } from 'UTIL/notification';
class QuickLinkService {
    /**
     * 获取快速导航信息
     */
    async getDataSoucerInfo() {
        return fetch({
            url: '/DataSource/homepage',
            success: function(data) {
                if (data.code == '0') {
                    return data.result;
                }
                return {}
            }
        })
    }

    // async getQuickLinkInfo() {
    //     return fetch({
    //         url: '/UserManager/getUserInfo',
    //         data: {
    //             userName: sessionStorage.getItem('XDataUserName')
    //         },
    //         success: function (data) {
    //             if (data.code == '0') {
    //                 return data.result.detail;
    //             }
    //             error(data.msg);
    //             return {};
    //         }
    //     });
    // }
    getQuickLinkInfo() {
        let userInfo = {};
        xhr({
            url: '/UserManager/getUserInfo',
            data: {
                userName: sessionStorage.getItem('XDataUserName')
            },
            success: function (data) {
                if (data.code == '0') {
                    userInfo = data.result.detail;
                } else {
                    error(data.msg);
                }
            }
        });
        return userInfo;
    }

    /**
     * 更新快速导航信息
     * @param userInfo
     *
     */
    async setQuickLinkInfo(userInfo) {
        return fetch({
            url: '/UserManager/modifyUserInfo',
            data: {
                userName: userInfo.userName,
                phoneNo: userInfo.phoneNo,
                name: userInfo.name,
                email: userInfo.email,
                department: userInfo.department,
                position: userInfo.position,
                quickLink: userInfo.quickLink
            },
            success: function (data) {
                if (data.code == '0') {
                    success('快速导航更新成功！');
                    return userInfo;
                }
                error(data.msg);
                return {};
            }
        });
    }

    // setQuickLinkInfo(userInfo) {
    //     let report = {};
    //     xhr({
    //         url: '/UserManager/modifyUserInfo',
    //         data: {
    //             userName: userInfo.userName,
    //             phoneNo: userInfo.phoneNo,
    //             name: userInfo.name,
    //             email: userInfo.email,
    //             department: userInfo.department,
    //             position: userInfo.position,
    //             quickLink: userInfo.quickLink
    //         },
    //         success: function (data) {
    //             if (data.code == '0') {
    //                 report = userInfo;
    //                 success('快速导航更新成功！');
    //             } else {
    //                 error(data.msg);
    //             }
    //         }
    //     });
    //     return report;
    // }
}

// 导出实例化对象
export default new QuickLinkService()
