/**
 * Created by xdata on 7/12.
 */
import fetch from './fetch';
import {error, success} from 'UTIL/notification';

class DataSourceModelService {
    // 读取数据源列表
    /*
     同步请求
     readDataSource() {
     let dataSourceList = {};
     xhr({
     url: '/DataSource/list',
     async: false,
     success: function (data) {
     if (data.code == '0') {
     dataSourceList = data.result.data;
     } else {
     // error(data.msg);
     }
     }
     });
     return dataSourceList;

     }
    async readDashboards() {
        return fetch({
            url: '/DashboardManager/list',
            success: function (data) {
                if (data.code == '0') {
                    return data;
                }
                error(data.msg);
                return {};
            }
        });
    }
     */
    // 获取数据模型列
    async readDataSource() {
        return fetch({
            url: '/DataSource/list',
            async: false,
            success: function (data) {
                if (data.code == '0') {
                    return data.result.data;
                }
                error(data.msg);
                return {};
            }
        });
    }
    // 查询建模
    async dataModelManagerList() {
        return fetch({
            url: '/DataModelManager/list',
            async: false,
            success: function (data) {
                if (data.code == '0') {
                    return data.result.data;
                }
                error(data.msg);
                return {};
            }
        });
    }

    // 获取数据源表信息
    async getDataSource(DataSourceName) {
        return fetch({
            url: '/DataSource/detail',
            data: DataSourceName,
            success: function (data) {
                if (data.code == '0') {
                   return data.result.detail;
                } else {
                    // error(data.msg);
                    return {};
                }
            }
        });
    }
    // 获取结果集
   async getPlanResult(mqlOptions) {
       return fetch({
            url: '/DataSource/Sql',
            data: mqlOptions,
            success: function (data) {
                if (data.code == '0') {
                    // success('数据查询成功');
                    return data.result.data;
                } else {
                    error(data.msg);
                    return {};

                }
            }
        });
    }

    // 保存
    async datamodelSave(mqlOptions) {
        return fetch({
            url: '/DataModelManager/create',
            data: mqlOptions,
            success: function (data) {
                if (data.code == '0') {
                     success('保存成功');
                } else {
                    error(data.msg);

                }
            }
        });
    }
    // 删除
    async deleteModelSer(mqlOptions) {
        return fetch({
            url: '/DataModelManager/delete',
            data: mqlOptions,
            success: function (data) {
                if (data.code == '0') {
                    success('删除成功');
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
    // 上线
    async onSch(modelName) {
        return fetch({
            url: '/DataModelManager/onSch',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    success('上线成功');
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
    // 下线
    async offSch(modelName) {
        return fetch({
            url: '/DataModelManager/offSch',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    success('下线成功');
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
    // 停止当前同步
    async killCurrent(modelName) {
        return fetch({
            url: '/DataModelManager/killCurrent',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    success('停止同步成功');
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
    // 运行同步
    async runOnce(modelName) {
        return fetch({
            url: '/DataModelManager/runOnce',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    success('同步成功');
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }

    // 详情页
    async getModel(modelName) {
        return fetch({
            url: '/DataModelManager/get',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    return data.result;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }

    //  修改数据模型
    async modifybasic(modelName) {
        return fetch({
            url: '/DataModelManager/modifybasic',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    success('修改成功');
                } else {
                    error(data.msg);
                }
            }
        });
    }
    //  获取同步信息状态
    async isRunningBatch(modelName) {
        return fetch({
            url: '/DataModelManager/isRunning',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
    //  获取上线信息
    async isOnSchBatch(modelName) {
        return fetch({
            url: '/DataModelManager/isOnSch',
            data: modelName,
            success: function (data) {
                if (data.code == '0') {
                    return data;
                } else {
                    error(data.msg);
                    return {};
                }
            }
        });
    }
}

export default new DataSourceModelService();
