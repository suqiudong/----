/**
 * 快速导航
 * User: gaogy
 * Date: 2017/1/9
 * Time: 13:58
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
@connect(
    ({ quickLink, router }) => ({quickLink, router}),
    require('ACTION/quickLink').default,
    null,
    { withRef: true }
)

class QuickLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: 0,
            dataSourceTable: 0,
            num: 0
        }
    }
    componentWillMount() {
        // this.props.getUserInfo();
        // 生成饼状图
        let typeName = [];
        (async ()=> {
            await this.props.getDataSoucerInfo();
            if (this.props.quickLink.DataSoucerInfo) {
                let dataSource = this.props.quickLink.DataSoucerInfo;
                this.setState({
                    dataSource: dataSource.dataSourceNum,
                    dataSourceTable: dataSource.tableNum,
                    num: dataSource.data.length,
                    pie: typeName
                });
                dataSource.data.map(function(val) {
                    let num = Math.floor((val.dataSourceTypeNum / dataSource.data.length) * 100);

                    let data = [val.dataSourceType, num];
                    typeName.push(data);
                });
                let chart = Highcharts.chart('chrat', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: '#ecf0f5'
                    },
                    title: {
                        text: '可访问数据类型分布'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '数据源分布占比',
                        data: typeName
                    }]
                });
                return chart;
            }
        })();
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <div id="quickNav">
                <div className="no-print">
                    <div className="callout callout-info bg-green">
                        <h4><i className="fa fa-info"></i> 提示：</h4>
                        首页分别展示了可访问的数据源，数据表数据模型个数以及数据源分布情况！
                    </div>
                </div>
                <div className="row">
                    {/* 数据源数*/}
                    <div className="col-lg-4 col-xs-6">
                        <div className="small-box bg-aqua">
                            <div className="inner">
                                <h3>{this.state.dataSource}</h3>
                                <p>可访问的数据数</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-reorder"></i>
                            </div>
                            <a href="#" className="small-box-footer"></a>
                        </div>
                    </div>
                    {/* 数据源表数*/}
                    <div className="col-lg-4 col-xs-6">
                        <div className="small-box bg-green">
                            <div className="inner">
                                <h3>{this.state.dataSourceTable}</h3>
                                <p>可访问的数据表数</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-table"></i>
                            </div>
                            <a href="#" className="small-box-footer"></a>
                        </div>
                    </div>
                    {/* 数据源数*/}
                    <div className="col-lg-4 col-xs-6">
                        <div className="small-box bg-yellow">
                            <div className="inner">
                                <h3>{this.state.num}</h3>
                                <p>可访问的数据模型数</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-th-large"></i>
                            </div>
                            <a href="#" className="small-box-footer"></a>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='pie' id='chrat'></div>
                </div>
            </div>
        )
    }
}
export default QuickLink;
