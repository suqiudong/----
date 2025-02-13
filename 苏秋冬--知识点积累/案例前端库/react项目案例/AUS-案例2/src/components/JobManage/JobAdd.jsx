/**
 *作业添加组件
 * User: jiaomx
 * Date: 2017/02/124
 * Time: 15:44
 */
import React, { Component } from 'react';
import DateRangePicker from 'COMPONENT/Common/DateRangePicker/DateRangePicker';
import moment from 'moment';
import createSelect2, { bindSelectEvent } from 'UTIL/baseSelect2';
import { baseValidate, showErrorMessage} from 'UTIL/baseValidate';
import base from 'UTIL/base64';
class JobAdd extends Component {
	constructor(props) {
        super(props);
        this.radioChecked = this.radioChecked.bind(this);
        this.filterSelect = this.filterSelect.bind(this);
        this.loadControlHandler = this.loadControlHandler.bind(this);
        this.createConfigInfor = this.createConfigInfor.bind(this);
        this.saveAndOnlineHandler = this.saveAndOnlineHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.returnHandler = this.returnHandler.bind(this);
        this.validation = this.validation.bind(this);
        this.state = {
            radio: 'CYCLE'
        }
    }

    componentWillMount() {
        // 读取插件列表数据
        this.props.readPluginList();
        let config = [];
        this.props.configs(config);
    }
    componentDidUpdate() {
        if (this.props.jobManage.config.length == 0) {
            this.refs.save.disabled = true;
            this.refs.online.disabled = true;
        } else {
            this.refs.save.disabled = false;
            this.refs.online.disabled = false;
        }
    }
    componentDidMount() {
        this.loadControlHandler();

    }

    // 设置周期radio选择
    radioChecked() {
        let ischecked = $("input[name='radio']:checked").val();
        this.setState({
            radio: ischecked
        })
    }

    // 加载页面select
    loadControlHandler() {
        let pluginNameObj = {};
        let pluginNameArr = [];
        let pluginList = this.props.jobManage.pluginList.result.data
        pluginNameObj.id = 'pluginName';
        for (let i = 0; i < pluginList.length; i++) {
            pluginNameArr.push(pluginList[i].pluginName);
        }
        pluginNameObj.data = pluginNameArr;
        pluginNameObj.minimumResultsForSearch = 2;
        createSelect2(pluginNameObj);
        bindSelectEvent(pluginNameObj.id, 'select2:select', this.filterSelect);
        let misfireStrategyObj = {};
        misfireStrategyObj.id = 'misfireStrategy';
        createSelect2(misfireStrategyObj);
    }

    // 过滤插件对应的选择器
    filterSelect() {
        $('#datasets').html('');
        let config = [];
        this.props.configs(config);
        $('#collectorName').html('<option value="请选择">请选择</option>');
        let pluginName = $('#pluginName').val();
        let collectorObj = {};
        let collectorArr = [];
        let collectors;
        collectorObj.id = 'collectorName';
        let pluginList = this.props.jobManage.pluginList.result.data;
        for (let i = 0; i < pluginList.length; i++) {
            if (pluginList[i].pluginName == pluginName && pluginList[i].collectors) {
                collectors = pluginList[i].collectors;
                for (let j = 0; j < collectors.length; j++) {
                    collectorArr.push(collectors[j].collectorName);
                }
            }
        }

        collectorObj.data = collectorArr;
        createSelect2(collectorObj);
        bindSelectEvent(collectorObj.id, 'select2:select', this.createConfigInfor);
    }

    // 显示采集器信息
    createConfigInfor() {
        let config = [];
        this.props.configs(config);
        $('#datasets').html('');
        let pluginName = $('#pluginName').val();
        let collectorName = $('#collectorName').val();
        let pluginList = this.props.jobManage.pluginList.result.data;
        for (let i = 0; i < pluginList.length; i++) {
            if (pluginList[i].pluginName == pluginName && pluginList[i].collectors) {
                let collectors = pluginList[i].collectors;
                for (let j = 0; j < collectors.length; j++) {
                    if (collectors[j].collectorName == collectorName && collectors[j].collectorName) {
                        this.props.configs(collectors[j].props);
                    } else if (collectorName == '请选择') {
                        $('#datasets').html('');
                        let config = [];
                        this.props.configs(config);
                    }
                }
            }
        }
        // 创建数据集数据
        for (let j = 0; j < this.props.jobManage.config.length; j++) {
            if (this.props.jobManage.config[j].propType == 'SELECT_AUS_DATASETS') {
                $('#datasets').html('');
                this.props.dataSetsName();
                let dataSets = this.props.jobManage.dataSetsName.result.data;
                let dataSetsNames = [];
                let dataSetsObj = {};
                dataSetsObj.id = 'datasets_' + base.encode(this.props.jobManage.config[j].key);
                for (let i = 0; i < dataSets.length; i++) {
                    dataSetsNames.push(dataSets[i].datasetName)
                }
                dataSetsObj.data = dataSetsNames;
                createSelect2(dataSetsObj);
            }
        }

    }

    jobInfor() {
        let owner = sessionStorage.getItem('XDataUserName');
        let jobInfor = {};
        jobInfor.jobName = this.refs.jobName.value;
        jobInfor.owner = owner;
        // jobInfor.description = $('#description').text();
        jobInfor.description = document.getElementById('description').innerText;
        jobInfor.pluginName = $('#pluginName').val();
        jobInfor.collectorName = $('#collectorName').val();
        jobInfor.specialProps = [];
        let data = this.props.jobManage.pluginList.result.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].pluginName == jobInfor.pluginName) {
                jobInfor.jarName = data[i].jarName;
                let collectors = data[i].collectors;
                for (let j = 0; j < collectors.length; j++) {
                    if (collectors[j].collectorName == jobInfor.collectorName) {
                        jobInfor.clazzName = collectors[j].clazzName;
                        jobInfor.specialProps = collectors[j].props;

                    }
                }
            }
        }
        jobInfor.scheduleStrategy = $("input[name='radio']:checked").val();
        jobInfor.misfireStrategy = $('#misfireStrategy').val();
        for (let i = 0; i < jobInfor.specialProps.length; i++) {
            if (jobInfor.specialProps[i].propType == 'TEXTAREA') {
                jobInfor.specialProps[i].value = document.getElementById('textarea_' + base.encode(jobInfor.specialProps[i].key)).innerText;
                // jobInfor.specialProps[i].value = $('#textarea_' + base.encode(jobInfor.specialProps[i].key)).text();
            } else if (jobInfor.specialProps[i].propType == 'SELECT_AUS_DATASETS') {
                jobInfor.specialProps[i].value = $('#datasets_' + base.encode(jobInfor.specialProps[i].key)).val();
            } else if (jobInfor.specialProps[i].propType == 'DATETIME') {
                jobInfor.specialProps[i].value = $('#datatime_' + base.encode(jobInfor.specialProps[i].key)).val();
            } else {
                jobInfor.specialProps[i].value = this.refs[jobInfor.specialProps[i].key].value;
            }
        }
        jobInfor.doneOffset = this.refs.doneOffset.value;

        if (this.state.radio == 'CYCLE') {
            jobInfor.cronExpression = this.refs.cronExpression.value;
            jobInfor.startTriggerTime = this.refs.daterangePicker.getStartTime();
            jobInfor.endTriggerTime = this.refs.daterangePicker.getEndTime();
        } else {
            jobInfor.startTriggerTime = this.refs.daterangePicker.getOnceTime();
        }
        return jobInfor;
    }

    // 验证
    validation() {
        let constraints = {
            jobName: {
                presence: {
                    message: '作业名不能为空！'
                },
                length: {
                    minimum: 3,
                    maximum: 30,
                    message: '长度3-30位字符以内！'
                }
            },
            doneOffset: {
                presence: {
                    message: '下次作业接入开始位置不能为空！'
                }
            }
        };
        // 周期的时候添加表达式非空验证
        if (this.state.radio == 'CYCLE') {
            constraints.cronExpression = {
                presence: {
                    message: '调度表达式不能为空！'
                }
            }
        };
        // 验证特有配置信息
        let specialProps = this.props.jobManage.config;
        let textareaflag;
        for (let i = 0; i < specialProps.length; i++) {
            if (specialProps[i].propType == 'TEXTAREA' && specialProps[i].needed) { // 对特有配置文本域验证非空
                let textareaEle = $('#textarea_' + base.encode(specialProps[i].key));
                let textarea = textareaEle.text();
                if (textarea == '') {
                    textareaEle.css({'borderColor': '#dd4b39'});
                    $('.textareaLabel').css({'color': '#dd4b39'});
                    $('.textareaLabel').siblings().text('描述信息不能为空！');
                    $('.textareaLabel').siblings().css({'color': '#dd4b39'});
                    textareaflag = false;
                } else {
                    textareaEle.css({'borderColor': '#d2d6de'});
                    $('.textareaLabel').css({'color': '#000'});
                    $('.textareaLabel').siblings().text('');
                    textareaflag = true;
                }
            } else if (specialProps[i].propType == 'TEXT' && specialProps[i].needed || specialProps[i].propType == 'PASSWORD' && specialProps[i].needed) { // 对特有配置用户名和密码验证非空
                let conName = 'ele_' + i;
                constraints[conName] = {
                    presence: {
                        message: specialProps[i].key + '不能为空！'
                    }
                }
            }
        }
        let flag = baseValidate($('#jobAdd'), constraints);

        // 周期的时候添加表达式填写正确与否验证，必须放在baseValidate后面
        if (this.state.radio == 'CYCLE') {
            let cronExpressionValue = $('#cronExpression').val();
            if (cronExpressionValue != '') {
                this.props.cronExpression(cronExpressionValue);
                let data = this.props.jobManage.iscronExpression;
                if (data.code == 0 && !data.result) {
                    showErrorMessage('cronExpression', {cronExpression: ['调度表达式格式不正确！']});
                }
            }
        };
        // 由于baseValidate不能验证DIV，description是DIV的textare，拿出来单独验证
        let description = $('#description').text();
        let desflag;
        if (description == '') {
            $('#description').css({'borderColor': '#dd4b39'});
            $('.description').css({'color': '#dd4b39'});
            $('.description').siblings().text('描述信息不能为空！');
            $('.description').siblings().css({'color': '#dd4b39'});
            desflag = false;
        } else {
            $('#description').css({'borderColor': '#d2d6de'});
            $('.description').css({'color': '#000'});
            $('.description').siblings().text('');
            desflag = true;
        }

        let isValidate;
        for (let i = 0; i < specialProps.length; i++) {
            if (specialProps[i].propType == 'TEXTAREA' && specialProps[i].needed) {
                // 正常验证  + 描述DIV验证 + 特殊配置textarea验证 同为true时通过
                isValidate = !flag && desflag && textareaflag;
                
            } else {
                // 正常验证  + 描述DIV验证 同为true时通过
                isValidate = !flag && desflag;
                
            }
        }

        if (this.state.radio == 'CYCLE') {
            // 表达式后台验证
            isValidate = isValidate && this.props.jobManage.iscronExpression.result
        }
        return isValidate;
    }

    // 保存时
    saveHandler() {
        let isValidate = this.validation();
        if (isValidate) {
            let jobInfor = this.jobInfor();
            this.props.jobAdd(jobInfor);
        }else {
            return;
        }
        if (this.props.jobManage.isjobAddSuccess.code == 0) {
            setTimeout(() => {this.props.history.replace('/job');}, 1000);
        }
    }

    // 保存并上线
    saveAndOnlineHandler() {
        let isValidate = this.validation();
        if (isValidate) {
            let jobInfor = this.jobInfor();
            jobInfor.schStatus = 'ON';
            this.props.jobAdd(jobInfor);
        }else {
            return;
        }
        if (this.props.jobManage.isjobAddSuccess.code == 0) {
            setTimeout(() => {this.props.history.replace('/job');}, 1000);
        }
    }

    // 返回
    returnHandler() {
        this.props.history.replace('/job');
    }

	render() {
        let tpl;
        if (this.state.radio == 'CYCLE') {
            let ranges = {
                '今日': [moment(), moment().endOf('day')],
                '未来7日': [moment(), moment().add(6, 'days')],
                '未来30日': [moment(), moment().add(29, 'days')],
                '未来一年': [moment(), moment().add(1, 'years')],
                '永久': [moment(), moment('99991231')]
            }
            let start = moment();
            let end = moment().add(1, 'years');
            let minDate = moment();
            tpl = <div>
                    <div className="form-group col-md-12">
                        <div className="input-name" style={{float: 'left'}}>
                            <label htmlFor="exampleInputOperator">触发时间：</label>
                            <span className="messages"></span>
                        </div>
                        <div className="col-md-12 dateRangePicker">
                            <DateRangePicker opens="right" start = {start} end = {end} minDate={minDate} ranges={ranges} ref="daterangePicker" />
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <div className="input-name">
                            <label htmlFor="cronExpression">调度表达式：</label>
                            <span className="messages"></span>
                        </div>
                        <div className="input">
                            <input type="text" ref="cronExpression" name="cronExpression" className="form-control" id="cronExpression" maxLength={256} placeholder="请输入调度表达式" />
                        </div>
                    </div>
                    
                </div>

        } else {
            let start = moment();
            let minDate = moment();
            let singleDatePicker = true;
            tpl = <div className="form-group col-md-12">
                        <div className="input-name" style={{float: 'left'}}>
                            <label htmlFor="exampleInputOperator">触发时间：</label>
                            <span className="messages"></span>
                        </div>
                        <div className="col-md-12 dateRangePicker">
                            {/* <DateRangePicker start = {start} minDate={minDate} singleDatePicker={singleDatePicker} applyClass='hide' cancelClass='hide' ref="daterangePicker" />*/}
                            <DateRangePicker start = {start} minDate={minDate} singleDatePicker={singleDatePicker} ref="daterangePicker" />
                        </div>
                    </div>
        }


        let props = this.props.jobManage.config.map((element, index) => {
            let placeholder = (element.desc == undefined && element.value == undefined) ? '' : (element.desc != undefined && element.value == undefined) ?
                element.desc : (element.desc == undefined && element.value != undefined) ? '例如：' + element.value : element.desc + '，例如：' + element.value;
            // let placeholder = element.desc + '，例如：' + element.value;
            if (element.propType == 'TEXTAREA') {
                return (
                    <div className="form-group col-md-12">
                        <div className="input-name">
                            <label htmlFor={index} className="textareaLabel">{element.key}：</label>
                            <span className="messages"></span>
                        </div>
                        <div className="input">
                            <div className="textarea form-control" name={'ele_' + index} ref={element.key} id={'textarea_' + base.encode(element.key)} contentEditable="true" placeholder={placeholder}></div>
                        </div>
                    </div>
                )
            } else if (element.propType == 'SELECT_AUS_DATASETS') {
                return (
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="datasets">{element.key}：</label>
                                <span className="messages"></span>
                            </div>
                            <select className="select" id={'datasets_' + base.encode(element.key)} ref={element.key} name={'ele_' + index}>
                            </select>
                        </div>
                    )

            } else if (element.propType == 'DATETIME') {
                let start = moment();
                let minDate = moment();
                let singleDatePicker = true;
                return (
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="datatime">{element.key}：</label>
                                <span className="messages"></span>
                            </div>
                            <div className="col-md-12 dateRangePicker" style={{padding: 0}}>
                                <DateRangePicker id={'datatime_' + base.encode(element.key)} start = {start} minDate={minDate} singleDatePicker={singleDatePicker} ref="datatime" />
                            </div>
                        </div>
                    )
            }else {
                return (
                    <div className="form-group col-md-12">
                        <div className="input-name">
                            <label htmlFor={index}>{element.key}：</label>
                            <span className="messages"></span>
                        </div>
                        <div className="input">
                            <input type={element.propType} ref={element.key} name={'ele_' + index} maxLength={128} className="form-control" id={index} placeholder={placeholder} />
                        </div>
                    </div>
                )
            }
        });



        return (
            <div id="jobAdd" className="row">
                <div className="col-md-8 col-sm-12">
                    <div className="box box-body box-primary">
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="jobName">作业名称：</label>
                                <span className="messages"></span>
                            </div>
                            <div className="input">
                                <input type="text" ref="jobName" name="jobName" className="form-control" maxLength={128} id="jobName" placeholder="请输入作业名称" />
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="scheduleStrategy" style={{float: 'left'}}>调度方式：</label>
                                <span className="messages"></span>
                            </div>
                            <div className="radio" ref="scheduleStrategy" onChange={this.radioChecked}>
                                <label>
                                    <input name="radio" type="radio" value="CYCLE" defaultChecked/>
                                    &nbsp;周期调度
                                </label>
                                <label className="ml20">
                                    <input name="radio" type="radio" value="ONCE" />
                                    &nbsp;一次调度
                                </label>
                            </div>
                        </div>
                        {tpl}
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="description" className="description">描述信息：</label>
                                <span className="messages"></span>
                            </div>
                            <div className="input">
                                <div className="textarea" contentEditable="true" id="description" placeholder="请输入描述信息..."></div>
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label>错过执行策略：</label>
                            </div>
                            <select className="select" id="misfireStrategy">
                                <option value="DO_NOTHING">错过不执行</option>
                                <option value="FIRE_ONCE_NOW">错过执行一次</option>
                                <option value="FIRE_ALL_MISSED">错过执行所有</option>
                            </select>
                        </div>

                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label>选择插件：</label>
                            </div>
                            <select className="select" id="pluginName">
                                <option value="请选择">请选择</option>
                            </select>
                        </div>

                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label>采集器：</label>
                            </div>
                            <select className="select" id="collectorName">
                                <option value="请选择">请选择</option>
                            </select>
                        </div>
                        {props}
                        <div className="form-group col-md-12">
                            <div className="input-name">
                                <label htmlFor="doneOffset">下次作业接入开始位置：</label>
                                <span className="messages"></span>
                            </div>
                            <div className="input">
                                <input type="text" ref="doneOffset" name="doneOffset" className="form-control" id="doneOffset" maxLength={128} placeholder="请输入下次作业接入开始位置" />
                            </div>
                        </div>
                        <div className="box-button col-md-12" style={{padding: '15px'}} >
                            <button className="btn btn-primary" onClick={this.returnHandler}>返回</button>
                            <button className="btn btn-primary" ref="save" style={{marginLeft: '20px'}} onClick={this.saveHandler}>保存</button>
                            <button className="btn btn-primary" ref="online" style={{marginLeft: '20px'}} onClick={this.saveAndOnlineHandler}>上线</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="box box-body box-primary" style={{padding: '10px 0'}}>
                        <div className="form-group col-md-12">
                            <h4>作业新建提示：</h4>
                            <ol style={{paddingLeft: '20px'}} id="disc">
                                <li>作业名称是作业的唯一标识</li>
                                <li>调度方式共两种：一次调度与周期调度<br/>一次调度：作业只执行一次或者用户手动执行若干次<br/>周期调度：作业按照某个定时策略进行周期执行。</li>
                                <li>调度表达式：<br/>
                                 每隔5秒执行一次：*/5 * * * * ?<br/>
                                 每隔1分钟执行一次：0 */1 * * * ?<br/>
                                 每天23点执行一次：0 0 23 * * ?<br/>
                                 每天凌晨1点执行一次：0 0 1 * * ?<br/>
                                 每月1号凌晨1点执行一次：0 0 1 1 * ?<br/>
                                 每月最后一天23点执行一次：0 0 23 L * ?<br/>
                                 每周星期天凌晨1点实行一次：0 0 1 ? * L<br/>
                                 在26分、29分、33分执行一次：0 26,29,33 * * * ?<br/>
                                 每天的7点到21点都执行一次：0 0 7-21 * * ?<br/></li>
                                <li>描述信息对作业的基本信息描述</li>
                                <li>错过执行策略：<br/>
                                    错过不执行：错过若干次调度后，不进行补充调度<br/>
                                    错过执行一次：错误若干次调度后，只补充一次调度<br/>
                                    错误执行全部：错过若干次调度后，补充全部调度</li>
                                <li>选择插件：进行作业使用插件的选择</li>
                                <li>采集器：进行作业使用采集器的选择</li>
                                <li>下次作业接入开始位置：作业调度的OFFSET</li>
                            </ol>
                            详细说明请参见用户手册！
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}
export default JobAdd;
