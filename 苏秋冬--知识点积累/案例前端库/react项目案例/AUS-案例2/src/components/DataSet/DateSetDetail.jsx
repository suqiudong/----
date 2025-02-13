/**
 * 数据集新建组件
 * User: gaogy
 * Date: 2016/1/12
 * Time: 17:10
 */
import React, { Component } from 'react';
import createList from 'UTIL/baseList';
import { cutStr } from 'UTIL/util';

class DateSetDetail extends Component {
    constructor(props) {
        super(props);
        this.updateDataSetHandler = this.updateDataSetHandler.bind(this);
        this.crateTableHandler = this.crateTableHandler.bind(this);
        this.fieldDetailHandler = this.fieldDetailHandler.bind(this);
    }

    componentWillMount() {
        debugger;
        this.props.getDataset(this.props.params.datasetName);
    }

    /**
     * 更新数据集事件
     */
    updateDataSetHandler() {
        this.props.history.replace('/dataSet/update/' + this.props.params.datasetName);
    }

    componentDidUpdate() {
        // 创建字段列表
        this.crateTableHandler();
        // 控制分区信息显示
        if (this.props.dataset.selectedRecord.isPartition == false) {
            $('div[name = "partitionArea"]').hide();
        } else {
            $('div[name = "partitionArea"]').show();
        }
    }

    crateTableHandler() {
        // 构造列表配置项
        let tableConfig = {};

        tableConfig.id = 'schema';
        tableConfig.columns = [
            {
                className: 'textCenter',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            { data: 'fieldName',
                render: function (data, type, row) {
                    if (data) {
                        if (data.indexOf('<input') != -1) {
                            return data;
                        } else {
                            return cutStr(data, 15)
                        }
                    } else {
                        return data
                    }
                },
                orderable: false },
            { data: 'name',
                render: function (data, type, row) {
                    if (data) {
                        if (data.indexOf('<input') != -1) {
                            return data;
                        } else {
                            return cutStr(data, 15)
                        }
                    } else {
                        return data
                    }

                },
                orderable: false },
            { data: 'type', orderable: false },
            { data: 'store',
                render: function (data, type, row, meta) {
                    if (data == 'false') {
                        return '否';
                    } else if (data == 'true') {
                        return '是';
                    }
                },
                orderable: false, defaultContent: '-' },
            { data: 'index',
                render: function (data, type, row, meta) {
                    if (data == 'not_analyzed' || data == 'analyzed') {
                        return '是';
                    } else if (data == 'no') {
                        return '否';
                    }
                },
                orderable: false, defaultContent: '-' },
            { data: 'analyzer', orderable: false, defaultContent: '-' },
            { data: 'key',
                render: function (data, type, row, meta) {
                    if (data == 'false') {
                        return '否';
                    } else if (data == 'true') {
                        return '是';
                    }
                },
                orderable: false, defaultContent: '-' }
        ];
        tableConfig.dom = '<"top">rt<"bottom"i>';
        tableConfig.scrollX = true;
        tableConfig.paging = false;
        tableConfig.createdRow = function(row, data, index) {
            let detailTpl = "<i class='fa fa-circle-thin mt10'></i>";
            if (data.type === 'nested') {
                detailTpl = "<span class='row-details row-details-close mt10'></span>";
            }
            if (data.fieldName.indexOf('<input') == -1) {
                $('td:eq(1)', row).attr('title', data.fieldName)
            }
            if (data.name.indexOf('<input') == -1) {
                $('td:eq(2)', row).attr('title', data.name);
            }
            $('td:eq(0)', row).html(detailTpl);
        };

        // 获取列表内数据列
        tableConfig.data = this.props.dataset.selectedRecord.schema.properties;

        // 生成列表
        createList(tableConfig);

        // 展开详细事件绑定
        $('#schema').on('click', 'tbody td .row-details', this.fieldDetailHandler);
    }

    /**
     * 字段详细事件
     * @param e
     */
    fieldDetailHandler(e) {
        let table = $('#schema').DataTable();
        let tr = $(e.currentTarget).parents('tr');
        let row = table.row(tr);
        if (row.child.isShown()) {
            $(e.currentTarget).addClass('row-details-close').removeClass('row-details-open');
            row.child.hide();
        } else {
            $(e.currentTarget).addClass('row-details-open').removeClass('row-details-close');

            // 子行列表存在时不需重新创建
            if (row.child()) {
                row.child.show();
                return;
            }

            // 插入嵌套列表
            row.child(`<div id="nestRow_${row.index()}">
                           <table id="nestTable_${row.index()}"  class="table table-bordered" width="100%">
                           <thead>
                               <tr>
                                   <th>子字段名</th>
                                   <th>子字段描述</th>
                                   <th>子字段类型</th>
                                   <th>存储</th>
                                   <th>索引</th>
                                   <th>分词</th>
                                   <th>主键</th>
                               </tr>
                           </thead>
                        </table></div>`).show();

            // 嵌套列表配置项
            let nestedTableConfig = {};
            nestedTableConfig.id = 'nestTable_' + row.index();
            nestedTableConfig.columns = [
                { data: 'fieldName',
                    render: function (data, type, row) {
                        if (data) {
                            if (data.indexOf('<input') != -1) {
                                return data;
                            } else {
                                return cutStr(data, 15)
                            }
                        } else {
                            return data
                        }

                    },
                    orderable: false },
                { data: 'name',
                    render: function (data, type, row) {
                        if (data) {
                            if (data.indexOf('<input') != -1) {
                                return data;
                            } else {
                                return cutStr(data, 15)
                            }
                        } else {
                            return data
                        }

                    },
                    orderable: false },
                { data: 'type', orderable: false },
                { data: 'store',
                    render: function (data, type, row, meta) {
                        if (data == 'false') {
                            return '否';
                        } else if (data == 'true') {
                            return '是';
                        }
                    },
                    orderable: false, defaultContent: '-' },
                { data: 'index',
                    render: function (data, type, row, meta) {
                        if (data == 'not_analyzed' || data == 'analyzed') {
                            return '是';
                        } else if (data == 'no') {
                            return '否';
                        }
                    },
                    orderable: false, defaultContent: '-' },
                { data: 'analyzer', orderable: false, defaultContent: '-' },
                { data: 'key',
                    render: function (data, type, row, meta) {
                        if (data == 'false') {
                            return '否';
                        } else if (data == 'true') {
                            return '是';
                        }
                    },
                    orderable: false, defaultContent: '-' }
            ];
            nestedTableConfig.paging = false;
            nestedTableConfig.dom = '<"top">rt<"bottom"i>';
            nestedTableConfig.scrollX = true;
            nestedTableConfig.createdRow = function (row, data, index) {
                if (data.fieldName.indexOf('<input') == -1) {
                    $('td:eq(0)', row).attr('title', data.fieldName)
                }
                if (data.name.indexOf('<input') == -1) {
                    $('td:eq(1)', row).attr('title', data.name);
                }
            };

            // 获取列表内数据列
            nestedTableConfig.data = row.data().schema;
            // 生成嵌套列表
            createList(nestedTableConfig);
        }
    }

    render() {
        let partitionRule = '';
        let isPartition = '是';
        let visable = '共享';
        if (this.props.dataset.selectedRecord.isPartition == false) {
            isPartition = '否';
        }
        if (this.props.dataset.selectedRecord.visable == 'PRIVATE') {
            visable = '私有';
        }
        // 判断是否存在数据集修改权限
        let modifyBtnTpl = '';
        let XDataUserName = sessionStorage.getItem('XDataUserName');
        if (this.props.dataset.selectedRecord.owner == XDataUserName && sessionStorage.getItem('userRolePermission').indexOf('DATASET_MODIFY') != -1) {
            modifyBtnTpl = <button type="button" className="ensure btn btn-primary sp_btn datasetModify" onClick={ this.updateDataSetHandler }>修改</button>;
        }
        if (this.props.dataset.selectedRecord.partitionRule) {
            partitionRule = this.props.dataset.selectedRecord.partitionRule;
        }
        if (partitionRule.indexOf('d') != -1) {
            partitionRule = partitionRule.substring(0, partitionRule.length - 1) + ' 天'
        } else if (partitionRule.indexOf('w') != -1) {
            partitionRule = partitionRule.substring(0, partitionRule.length - 1) + ' 周'
        } else if (partitionRule.indexOf('M') != -1) {
            partitionRule = partitionRule.substring(0, partitionRule.length - 1) + ' 月'
        } else if (partitionRule.indexOf('y') != -1) {
            partitionRule = partitionRule.substring(0, partitionRule.length - 1) + ' 年'
        }
        return (
            <div id="datasetAdd">
                <div className="box box-primary">
                    <div className="box-header with-border ">
                        <p className="box-title">基本信息</p>
                    </div>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label htmlFor="datasetName" >名称 : </label>
                                <span className="detailSpan ml10">{ this.props.dataset.selectedRecord.datasetName }</span>
                            </div>
                            <div name='isPartition' className="form-group col-md-3">
                                <label htmlFor="isPartition">是否分区 : </label>
                                <span className="detailSpan ml10">{ isPartition }</span>
                            </div>

                            <div name='isVisible' className="form-group col-md-3">
                                <label htmlFor="isVisible">可见性 : </label>
                                <span className="detailSpan ml10">{ visable }</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>分片数 : </label>
                                <span className="detailSpan ml10">{this.props.dataset.selectedRecord.shard}</span>
                            </div>

                            <div className="col-md-6 form-group">
                                <label>副本数 : </label>
                                <span className="detailSpan ml10">{this.props.dataset.selectedRecord.replication}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box box-primary">
                    <div className="box-header with-border ">
                        <p className="box-title" >字段</p>
                    </div>
                    <div className="row box-body">
                        <div className="col-md-12">
                            <div className="box-header pull-left">
                            </div>
                            <div className="box-body">
                                <table id="schema" className="table table-striped table-bordered" style={{ width: '100%' }}>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>字段名</th>
                                        <th>字段描述</th>
                                        <th>字段类型</th>
                                        <th>存储</th>
                                        <th>索引</th>
                                        <th>分词</th>
                                        <th>主键</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div name="partitionArea" className="box box-primary">
                    <div className="box-header with-border">
                        <p className="box-title">分区信息</p>
                    </div>
                    <div className="partition box-body">
                        <div className="partitionDetails row">
                            <div className="form-group col-md-6">
                                <label htmlFor="partitionField">分区字段：</label>
                                <span className="detailSpan ml10"> { this.props.dataset.selectedRecord.partitionField } </span>
                            </div>

                            <div className="form-group col-md-6">
                                <label htmlFor="partitionRule">分区规则：</label>
                                <span className="detailSpan ml10"> { partitionRule } </span>
                            </div>
                        </div>
                    </div>
                </div>
                {modifyBtnTpl}
            </div>
        )
    }
}
export default DateSetDetail;
