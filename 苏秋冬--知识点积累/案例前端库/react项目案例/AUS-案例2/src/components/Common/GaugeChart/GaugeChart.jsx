/**
 * 仪表图组件
 * User: jiaomx
 * Date: 2017/1/6
 * Time: 16:14
 */
import React, { Component } from 'react';
var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

// 定义漏斗图对象
let gaugeChart;
class GaugeChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: this.props.chartOptions
        };
        this.loadGaugeChartHandler = this.loadGaugeChartHandler.bind(this);
        this.getChartOptionsHandler = this.getChartOptionsHandler.bind(this);
        this.setChartOptionsHandler = this.setChartOptionsHandler.bind(this);
        this.destroyChartHandler = this.destroyChartHandler.bind(this);
    }

    componentDidMount() {
        if (this.state.chartOptions) {
            this.loadGaugeChartHandler(this.state.chartOptions);
        }
    }

    componentDidUpdate() {
        if (this.state.chartOptions) {
            this.loadGaugeChartHandler(this.state.chartOptions);
        }
    }

     /**
     * 设置图表配置
     * @param options
     */
    setChartOptionsHandler(options) {
        this.destroyChartHandler();
        this.setState({
            chartOptions: options
        });
    }

    /**
     * 清除图表
     */
    destroyChartHandler() {
        let chartId = this.props.chartId || 'gaugeChart';
        if (gaugeChart && gaugeChart.options.chart.id === chartId) {
            gaugeChart.destroy();
            gaugeChart = '';
            $('#' + chartId).html(`<div class="noResultInfo"><i class='fa fa-exclamation-triangle'></i><span>请先添加图表配置</span></div>`);
        }
    }


      /**
     * 获取图表配置操作
     * @returns {{}}
     */
    getChartOptionsHandler() {
          let options = {};
          if (gaugeChart) {
              options.title = gaugeChart.options.title.text;
              options.series = gaugeChart.options.series;
              options.chartType = 'gauge';
              options.isNumDis = gaugeChart.options.chart.isNumDis;
              options.islegendDis = gaugeChart.options.legend.enabled;
              options.min = gaugeChart.options.yAxis[0].min;
              options.max = gaugeChart.options.yAxis[0].max;
              options.value = gaugeChart.options.series[0].data;
          }
          return options;
    }

    /**
     * 绘制图表
     * @returns {*}
     */
    loadGaugeChartHandler(options) {
        let chartId = this.props.chartId || 'gaugeChart';
        if (options.series) {
            gaugeChart = Highcharts.chart(chartId, {
                lang: {
                    contextButtonTitle: '图表导出菜单',
                    decimalPoint: '.',
                    downloadJPEG: '下载JPEG图片',
                    downloadPDF: '下载PDF文件',
                    downloadPNG: '下载PNG文件',
                    downloadSVG: '下载SVG文件',
                    drillUpText: '返回 {series.name}',
                    loading: '加载中',
                    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    noData: '没有数据',
                    numericSymbols: [ '千', '兆', 'G', 'T', 'P', 'E'],
                    printChart: '打印图表',
                    resetZoom: '恢复缩放',
                    resetZoomTitle: '恢复图表',
                    shortMonths: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    thousandsSep: ',',
                    weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
                },
                chart: {
                    id: chartId,
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    isNumDis: options.isNumDis,
                    plotShadow: false
                },
                title: {
                    x: 0,
                    text: options.title || ''
                },
                credits: {
                    enabled: false // 禁用版权信息
                },

                // 仪表盘上的配置项(起始角度, 背景等)
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // 数据配置项
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: options.isNumDis || false,
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        showInLegend: options.islegendDis || false
                    }
                },

                // 仪表盘刻度配置
                yAxis: {
                    min: options.min,
                    max: options.max,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 3,
                        rotation: 'auto',
                        formatter: function() { // 设置纵坐标值的样式
                            return (this.value / Number('1' + '0'.repeat(this.value.toString().length - 1))).toFixed(1) + 'e+' + (this.value.toString().length - 1)
                            // return this.value * Math.pow(10, Math.floor(Math.log(this.value) / Math.LN10))
                        }
                    },
                    plotBands: [{
                        from: options.min,
                        to: options.min + (options.max - options.min) * 0.6000,
                        color: '#55BF3B' // green
                    }, {
                        from: options.min + (options.max - options.min) * 0.6000,
                        to: options.min + (options.max - options.min) * 0.8000,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: options.min + (options.max - options.min) * 0.8000,
                        to: options.max,
                        color: '#DF5353' // red
                    }]
                },

                legend: {
                    enabled: options.islegendDis || false
                },
                series: [{
                    name: options.series[0].name || '',
                    data: [options.value]
                }]
            });
            return gaugeChart;
        }
    }

    render() {
        let chartId = this.props.chartId || 'gaugeChart';
        return (
            <div id={chartId} className={ this.props.className } style={{ maxWidth: '99%', height: '100%' }}>
                <div className="noResultInfo"><i className='fa fa-exclamation-triangle'></i><span>请先添加图表配置</span></div>
            </div>
        )
    }
}
export default GaugeChart;
