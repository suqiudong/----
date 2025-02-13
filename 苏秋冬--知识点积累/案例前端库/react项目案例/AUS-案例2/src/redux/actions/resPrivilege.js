// import roleManageService from 'SERVICE/roleManageService'
// import usermanageService from 'SERVICE/usermanageService'
import resPrivilegeService from 'SERVICE/resPrivilegeService'
import datasetService from 'SERVICE/datasetServices'
import dashboardService from 'SERVICE/dashboardService'
// import jobService from 'SERVICE/jobManageService'
import driverService from 'SERVICE/driverManageService'
import pluginService from 'SERVICE/pluginManageService'
import reportService from 'SERVICE/reportService'

// ================================
// Action Type
// ================================
const CREATE_RES_PRIVILEGE = 'CREATE_RES_PRIVILEGE';
const READ_RES_PRIVILEGE = 'READ_RES_PRIVILEGE';
const READ_ALL_USER = 'READ_ALL_USER';
const READ_ALL_ROLE = 'READ_ALL_ROLE';
const SELECT_RECORD = 'SELECT_RECORD';
const CHECK_RES_PRIVILEGE = 'CHECK_RES_PRIVILEGE';

// ================================
// Action Creator
// ================================

// 页面加载后读取已有用户和角色列表
const readResPrivilege = (data) => {
	let resPrivilegeData = resPrivilegeService.readResPrivilege(data);
    return {
        type: 'READ_RES_PRIVILEGE',
        payload: {
            resPrivilegeData: resPrivilegeData
        }
    }
};

const createResPrivilege = (data) => {
    let create = resPrivilegeService.createResPrivilege(data);
    return {
        type: 'CREATE_RES_PRIVILEGE',
        payload: {
            create: create
        }
    }
};

// 添加用户时请求所有用户接口
const allUserList = () => {
    let allUserList = resPrivilegeService.readUsermanages().result.data;
	// let allUserList = usermanageService.readUsermanages().result.data;
    let allUserList1 = {};
    allUserList1.member = [];
    for (let i = 0; i < allUserList.length; i++) {
        let user = {};
        user.name = allUserList[i].name;
        user.userName = allUserList[i].userName;
        allUserList1.member.push(user);
    }
    return {
        type: 'READ_ALL_USER',
        payload: {
            allUserList: allUserList1
        }
    }
};

// 添加角色时请求所有角色接口
const allRoleList = () => {
    let allRoleList = resPrivilegeService.readRoleManage().result.data;
    // let allRoleList = roleManageService.readRoleManage().result.data;
    let allRoleList1 = {};
    allRoleList1.member = [];
    for (let i = 0; i < allRoleList.length; i++) {
        let role = {};
        role.desc = allRoleList[i].desc;
        role.roleName = allRoleList[i].roleName;
        allRoleList1.member.push(role);
    }
    return {
        type: 'READ_ALL_ROLE',
        payload: {
            allRoleList: allRoleList1
        }
    }
};
// 获取选取的行数据
const selectedRecord = (resName, resType) => {
    let selectedRes = {};
    switch (resType.toLowerCase()) {
        case 'dataset':
            selectedRes = datasetService.getDataset(resName);
            break;
        case 'report':
            selectedRes = reportService.getReport(resName);
            break;
        case 'driver':
            selectedRes = driverService.lastDriverInfo(resName).result.detail;
            break;
        case 'job':
            selectedRes = resPrivilegeService.readJobinfor(resName).result.detail;
            // selectedRes = jobService.readJobinfor(resName).result.detail;
            break;
        case 'dashboard':
            selectedRes = dashboardService.getDashboard(resName);
            break;
        case 'plugin':
            selectedRes = pluginService.lastPluginInfo(resName);
            break;

    }
    return {
        type: 'SELECT_RECORD',
        payload: {
            selectedRecord: selectedRes
        }
    }
};

const checkResPrivilege = (data) => {
    return {
        type: 'CHECK_RES_PRIVILEGE',
        payload: {
            checkResPrivilege: resPrivilegeService.checkResPrivilege(data)
        }
    }
}

/* default 导出所有 Actions Creator */
export default {
    readResPrivilege, allUserList, allRoleList, selectedRecord, createResPrivilege, checkResPrivilege
}

// ================================
// Action handlers for Reducer
// ================================
export const ACTION_HANDLERS = {
    [READ_RES_PRIVILEGE]: (resPrivilege, { payload }) => Object.assign({}, resPrivilege, { resPrivilegeData: payload.resPrivilegeData}),
    [CREATE_RES_PRIVILEGE]: (resPrivilege, { payload }) => Object.assign({}, resPrivilege, { code: payload.code}),
    [READ_ALL_USER]: (resPrivilege, { payload }) => { resPrivilege.allUserList = payload.allUserList; return resPrivilege; },
    [READ_ALL_ROLE]: (resPrivilege, { payload }) => { resPrivilege.allRoleList = payload.allRoleList; return resPrivilege; },
    [SELECT_RECORD]: (resPrivilege, { payload }) => { resPrivilege.selectedRecord = payload.selectedRecord; return resPrivilege; },
    [CHECK_RES_PRIVILEGE]: (resPrivilege, { payload }) => { resPrivilege.checkResPrivilege = payload.checkResPrivilege; return resPrivilege; }
};
