/**
 *角色列表组件
 * User: jiaomx
 * Date: 2017/5/23
 * Time: 14:40
 */

import React, { Component } from 'react';
// import { unitTransform } from 'UTIL/util';
import {encodeSMS4} from 'UTIL/sm4';
import createList from 'UTIL/baseList';
import { error } from 'UTIL/notification';
import Sql from './../Common/Sql/sql';
let oTable = null;
class DataView extends Component {
    constructor(props) {
        super(props);
        this.createTable = this.createTable.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.getListHandler = this.getListHandler.bind(this);
    }

    componentWillMount() {
        //
    }

    componentDidUpdate() {
        if (this.props.dataView.toggle) {
            $('#collapseOne').fadeIn();
        } else {
            $('#collapseOne').fadeOut();
        }
        let data = this.props.dataView.planResult;
        $('table thead th').removeAttr('style');
        $('table tbody').remove();
        if (data.length == 0) {
            if (oTable) $('#dataViewList').DataTable().destroy();
            oTable = null;
            return;
        }
        let keys = [];
        for (let i in data[0]) {
            keys.push(i);
        }
        this.createTable(data, keys);
    }

    componentWillUnmount() {
        oTable = null;
        this.props.clearSqlResult();
        this.props.clearPlanResult();
    }

    searchHandler () {
        let SQLWords = $('#SQLWords').val();
        if ($.trim(SQLWords)) {
            let tagObj = {
                sql: encodeSMS4(SQLWords, '2C023A86BD32812A4C180A7152EEBF0A').join(',')
            };
            this.props.getSqlResult(tagObj);
            return;
        }
        error('SQL语句不能为空！');
    }

    getListHandler () {

        let [SQLWords, limit] = [$('#SQLWords').val(), $('#limit').val()];
        if (!$.trim(SQLWords)) {
            error('SQL语句不能为空！');
            return;
        }
        if (!$.trim(limit)) {
            error('限制数不能为空且只能是数字！');
            return;
        }

        let obj = {
            sql: encodeSMS4(SQLWords, '2C023A86BD32812A4C180A7152EEBF0A').join(','),
            limit: Number(limit)
        };
        this.props.getPlanResult(obj);
    }

    createTable(data, keys) {
        // 构造列表配置项
        let tableConfig = {};
        let columns = [];
        for (let i = 0; i < keys.length; i++) {
            columns.push({
                data: keys[i],
                render: function (data, type, row, meta) {
                    if (data instanceof Array) {
                        data = data.toString();
                    }
                    return data.replace(/ /g, '&nbsp;');
                },
                'defaultContent': '-'
            });
        }
        tableConfig.id = 'dataViewList';
        tableConfig.columns = columns;
        tableConfig.scrollX = true;
        // 获取列表内数据列
        tableConfig.data = data;
        // 生成列表
        oTable = createList(tableConfig);
    }

    toggle() {
        this.props.setToggle(!this.props.dataView.toggle);
        if (!this.props.dataView.toggle) {
            $('#collapseOne').fadeIn();
        } else {
            $('#collapseOne').fadeOut();
        }

    }

    render() {

        let toggle = this.props.dataView.toggle;
        let result = this.props.dataView.planResult;
        let list = [];
        if (result.length) {
            for (let i in result[0]) {
                list.push(i);
            }
        }

        return (

            <div>
                <div className="box box-primary">
                    <Sql SQLID="SQLWords"></Sql>
                    <div className="box-header">
                        <div className="col-md-12">
                            <label>输入SQL语句：</label>
                            <textarea className="form-control inputBox" id="SQLWords" rows="3" placeholder="请输入SQL语句"></textarea>
                            <div className="panel-body">
                                <div className="row">
                                    <button type="button" className="btn btn-primary" onClick={this.searchHandler}>执行计划查询</button>
                                    <button name="searchBtn" className="btn btn-primary" style={{marginLeft: '10px'}} data-toggle="modal" data-target="#SQL"><i className="fa"></i>自助查询</button>
                                </div>
                            </div>
                            <div className={this.props.dataView.mqlResult.trim() == '' ? 'hide' : ''}>
                                <div className="box-header text-right">
                                    <h4 className="box-title">
                                        <a onClick={this.toggle.bind(this)}>
                                            {toggle ? '收起' : '展开'}
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapseOne">
                                    <div className="box-body">
                                        <pre>{ this.props.dataView.mqlResult.replace('\n', '<br/>') }</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="col-md-3">
                            <label>查询条数： </label>
                            <input type="number" className="form-control" min="0" id="limit" defaultValue={50} placeholder="请输入限制数" />
                        </div>
                        <div className="col-md-12">
                            <div className="panel-body pull-left">
                                <div className="row">
                                    <button type="button" className="btn btn-primary pull-left" onClick={this.getListHandler}>查询数据</button>
                                </div>
                            </div>
                            <div className="table-scrollable">
                                <table className="table table-striped table-bordered" id="dataViewList">
                                    <thead>
                                    <tr>
                                        {
                                            list.map((item) => {
                                                return (
                                                    <th>{item}</th>
                                                )
                                            })
                                        }
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
export default DataView;

