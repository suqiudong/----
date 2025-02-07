/**
 *插件管理组件
 * User: jiaomx
 * Date: 2017/2/5
 * Time: 10:40
 */

import React, { Component } from 'react';
import createList, { bindTableEvent } from 'UTIL/baseList';
import Modal from 'COMPONENT/Common/Modal/Modal';
import { cutStr } from 'UTIL/util';

let timer;
class JobManage extends Component {
	constructor(props) {
        super(props);
        this.jobOnlineHandler = this.jobOnlineHandler.bind(this);
        this.selectJob = this.selectJob.bind(this);
        this.onlineOKHandler = this.onlineOKHandler.bind(this);
        this.jobOfflineHandler = this.jobOfflineHandler.bind(this);
        this.offlineOKHandler = this.offlineOKHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.removeOKHandler = this.removeOKHandler.bind(this);
        this.jobStopHandler = this.jobStopHandler.bind(this);
        this.jobStopOKHandler = this.jobStopOKHandler.bind(this);
        this.jobStartHandler = this.jobStartHandler.bind(this);
        this.jobStartOKHandler = this.jobStartOKHandler.bind(this);
        this.createJob = this.createJob.bind(this);
        this.jobDetail = this.jobDetail.bind(this);
        this.jobUpdateHandler = this.jobUpdateHandler.bind(this);
        this.jobUpdatetOKHandler = this.jobUpdatetOKHandler.bind(this);
        this.privilegeHandler = this.privilegeHandler.bind(this);
        this.readJobList = this.readJobList.bind(this);
        this.setUpdateTime = this.setUpdateTime.bind(this);
        this.updateTimeChange = this.updateTimeChange.bind(this);
        this.state = {
            updateTime: 60000
        }
    }

	componentWillMount() {
        // 读取作业列表数据
        this.props.readJobList();
    }

    componentDidUpdate() {
        this.createTable(this.props.jobManage.jobList.result.data);
        clearInterval(timer);
        timer = setTimeout(() => {this.props.readJobList()}, this.state.updateTime);
    }

    componentDidMount() {
    }

    readJobList() {
        // 读取作业列表数据
        this.props.readJobList();
    }

    createTable(data) {

        // 构造列表配置项
        let tableConfig = {};

        tableConfig.id = 'jobList';

        let preTable = $('#jobList').DataTable();

        preTable.column(5).visible(true, false);
        preTable.column(6).visible(true, false);

        // 定义用户列字段数据
        tableConfig.columns = [
            // { data: 'jobName', 'defaultContent': '-' },
            {
                data: 'jobName',
                render: function (data, type, row, meta) {
                    if (data.length > 20) {
                        return `<span title=${data}>${cutStr(data, 20)}...</span>`
                    }
                    return data;
                },
                'defaultContent': '-'
            },
            { data: 'scheduleStrategy', 'defaultContent': '-' },
            { data: 'lastStartTime', 'defaultContent': '-' },
            // { data: 'schStatus', 'defaultContent': '-' },
            {
                data: 'schStatus',
                render: function (data, type, row, meta) {
                    if (data == 'ON') {
                        return '上线';
                    } else {
                        return '下线';
                    }
                },
                'defaultContent': '-'
            },
            { data: 'runStatus', 'defaultContent': '-' },
            { data: 'validStatus', 'defaultContent': '-' },
            { data: 'pluginStatus', 'defaultContent': '-' },
            // { data: 'lastResult', 'defaultContent': '-' },
            {
                data: 'lastResult',
                render: function (data, type, row, meta) {
                    if (row.runStatus == '执行中') {
                        return '-';
                    }
                    if (data == 'SUCCEED') {
                        return '成功';
                    } else if (data == 'FAILED') {
                        return '失败';
                    } else if (data == 'KILLED') {
                        return '已停止';
                    }
                },
                'defaultContent': '-'
            },
            { data: 'privilege', 'defaultContent': '-' }
        ];

        let userRolePermission = sessionStorage.getItem('userRolePermission');
        // 定义列表内操作列
        if (userRolePermission.indexOf('JOB_QUERY') != -1) {
        // if (userRolePermission.indexOf('USER_') != -1) {
            tableConfig.columnDefs = [
            {
                'targets': 8, // 操作列生成位置，当前为列表第7列
                'render': function (data, type, row) {
                    let html = '';
                    if (row.privilege.JOB.length !== 0) {
                        if (row.privilege.JOB.indexOf('查看') != -1) {
                            html += `<a href='javascript:void(0);'  class='jobDetail btn btn-default btn-xs'><i class='fa fa-file-text-o'></i> 详情</a> `;
                        }
                        if (row.privilege.JOB.indexOf('操作') != -1) {
                            if (row.schStatus == 'ON') {  // row.scheduleStrategy == '周期' &&
                                html += `<a href='javascript:void(0);'  class='joboffline btn btn-default btn-xs'><i class='fa fa-level-down'></i> 下线</a> `;
                            } else if (row.schStatus == 'OFF') {  // row.scheduleStrategy == '周期' &&
                                html += `<a href='javascript:void(0);'  class='jobOnline btn btn-default btn-xs'><i class='fa fa-level-up'></i> 上线</a> `;
                            } else {
                                html += ` `;
                            }

                            if (row.runStatus == '执行中') {
                                html += `<a href='javascript:void(0);'  class='jobStop btn btn-default btn-xs'><i class='fa fa-stop-circle'></i> 停止</a> `;
                            }else if (row.runStatus == '待执行') {
                                html += `<a href='javascript:void(0);'  class='jobStart btn btn-default btn-xs'><i class='fa fa-play-circle'></i> 执行</a> `;
                            }
                        }
                        if (row.privilege.JOB.indexOf('修改') != -1) {
                            html += `<a href='javascript:void(0);' class='jobUpdate btn btn-default btn-xs'><i class='fa fa-pencil-square-o'></i> 更新</a> `;
                        }
                        if (row.privilege.JOB.indexOf('授权') != -1) {
                            html += `<a href='javascript:void(0);' class='privilege btn btn-default btn-xs'><i class='fa fa-wrench'></i> 授权</a> `;
                        }
                        if (row.privilege.JOB.indexOf('删除') != -1) {
                            html += `<a href='javascript:void(0);' class='jobRemove btn btn-default btn-xs'><i class='fa fa-trash-o'></i> 删除</a></div>`;
                        }

                    } else {
                        html += `<span>  无操作权限<span/>`
                    }

                    return html;
                }
            }];
        }

        // 获取用户列表内数据列

        tableConfig.data = data;
        tableConfig.scrollX = true;
        tableConfig.order = [[ 0, 'asc' ]];


        // 生成作业列表
        let table = createList(tableConfig);

        table.column(5).visible(false, true);
        table.column(6).visible(false, true);

        // 作业列表内查看详细事件绑定
        bindTableEvent('jobList', 'click', 'a.jobDetail', this.jobDetail);

        // 作业列表内修改事件绑定
        bindTableEvent('jobList', 'click', 'a.jobUpdate', this.jobUpdateHandler);

        // 作业列表内删除事件绑定
        bindTableEvent('jobList', 'click', 'a.jobRemove', this.removeHandler);

        // 作业列表上线事件绑定
        bindTableEvent('jobList', 'click', 'a.jobOnline', this.jobOnlineHandler);

        // 作业下线事件绑定
        bindTableEvent('jobList', 'click', 'a.joboffline', this.jobOfflineHandler);

        // 作业列表开始执行事件绑定
        bindTableEvent('jobList', 'click', 'a.jobStart', this.jobStartHandler);

        // 作业列表停止事件绑定
        bindTableEvent('jobList', 'click', 'a.jobStop', this.jobStopHandler);

        // 列表内授权事件绑定
        bindTableEvent('jobList', 'click', 'a.privilege', this.privilegeHandler);
    }

    // 保存组件单条数据
    selectJob(e) {
        let selectJobDate = $('#jobList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.saveSelectjob(selectJobDate);
        return selectJobDate;
    }

    privilegeHandler(e) {
        let selectedRecord = this.selectJob(e);
        this.props.history.replace('/job/accredit/' + selectedRecord.jobName);
    }

    // 作业上线
    jobOnlineHandler(e) {
        let selectJobDate = this.selectJob(e);
        $('#jobOnline').modal();
        this.refs.jobOnline.setContent('您确定要上线' + selectJobDate.jobName + '作业吗？');
    }

    onlineOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.jobOnline(jobName);
        $('#jobOnline').modal('hide');
        this.props.readJobList();
    }

    // 作业下线
    jobOfflineHandler(e) {
        let selectJobDate = this.selectJob(e);
        $('#jobOffline').modal();
        this.refs.jobOffline.setContent('您确定要下线' + selectJobDate.jobName + '作业吗？');
    }

    offlineOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.jobOffline(jobName);
        $('#jobOffline').modal('hide');
        this.props.readJobList();
    }

    // 作业删除
    removeHandler(e) {
        let selectJobDate = this.selectJob(e);
        $('#jobRemove').modal();
        this.refs.jobRemove.setContent('作业调度状态：' + this.props.jobManage.selectJobDate.schStatus + '，执行状态：' + this.props.jobManage.selectJobDate.runStatus + '，作业停止执行并下调度，您确定要删除' + selectJobDate.jobName + '作业吗？');
    }

    removeOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.jobRemove(jobName);
        $('#jobRemove').modal('hide');
        this.props.readJobList();
    }

    // 停止作业
    jobStopHandler(e) {
        let selectJobDate = this.selectJob(e);
        $('#jobStop').modal();
        this.refs.jobStop.setContent('您确定要停止' + selectJobDate.jobName + '作业吗？');
    }

    jobStopOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.jobStop(jobName);
        $('#jobStop').modal('hide');
        this.props.readJobList();
    }

     // 开始执行作业
    jobStartHandler(e) {
        let selectJobDate = this.selectJob(e);
        $('#jobStart').modal();
        this.refs.jobStart.setContent('您确定要开始执行' + selectJobDate.jobName + '作业吗？');
    }

    jobStartOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.jobStart(jobName);
        $('#jobStart').modal('hide');
        setTimeout(()=>{
            this.props.readJobList();
        }, 1000)
    }

    // 作业新建
    createJob() {
        this.props.history.replace('/job/add');
    }

    // 作业详情
    jobDetail(e) {
        let selectJobDate = this.selectJob(e);
        this.props.history.replace('/job/detail/' + selectJobDate.jobName);
    }

    // 作业更新
    jobUpdateHandler(e) {
        let selectJobDate = this.selectJob(e);
        let data = this.props.jobManage.selectJobDate;
        if (data.schStatus == 'ON' || data.runStatus == '执行中') {
            $('#jobUpdate').modal();
            this.refs.jobUpdate.setContent('检测到' + selectJobDate.jobName + '作业正在处于调度状态或正在执行，继续执行会自动停止并下调度，您确定要更新吗？');
        } else {
            this.props.history.replace('/job/update/' + selectJobDate.jobName);
        }
    }
    jobUpdatetOKHandler() {
        let jobName = this.props.jobManage.selectJobDate.jobName;
        this.props.isRun(jobName);
        if (this.props.jobManage.isRunning.code == 0) {
            $('#jobUpdate').modal('hide');
            this.props.history.replace('/job/update/' + jobName);
        }
    }

    setUpdateTime() {
        $('#updataTime').modal();
        this.refs.updataTime.setContent(<input type="number" className="form-control" id="setUpdateTime" placeholder="请设定自动更新间隔时间(s/次)" />);
    }

    updateTimeChange() {
        this.setState({
            updateTime: Number($('#setUpdateTime').val()) * 1000
        });
        $('#updataTime').modal('hide');
    }

	render() {
        // 判断插件操作权限
        let thTpl = <tr>
                <th>作业名</th>
                <th>调度策略</th>
                <th>上次执行时间</th>
                <th>调度状态</th>
                <th>执行状态</th>
                <th>有效性</th>
                <th>插件状态</th>
                <th>执行结果</th>
            </tr>;
        let userRolePermission = sessionStorage.getItem('userRolePermission');
        if (userRolePermission.indexOf('JOB_') != -1) {
            thTpl = <tr>
                    <th>作业名</th>
                    <th>调度策略</th>
                    <th>上次执行时间</th>
                    <th>调度状态</th>
                    <th>执行状态</th>
                    <th>有效性</th>
                    <th>插件状态</th>
                    <th>执行结果</th>
                    <th>操作</th>
                </tr>;
        }
        let btn;
        if (userRolePermission.indexOf('JOB_CREATE') != -1) {
            btn = <button type="submit" className="btn btn-primary" onClick={ this.createJob}>新建</button>
        }
		return (
			<div id="jobManage" className="box box-primary" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="box-header" style={{float: 'left'}}>
                        {btn}
                        <small style={{ padding: '15px 10px' }}>
                            作业列表更新时间为: {this.state.updateTime / 1000} (s/次)
                            <a href="javascript:;" onClick={ this.readJobList }> 更新 </a>
                             { ' | ' }
                             <a href="javascript:;" onClick={ this.setUpdateTime }> 设置 </a>
                        </small>
                        </div>
                        <div className="box-body">
                            <table id="jobList" className="table table-striped table-bordered">
                                <thead>
                                    {thTpl}
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal modalId="jobOnline" ref='jobOnline' title="上线作业" okHandler={ this.onlineOKHandler }/>
                <Modal modalId="jobOffline" ref='jobOffline' title="下线作业" okHandler={ this.offlineOKHandler }/>
                <Modal modalId="jobRemove" ref='jobRemove' title="删除作业" okHandler={ this.removeOKHandler }/>
                <Modal modalId="jobStop" ref='jobStop' title="停止作业" okHandler={ this.jobStopOKHandler }/>
                <Modal modalId="jobStart" ref='jobStart' title="执行作业" okHandler={ this.jobStartOKHandler }/>
                <Modal modalId="jobUpdate" ref='jobUpdate' title="更新作业" okHandler={ this.jobUpdatetOKHandler }/>
                <Modal modalId="updataTime" ref='updataTime' title="更新时间" okHandler={ this.updateTimeChange }/>
            </div>
		)
	}
}
export default JobManage;
