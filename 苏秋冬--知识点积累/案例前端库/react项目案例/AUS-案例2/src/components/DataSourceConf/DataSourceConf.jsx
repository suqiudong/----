/**
 * User: zhangaoxiang
 * Date: 2016/12/9
 * Time: 17:10
 */
import React, { Component } from 'react';
import Modal from 'COMPONENT/Common/Modal/Modal';
import createList, { bindTableEvent } from 'UTIL/baseList';
import createTip from 'UTIL/baseTip';
import {decodeBySMS4} from 'UTIL/sm4';
import usermanageService from 'SERVICE/usermanageService';
import Refresh from 'COMPONENT/Common/Refresh/Refresh';
const key = '2C023A86BD32812A4C180A7152EEBF0A';

export default class DataSourceConf extends Component {
    constructor(props) {
        super(props);
        this.createTable = this.createTable.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.detailHandler = this.detailHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.removeOKHandler = this.removeOKHandler.bind(this);
        this.clickOwnerHandler = this.clickOwnerHandler.bind(this);
        this.sync = this.sync.bind(this);
    }
    componentWillMount() {
        // 读取列表数据
        (async ()=>{
            await this.props.readDataSource();
            if (this.props.dataSourceConf.dataSourceList.code == '0') {
                this.createTable(this.props.dataSourceConf.dataSourceList.result.data);
            }
        })();

    }
    componentDidUpdate() {
        $('button[name = "createDataScource"]').on('click', this.addHandler);
    }
    createTable(data) {
        // 构造列表配置项
        let tableConfig = {};
        tableConfig.id = 'dataSourceList';
        tableConfig.scrollX = false;
        tableConfig.columns = [
            {data: 'dataSourceName', 'defaultContent': '-'},
            {data: 'dataSourceType', 'defaultContent': '-'},
            {
                data: 'connectionConfig',
                'render': function (data) {
                    let html = decodeBySMS4(data.user.split(','), key);
                    return html;
                },
                'defaultContent': '-'
            },
            {data: 'connectionConfig',
                render: function (data) {
                    return decodeBySMS4(data.url.split(','), key);
                },
                'defaultContent': '-'
            },
            {
                data: 'status',
                'render': function (data) {
                    let html = '';
                    html += `<a href='javascript:void(0);'  class='dataSourceDetail btn btn-default btn-xs'  ><i class='fa fa-file-text-o'></i> 详情</a> `;
                    html += `<a href='javascript:void(0);' class='dataSourceEdit btn btn-default btn-xs'><i class='fa fa-pencil-square-o'></i>更新</a> `;
                    html += `<a href='javascript:void(0);' class='sync btn btn-default btn-xs'><i class='fa fa-wrench'></i>同步</a> `;
                    html += `<a href='javascript:void(0);' class='dataSourceRemove btn btn-default btn-xs' data-toggle="modal" data-target="#removeDataset"><i class='fa fa-trash-o'></i> 删除</a> `;
                    return html;
                },
                'defaultContent': '-'
            }
        ];
        tableConfig.order = [[4, 'desc']];

        // 获取列表内数据列
        tableConfig.data = data;
        // 生成列表
        createList(tableConfig);
        // 列表内查看事件绑定
        bindTableEvent('dataSourceList', 'click', 'a.dataSourceDetail', this.detailHandler);
        // 列表内编辑事件绑定
        bindTableEvent('dataSourceList', 'click', 'a.dataSourceEdit', this.editHandler);
        // 列表内删除事件绑定
        bindTableEvent('dataSourceList', 'click', 'a.dataSourceRemove', this.removeHandler);
        // 列表内同步事件绑定
        bindTableEvent('dataSourceList', 'click', 'a.sync', this.sync);
        // 列表内创建人tip绑定
        // bindTableEvent('dataSourceList', 'click', 'a.owner', this.clickOwnerHandler);
        // $('.owner').off('click').on('click', this.clickOwnerHandler);
    }

    /**
     * 创建人点击事件
     * @param e
     */
    clickOwnerHandler(e) {
        // 读取用户详细信息
        let userDetail = usermanageService.userDetail($(e.currentTarget).text());
        userDetail = userDetail.result.detail;
        let tooltips = createTip({
            parent: e.currentTarget,
            event: 'hover',
            content: `<dl><dt>用户名：</dt><dd>${userDetail.userName}</dd></dl>
            <dl><dt>姓名：</dt><dd>${userDetail.name}</dd></dl>
            </dl><dl><dt>部门：</dt><dd>${userDetail.department}</dd></dl>
            </dl><dl><dt>职位：</dt><dd>${userDetail.position}</dd></dl>
            </dl><dl><dt>电话：</dt><dd>${userDetail.phoneNo}</dd></dl>
            <dl><dt>邮箱：</dt><dd>${userDetail.email}</dd></dl>`
        });
        let api = tooltips.qtip('api');
        api.show();
    }

    // 数据源新建事件处理
    addHandler() {
        this.props.history.replace('/dataSourceConf/add');
    }

    // 数据源详情事件
    detailHandler(e) {
        let selectedRecord = $('#dataSourceList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.selectDataSource(selectedRecord);
        this.props.history.replace('/dataSourceConf/detail/' + selectedRecord.dataSourceName);
    }

    // 数据源更新事件
    editHandler(e) {
        let selectedRecord = $('#dataSourceList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.selectDataSource(selectedRecord);
        this.props.history.replace('/dataSourceConf/update/' + selectedRecord.dataSourceName);

    }
    // 数据源同步
    sync(e) {
        let selectedRecord = $('#dataSourceList').DataTable().row($(e.currentTarget).parents('tr')).data();
        let dataSouceName = {
            dataSourceName: selectedRecord.dataSourceName
        };
        this.refs.Refresh.RefreshShow();
        (async ()=>{
           await this.props.syncSchemaInfo(dataSouceName);
            if (this.props.dataSourceConf.syncSchemaInfo == '0') {

            }
            this.refs.Refresh.RefreshHide();
        })()
    }

    // 数据源删除
    removeHandler(e) {
        let selectedRecord = $('#dataSourceList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.selectDataSource(selectedRecord);
        this.refs.delDataSource.setContent('您确定要删除数据源：' + selectedRecord.dataSourceName + '吗？');
    }
    // 删除确认处理
    removeOKHandler() {

        let nameList = {
            dataSourceName: [this.props.dataSourceConf.selectedRecord.dataSourceName]
        };
        // this.props.deleteDataSource(nameList);
        $('#removeDataset').modal('hide');

        (async ()=>{
            await this.props.deleteDataSource(nameList);
            if (this.props.dataSourceConf.delDataSourceName == '0') {
                window.location.reload();
            }
        })();
    }
    render() {
        let thTpl = <tr>
            <th>数据源名称</th>
            <th>数据源模型</th>
            <th>用户</th>
            <th style={{width: '498px'}}>URL</th>
            <th>操作</th>
        </tr>;
        // 新建数据源
        let addBtnTpl = '';
        addBtnTpl = <button type="submit" name="createDataScource" className="btn btn-primary">新建</button>;
        return (
            <div id="datasetManage" className="box box-primary">
                <div className="row">
                    <div className="col-md-12">
                        <div className="box-header">
                            {addBtnTpl}
                        </div>
                        <div className="box-body">
                            <table id="dataSourceList" className="table table-striped table-bordered">
                                <thead>
                                {thTpl}
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
                <Refresh ref='Refresh'/>
                <Modal modalId="removeDataset" ref='delDataSource' title="删除数据源" okHandler={ this.removeOKHandler }/>
            </div>
        )
    }
}
