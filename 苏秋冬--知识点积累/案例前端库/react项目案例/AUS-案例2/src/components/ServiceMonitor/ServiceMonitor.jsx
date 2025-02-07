/**
 *角色列表组件
 * User: jiaomx
 * Date: 2017/5/23
 * Time: 14:40
 */

import React, { Component } from 'react';
import DateRangePicker from 'COMPONENT/Common/DateRangePicker/DateRangePicker';
// import createSelect, { bindSelectEvent } from 'UTIL/baseSelect2';
import createSelect from 'UTIL/baseSelect2';
// import { unitTransform } from 'UTIL/util';
import createList from 'UTIL/baseList';

class ServiceMonitor extends Component {
    constructor(props) {
        super(props);
        this.createTable = this.createTable.bind(this);
        this.search = this.search.bind(this);
        this.createSelect = this.createSelect.bind(this);
    }

    componentWillMount() {
        // this.props.getServiceName();
    }

    componentDidMount() {
        //
        this.createSelect();
    }

    componentDidUpdate() {
        // let obj = [];
        // let serviceName = this.props.serviceMonitor.serviceName;
        // for (let i = 0; i < serviceName.length; i++) {
        //     obj.push({
        //         id: serviceName[i].value,
        //         text: serviceName[i].name
        //     });
        // }
        // this.createSelect(obj);
        // 处理表格
        let list = this.props.serviceMonitor.serviceList;
        let serviceList = [];
        /*
            * 单条数据时返回的是Detail
            * 多条时数据返回的是Data
            * 请求失败则默认空数组
        */
        if (list.data != undefined) {
            serviceList = list.data;
        }else {
            if (list.detail != undefined) {
                serviceList.push(list.detail);
            }
        }
        let tableContent = $('#tableContent');
        if (serviceList.length > 0) {
            this.createTable(serviceList);
            tableContent.removeClass('hide');
            return;
        }
        tableContent.addClass('hide');
    }

    // select2 下拉框
    createSelect() {
        let selectConfig = {
            id: 'selectServer',
            tags: false,
            placeholder: '请选择服务名称',
            minimumResultsForSearch: 2
        };
        createSelect(selectConfig);
        // bindSelectEvent('selectServer', 'select2:select', this.changeHandler);
        this.search();
    }

    createTable(data) {
        // 构造列表配置项
      let startTime = this.refs.daterangePicker.getStartTime();
      let endTime = this.refs.daterangePicker.getEndTime();
        let tableConfig = {
            id: 'serviceMonitorList',
            columns: [
                {data: 'appName', 'defaultContent': '-'},
                {data: 'startTime', 'defaultContent': '-', render: function (data) {
                    return startTime;
                }},
                {data: 'endTime', 'defaultContent': '-', render: function (data) {
                    return endTime;
                }},
                {data: 'frequency', 'defaultContent': '-'},
                {data: 'monitorStatus', 'defaultContent': '-'}
                // {data: 'count', 'defaultContent': '-'},
                // {
                //     data: 'monitorStatus',
                //     render: function (data, type, row, meta) {
                //         if (data == 'ONLINIE') {
                //             return '上线';
                //         } else {
                //             return '下线';
                //         }
                //     },
                //     'defaultContent': '-'
                // },
                // {
                //     data: 'size',
                //     render: function (data, type, row, meta) {
                //         return unitTransform(data);
                //     },
                //     'defaultContent': '-'
                // }
            ],
            data: data
        };
        // 生成列表
        createList(tableConfig);
    }

    search() {
        let data = {
            appName: $('#selectServer').val(),
            startTime: this.refs.daterangePicker.getStartTime(),
            endTime: this.refs.daterangePicker.getEndTime()
        };
        this.props.getServiceMonitorList(data);
    }

    render() {
        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <div className="box-title">服务监控</div>
                    </div>
                    <div className="box-body">
                        <div className="col-md-12">
                            <div className="row" style={{ marginBottom: '10px' }}>
                                <div className="form-group">
                                    {/* <label className="hide"><small>服务：</small></label> */}
                                    <div className="col-md-5 hide">
                                        <select className="form-control select2me" id="selectServer">
                                            <option value="search">查询服务</option>
                                            {/* <option value="log">日志服务</option> */}
                                        </select>
                                    </div>
                                    <div className="col-md-11">
                                        <DateRangePicker ref="daterangePicker" />
                                    </div>
                                    <div className="col-md-1">
                                        <button name="searchBtn" className="btn btn-primary" onClick={this.search}><i className= "fa fa-search"></i> 查询</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12" id="tableContent">
                            <label className="pull-left"><small>组件信息:</small></label>
                            <div className="table-scrollable">
                                <table className="table table-striped table-hover" id="serviceMonitorList">
                                    <thead>
                                    <tr>
                                        <th>
                                            名称
                                        </th>
                                        <th>
                                            开始时间
                                        </th>
                                        <th>
                                            结束时间
                                        </th>
                                        <th>
                                            访问频度
                                        </th>
                                        <th>
                                            状态
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ServiceMonitor;

