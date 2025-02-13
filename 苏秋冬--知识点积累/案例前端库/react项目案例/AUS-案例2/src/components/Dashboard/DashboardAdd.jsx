/**
 * 新建仪表板组件
 * User: gaogy
 * Date: 2017/1/4
 * Time: 13:50
 */
import React, { Component } from 'react';
import Modal from 'COMPONENT/Common/Modal/Modal';
import createiCheck from 'UTIL/baseiCheck';
import DateRangePicker from 'COMPONENT/Common/DateRangePicker/DateRangePicker';
import Tag from 'COMPONENT/Common/Tag/Tag';
import createList, { bindTableEvent } from 'UTIL/baseList';
import ChartReport from 'COMPONENT/Dashboard/ChartReport';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { cutStr } from 'UTIL/util';
import { baseValidate } from 'UTIL/baseValidate';
import quickLinkService from 'SERVICE/quickLinkService';
import { dateFormat } from 'UTIL/util';
import { warning } from 'UTIL/notification';
let ResponsiveReactGridLayout = WidthProvider(Responsive);
require('../../../node_modules/react-grid-layout/css/styles.css');
require('../../../node_modules/react-resizable/css/styles.css');

class AddDashboard extends Component {
    constructor(props) {
        super(props);
        this.saveHandler = this.saveHandler.bind(this);
        this.saveOKHandler = this.saveOKHandler.bind(this);
        this.loadModalControlHandler = this.loadModalControlHandler.bind(this);
        this.createTableHandler = this.createTableHandler.bind(this);
        this.addReportHandler = this.addReportHandler.bind(this);
        this.removeReportHandler = this.removeReportHandler.bind(this);
        this.onBreakpointChangeHandler = this.onBreakpointChangeHandler.bind(this);
        this.onResizeStopHandler = this.onResizeStopHandler.bind(this);
        this.onLayoutChangeHandler = this.onLayoutChangeHandler.bind(this);
        this.saveToQuickLinkHandler = this.saveToQuickLinkHandler.bind(this);
        this.validateHandler = this.validateHandler.bind(this);
        this.getStartTimeHandler = this.getStartTimeHandler.bind(this);
        this.getEndTimeHandler = this.getEndTimeHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }

    componentWillMount() {
        this.props.getReportList();
        this.props.clearReports();
    }

    componentDidUpdate() {
        this.createTableHandler(this.props.dashboard.reportList);
    }

    /**
     * 添加报表事件
     * @param e
     */
    addReportHandler(e) {
        let isRepeat = false;
        let table = $('#reportTable').DataTable();
        let reportName = table.row($(e.currentTarget)[0]._DT_RowIndex).data().reportName;
        let reports = this.props.dashboard.selectedReports;

        // 判断报表是否已经添加
        for (let i = 0;i < reports.length;i++) {
            if (reports[i].reportName === reportName) {
                isRepeat = true;
                break;
            }
        }

        // 不允许重复添加报表
        if (!isRepeat) {
            this.props.selectReport(reportName);
        } else {
            warning('报表：' + reportName + '已存在，请勿重复添加！');
        }
    }

    /**
     * 删除报表事件
     * @param e
     */
    removeReportHandler(e) {
        let reportName = $(e.currentTarget).attr('name');
        this.props.removeReport(reportName);
    }

    /**
     * 获取日期控件开始时间
     * @returns {*}
     */
    getStartTimeHandler() {
        return dateFormat(new Date(), 'yyyy-MM-dd 00:00:00');
    }

    /**
     * 获取日期控件截止时间
     * @returns {*}
     */
    getEndTimeHandler() {
        return dateFormat(new Date(), 'yyyy-MM-dd 23:59:59');
    }

    /**
     * 更新仪表板事件
     */
    searchHandler() {
        if ($('#filters').val()) {
            let tagObj = {
                id: new Date().getTime(),
                desc: $('#filters').val()
            };
            this.refs.filterTag.addTagDataHandler(tagObj);
            $('#filters').val('');
        }

        let tags = this.refs.filterTag.getTagsHandler();
        let filters = '';
        for (let i = 0; i < tags.length; i++) {
            if (i > 0) {
                filters = filters + ' AND ';
            }
            filters = filters + tags[i].desc;
        }

        // 构造查询参数对象
        let searchObj = {
            filters: filters,
            startTime: this.refs.daterangePicker.getStartTime(),
            endTime: this.refs.daterangePicker.getEndTime()
        };

        this.props.dashboard.selectedReports.map((item) => {
            this.refs['chartReport' + item.reportName].searchHandler(searchObj);
        });
    }

    /**
     * 列表渲染事件
     * @param data
     */
    createTableHandler(data) {
        // 构造列表配置项
        let tableConfig = {};

        tableConfig.id = 'reportTable';
        tableConfig.columns = [
            {data: 'reportName'},
            {data: 'desc'},
            {data: 'owner'},
            {data: 'createTime'}
        ];
        tableConfig.order = [[3, 'desc']];
        // 获取列表内数据列
        tableConfig.data = data;
        tableConfig.pageLength = 5;
        tableConfig.dom = '<"top"f>rt<"bottom"ip>';
        tableConfig.columnDefs = [
            {
                'targets': 0, // 操作列生成位置，当前为列表第三列
                'render': function (data, type, row) {
                    let reportName = row.reportName || '';
                    let html = `<span style="cursor: pointer;" title="${reportName}" > ${ cutStr(reportName, 20) }</span> `;
                    return html;
                }
            },
            {
                'targets': 1, // 操作列生成位置，当前为列表第三列
                'render': function (data, type, row) {
                    let desc = row.desc || '';
                    let html = `<span style="cursor: pointer;" title="${desc}" > ${ cutStr(desc, 40) }</span> `;
                    return html;
                }
            }];

        // 生成列表
        createList(tableConfig);

        // 列表内查看事件绑定
        bindTableEvent(tableConfig.id, 'click', 'tr', this.addReportHandler);
        $('#reportTable_filter').addClass('left');
    }

    /**
     * 报表保存事件
     */
    saveHandler() {
        let modalTpl = <div className="form-horizontal">
            <div className="form-group">
                <label htmlFor="dashboardName" className="col-sm-2 control-label"><span className="identify">* </span>名称</label>

                <div className="col-sm-7">
                    <input type="text" placeholder='名称只允许含有汉字、字母、数字、下划线' className="form-control" name="名称" maxLength={30} onBlur={this.validateHandler} id="dashboardName"/>
                </div>
                <div className="col-sm-2">
                    <div className="messages"></div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="isVisible" className="col-sm-2 control-label">可见性</label>

                <div className="col-sm-9 radio">
                    <label className="pl0">
                        <input name="isVisible" type="radio" value="PUBLIC" defaultChecked/>
                        &nbsp;共享
                    </label>
                    <label className="ml20">
                        <input name="isVisible" type="radio" value="PRIVATE"/>
                        &nbsp;私有
                    </label>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="isAddToNav" className="col-sm-2 control-label">添加至导航</label>
                <div className="col-sm-9 radio">
                    <input name="isAddToNav" type="checkbox" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="dashboardDesc" className="col-sm-2 control-label">描述</label>

                <div className="col-sm-9">
                    <textarea id="dashboardDesc" maxLength={120} className="form-control" style={{ resize: 'none' }}
                              rows="5"></textarea>
                </div>
            </div>
        </div>;
        this.refs.saveDashboard.setContent(modalTpl);
    }

    /**
     * 仪表板创建事件
     */
    saveOKHandler() {
        this.validateHandler();
        // 是否校验失败
        if ($('div.messages').find('p').length > 0) {
            return;
        }

        let dashboardOpt = {};
        // 仪表板名称
        dashboardOpt.dashboardName = $('#dashboardName', $('#saveDashboard')).val();

        // 可见性
        dashboardOpt.visable = $('input[name = "isVisible"]:checked', $('#saveDashboard')).val();
        // 仪表板描述
        dashboardOpt.desc = $('#dashboardDesc', $('#saveDashboard')).val();
        // 仪表板布局信息
        dashboardOpt.layoutInfo = JSON.stringify(this.props.dashboard.layouts);

        // 报表集合
        let reportList = [];
        let layout = this.props.dashboard.layout;
        for (let i = 0; i < layout.length; i++) {
            let layoutObj = {};
            layoutObj.reportName = layout[i].i;
            reportList.push(layoutObj);
        }
        dashboardOpt.reportList = reportList;
        // 新建仪表板
        this.props.addDashboard(dashboardOpt);
        debugger;
        // 判断是否保存到快速导航页
        if ($('input[name = "isAddToNav"]:checked', $('#saveDashboard')).length > 0) {
            (async () => {
                await this.saveToQuickLinkHandler(dashboardOpt.dashboardName);
                $('#saveDashboard').modal('hide');
            })();

        }
        
        // 隐藏弹窗
        $('#saveDashboard').modal('hide');
    }

    /**
     * 是否保存到快速导航
     * @param dashboardName
     */
    saveToQuickLinkHandler(dashboardName) {
        (async () => {
            let userInfo = await quickLinkService.getQuickLinkInfo();
            if (userInfo.quickLink.indexOf(dashboardName) === -1) {
                userInfo.quickLink = userInfo.quickLink + dashboardName + ';';
            }
            this.props.setQuickLinkInfo(userInfo);
        })();
    }
    
    /**
     * 加载弹窗内控件
     */
    loadModalControlHandler() {
        createiCheck('input[ type = "radio"]');
        createiCheck('input[ type = "checkbox"]');
    }

    /**
     * Grid列响应修改事件
     * @param breakpoint
     * @param cols
     */
    onBreakpointChangeHandler(breakpoint, cols) {
        this.props.changeBreakpoint(cols);
    }

    /**
     * panel重置后图表reflow
     * @param layout
     * @param oldItem
     * @param newItem
     * @param placeholder
     * @param e
     * @param element
     */
    onResizeStopHandler(layout, oldItem, newItem, placeholder, e, element) {
        let trendChartReportId = $(element).closest('div.reportBlock').find('div.chartReport').attr('id');
        if (trendChartReportId && $('#' + trendChartReportId).highcharts()) {
            $('#' + trendChartReportId).highcharts().reflow();
        }
    }

    /**
     * 布局改变事件
     * @param layout
     * @param layouts
     */
    onLayoutChangeHandler(layout, layouts) {
        this.props.changeLayout(layout, layouts);
    }

    /**
     * 校验事件
     */
    validateHandler() {
        let constraints = {
           '名称': {
                // 必填
                presence: {
                  message: '不可为空'
                },
               format: {
                   // 不可包含#
                   pattern: '^[a-zA-Z0-9_\u4e00-\u9fa5]+$',
                   message: '名称不合法'
               },
                // 长度限制
                length: {
                    minimum: 1,
                    maximum: 30,
                    message: '最大长度为30'
                }
            }
        };

        baseValidate($('#saveDashboard'), constraints);
    }

    render() {
        let cols = this.props.dashboard.breakpointCols;
        let colWidth = 3;
        if (cols < 6) {
            colWidth = 2;
        }
        let selectedReports = this.props.dashboard.selectedReports;
        let reportTplArray = [];

        reportTplArray = selectedReports.map((item, index) => {
            let reportTpl = '';
            let reportName = item.reportName;
            reportTpl = <div name={ reportName } key={reportName} data-grid={{w: colWidth, h: colWidth, x: (index % (cols / colWidth)) * colWidth, y: Math.floor(index / cols) * colWidth}} className='reportBlock mb20 pr0'>
                <div className="box box-primary mb0" style={{ height: '100%' }}>
                    <div className="box-header h40">
                        <div className="box-tools pull-right">
                            <i className="fa fa-close removeBtn" name={ reportName }
                               onClick={ this.removeReportHandler }></i>
                        </div>
                    </div>

                    <div className="box-body border-radius-none" style={{ height: '90%', marginTop: '-10px' }}>
                        <ChartReport getStartTime={this.getStartTimeHandler} getEndTime={this.getEndTimeHandler} ref={ 'chartReport' + reportName } reportName={ reportName } searchObj={ this.props.dashboard.searchObj } />
                    </div>
                </div>
            </div>;
            return reportTpl;
        });
        return (
            <div id="addDashboard">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">查询</h3>
                    </div>

                    <div className="box-body form-horizontal">
                        <div className="form-group">
                            <label htmlFor="filters" className="col-md-1 control-label">关键字</label>

                            <div className="col-md-5">
                                <input type="text" className="form-control" id="filters"/>
                            </div>

                            <div className="col-md-4">
                                <DateRangePicker ref="daterangePicker" />
                            </div>

                            <div className="col-md-2">
                                <button name="searchBtn" className="btn btn-primary" onClick={ this.searchHandler } ><i className="fa fa-search" ></i> 查询</button>
                                <button name="saveBtn" className="btn btn-primary ml10" data-toggle="modal" data-target="#saveDashboard" onClick={ this.saveHandler } ><i className="fa fa-save" ></i> 保存</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-1 control-label"></label>
                            <div className="col-md-11">
                                <Tag ref="filterTag" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">报表选择</h3>
                        <div className="pull-right box-tools">
                            <div className='mt5' data-widget="collapse" data-toggle="tooltip">
                                <i className="fa fa-minus collapseBtn"></i>
                            </div>
                        </div>
                    </div>

                    <div className="box-body">
                        <table id="reportTable" className="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th>报表名称</th>
                                <th>描述</th>
                                <th>创建人</th>
                                <th>创建时间</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>

                <div id='reportList' className='row connectedSortable pr15' style={{ position: 'relative' }}>
                    <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChangeHandler} ref='gridLayout' verticalCompact={true} onResizeStop={ this.onResizeStopHandler } className="layout" rowHeight={130} cols={{lg: 12, md: 9, sm: 6, xs: 4, xxs: 2}} onBreakpointChange={ this.onBreakpointChangeHandler }>
                        { reportTplArray }
                    </ResponsiveReactGridLayout>
                </div>
                <Modal modalId="saveDashboard" ref='saveDashboard' title="保存仪表板" okHandler={ this.saveOKHandler }
                       loadModalControlHandler={ this.loadModalControlHandler }/>
            </div>
        )
    }
}
export default AddDashboard;
