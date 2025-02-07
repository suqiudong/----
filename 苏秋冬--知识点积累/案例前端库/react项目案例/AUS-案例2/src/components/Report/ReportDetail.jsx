/**
 * 报表详细组件
 * User: gaogy
 * Date: 2016/12/27
 * Time: 20:10
 */
import React, { Component } from 'react';
import DateRangePicker from 'COMPONENT/Common/DateRangePicker/DateRangePicker';
import ReportConf from 'COMPONENT/Report/ReportConf/ReportConf';
import DisplayArea from 'COMPONENT/Report/ReportDisplay/DisplayArea';
import { warning } from 'UTIL/notification';

class ReportDetail extends Component {
    constructor(props) {
        super(props);
        this.reportUpdateHandler = this.reportUpdateHandler.bind(this);
        this.destroyChartHandler = this.destroyChartHandler.bind(this);
        this.getStartTimeHandler = this.getStartTimeHandler.bind(this);
        this.getEndTimeHandler = this.getEndTimeHandler.bind(this);
    }

    componentWillMount() {
        this.props.getReport(this.props.params.reportName);
    }

    reportUpdateHandler() {
        this.mqlSearchHandler();
        // 返回列表页面
        this.props.history.replace('/report/update/' + this.props.params.reportName);
    }

    componentDidMount() {
        $('button', $('#chartType')).addClass('disabled');
        $('.chartTypeDisabled').removeClass('hide');
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.report.selectedRecord.mql && nextProps.report.selectedRecord.mql) {
            this.props.mqlSearch({
                mql: nextProps.report.selectedRecord.mql,
                startTime: this.refs.daterangePicker.getStartTime(),
                endTime: this.refs.daterangePicker.getEndTime()
            });
        }
    }

    componentDidUpdate() {
        // 按钮样式切换，获取当前展示类型
        $('button', $('#chartType')).removeClass('active');
        let chartType = this.props.report.selectedRecord.chartType;
        if (chartType === 'area' || chartType === 'column') {
            chartType = 'line';
        }
        $('button[ name = "' + chartType + '" ]', $('#chartType')).addClass('active');
    }

    destroyChartHandler() {
        this.refs.displayArea.getWrappedInstance().destroyChartHandler();
    }

    /**
     * 获取开始时间
     * @returns {*|string|*}
     */
    getStartTimeHandler() {
        return this.refs.daterangePicker.getStartTime();
    }

    /**
     * 获取截止时间
     * @returns {*|string|*}
     */
    getEndTimeHandler() {
        return this.refs.daterangePicker.getEndTime();
    }

    /**
     * MQL查询事件
     */
    mqlSearchHandler() {
        // MQL语句非空校验
        if (!$(this.refs.mqlTextarea).val()) {
            warning('请输入MQL语句');
            return;
        }

        // 构造查询参数对象
        let mqlSearchObj = {
            mql: $(this.refs.mqlTextarea).val(),
            filters: '',
            startTime: this.refs.daterangePicker.getStartTime(),
            endTime: this.refs.daterangePicker.getEndTime()
        };

        // 显示可视化配置和可视化分析区域
        $('#reportConf').removeClass('hide');
        $('#reportAnalyze').removeClass('hide');

        // 进行MQL查询，渲染结果列表
        this.props.mqlSearch(mqlSearchObj);
        $('button[ name = "saveBtn" ]').removeClass('hide');
    }

    render() {
        let { selectedRecord } = this.props.report;
        // 判断是否存在数据集修改权限
        let modifyBtnTpl = '';
        let userName = sessionStorage.getItem('XDataUserName');
        if (sessionStorage.getItem('userRolePermission').indexOf('REPORT_MODIFY') != -1 && this.props.report.selectedRecord.owner === userName) {
            modifyBtnTpl = <button name="updateBtn" className="btn btn-primary" onClick={ this.reportUpdateHandler } ><i className="fa fa-edit" ></i> 修改</button>;
        }

        return (
            <div id="addReport">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">MQL查询</h3>
                    </div>

                    <div className="box-body">
                        <div className="form-group">
                            <div className="row" >
                                <div className="col-md-7 col-xs-4">
                                    <textarea className="form-control" disabled ref="mqlTextarea" value={ selectedRecord.mql } style={{ resize: 'none' }} rows="4"></textarea>
                                </div>
                                <div className="col-md-3 col-xs-4">
                                    <DateRangePicker disabled="true" ref="daterangePicker" />
                                </div>
                                <div className="col-md-2 col-xs-4">
                                    {modifyBtnTpl}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="reportConf" className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">报表配置</h3>
                    </div>

                    <div className="box-body">
                        <ReportConf ref="reportConf" mqlSearchHandler={ this.mqlSearchHandler } destroyChartHandler={ this.destroyChartHandler } operation="reportDetail" selectedRecord={ selectedRecord } />
                    </div>
                </div>

                <div id="reportAnalyze" className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">报表可视化</h3>
                    </div>

                    <div className="box-body">
                        <DisplayArea ref="displayArea" operation="reportDetail" getStartTime={this.getStartTimeHandler} getEndTime={this.getEndTimeHandler} />
                    </div>
                </div>
            </div>
        )
    }
}
export default ReportDetail;
