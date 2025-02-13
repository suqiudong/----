/**
 * reducer入口
 * User: gaogy
 * Date: 2016/11/28
 * Time: 14:58
 */
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import store from 'STORE';
import breadcrumbReducer from 'REDUCER/breadcrumb';
import sidebarReducer from 'REDUCER/sidebar';
import reportReducer from 'REDUCER/report';
import usermanageReducer from 'REDUCER/usermanage';
import systemPrivilegeReducer from 'REDUCER/systemPrivilege';
import roleManageReducer from 'REDUCER/roleManage';
import loginReducer from 'REDUCER/login';
import datasetReducer from 'REDUCER/dataSet';
import userCenterReducer from 'REDUCER/userCenter';
import changePasswdReducer from 'REDUCER/changePasswd';
import dashboardReducer from 'REDUCER/dashboard';
import quickLinkReducer from 'REDUCER/quickLink';
import driverManageReducer from 'REDUCER/driverManage';
import jobManageReducer from 'REDUCER/jobManage';
import resPrivilegeReducer from 'REDUCER/resPrivilege';
import installReducer from 'REDUCER/install';
import dataViewReducer from 'REDUCER/dataView';
import serviceMonitorReducer from 'REDUCER/serviceMonitor'
import logQueryReducer from 'REDUCER/log';
import nodeServerManageReducer from 'REDUCER/nodeServerManage';
import nodeMonitorReducer from 'REDUCER/nodeMonitor';
import pluginManageReducer from 'REDUCER/pluginManage';
import dataSourceConfReducer from 'REDUCER/dataSourceConf';
import dataSourceModelReducer from 'REDUCER/dataSourceModel';
// ================================
// 同步的 Reducers（即应用初始化所必需的）
// ================================
const syncReducers = {
    router: routerReducer,
    breadcrumb: breadcrumbReducer,
    sidebar: sidebarReducer,
    report: reportReducer,
    systemPrivilege: systemPrivilegeReducer,
    usermanage: usermanageReducer,
    roleManage: roleManageReducer,
    dataset: datasetReducer,
    login: loginReducer,
    userCenter: userCenterReducer,
    changePasswd: changePasswdReducer,
    dashboard: dashboardReducer,
    quickLink: quickLinkReducer,
    pluginManage: pluginManageReducer,
    driverManage: driverManageReducer,
    jobManage: jobManageReducer,
    resPrivilege: resPrivilegeReducer,
    install: installReducer,
    dataView: dataViewReducer,
    serviceMonitor: serviceMonitorReducer,
    logQuery: logQueryReducer,
    nodeServerManage: nodeServerManageReducer,
    nodeMonitor: nodeMonitorReducer,
    dataSourceConf: dataSourceConfReducer,
    dataSourceModel: dataSourceModelReducer
};

// ================================
// 异步加载的 Reducers（Code Splitting 按需加载的）
// ================================
const asyncReducers = {};

/**
 * @return {Function} rootReducer
 */
export function createRootReducer() {
    return combineReducers({
        ...syncReducers,
        ...asyncReducers
    });
}

/**
 * 按需加载时，立即注入对应的 Reducer
 * @param  {String}   key
 * @param  {Function} reducer
 */
export function injectReducer(key, reducer) {
    asyncReducers[key] = reducer;
    store.replaceReducer(createRootReducer()); // 替换当前的 rootReducer
}
