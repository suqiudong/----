import React, { Component } from 'react';
import {jsPlumb} from 'jsplumb';
import Tree from './Tree';
import Exhibition from './Exhibition';
import base from 'UTIL/base64';
let instance ;
let tableDate = {
    tableNodes: {},
    sql: {
        tableName: [], // 选中的表
        cloums: {}, // 选中表的字段
        allCloums: {}, // 提取所有字段
        bdTable: {}, // 表别名
        jsplumbs: {} // 连线
    }
};
export default class Sql extends Component {
    constructor(props) {
        super(props);
        this.draggable = this.draggable.bind(this);
        this.jsPlumbMove = this.jsPlumbMove.bind(this);
        this.cloumsChange = this.cloumsChange.bind(this);
        this.bdChange = this.bdChange.bind(this);
        this.ergodicChange = this.ergodicChange.bind(this);
        this.clearTable = this.clearTable.bind(this);
        this.FuncMenuChange = this.FuncMenuChange.bind(this);
        this.GeneratingSQL = this.GeneratingSQL.bind(this);
        this.selectCloums = this.selectCloums.bind(this);
        this.fromTabel = this.fromTabel.bind(this);
        this.whereSentence = this.whereSentence.bind(this);
        this.GROUPBYSentence = this.GROUPBYSentence.bind(this);
        this.HAVINGSentence = this.HAVINGSentence.bind(this);
        this.ORDERBYSentence = this.ORDERBYSentence.bind(this);
        this.LIMITSentence = this.LIMITSentence.bind(this);
        this.bdCloums = this.bdCloums.bind(this);
        this.jsPlumbDelete = this.jsPlumbDelete.bind(this);
        this.jsPlumbContent = this.jsPlumbContent.bind(this);
        this.jsPlumbChange = this.jsPlumbChange.bind(this);
        this.jsPlumbPush = this.jsPlumbPush.bind(this);
        this.state = {
            sql: tableDate.sql
        }
    }
    componentWillMount() {
        tableDate = {
            tableNodes: {},
            sql: {
                tableName: [], // 选中的表
                cloums: {}, // 选中表的字段
                allCloums: {}, // 提取所有字段
                bdTable: {},
                jsplumbs: {}
            }
        }
        this.setState({sql: tableDate.sql});
    }
    componentDidMount() {
        instance = jsPlumb.getInstance({
            // 端点形状dot圆点
            Endpoint: ['Dot', {radius: 2}],
            // 流程图样式，stub：连线与端点线的转折长度，gap:线与端点的距离
            Connector: ['Flowchart', {stub: 20, gap: 0, coenerRadius: 90, alwaysRespectStubs: false, midpoint: 0.5}],
            // 连线样式
            PaintStyle: {
                stroke: 'rgb(58, 156, 143)', // 连线颜色
                strokeWidth: 2,
                oulineStroke: 'transparent',
                outlineWidth: 4
            },
            // 附加到每个连接的默认重叠
            ConnectionOverlays: [
                ['Arrow', { // 目标端点箭头样式
                    location: 1,
                    visible: true,
                    width: 11,
                    length: 11,
                    direction: 1,
                    id: 'arrow_forwards'
                } ]
            ],
            ConnectionsDetachable: false, // 连接是否可以使用鼠标默认分离
            Container: 'canvas' // 设置父级元素
        });
        instance.bind('connection', (p)=> {
            // 获取源元素
            var source = p.source;
            var sourceEndPoints = instance.getEndpoints(source);
            $.each(sourceEndPoints, (i, sourceEndPoint)=> {
                // 判断是否重复连接
                // debugger;
                if (p.connection != sourceEndPoint.connections[0]
                    && (sourceEndPoint.connections[0].targetId == p.targetId)) {
                    instance.removeAllEndpoints(p);
                    return;
                }
            });
        })
    }
    componentDidUpdate() {
        this.jsPlumbContent();
    }
    // 拖拽事件
    draggable(id) {
        let that = this;
        let date = tableDate.sql;
        // 拖拽
        $('#' + id).draggable({
            proxy: function(source) {
                // 创建移动块，从这个class可以获得移动块的坐标
                var moveBlock = $('<div class="proxy"></div>');
                moveBlock.html($(source).text()).appendTo('body');
                return moveBlock;
            },
            revert: true,
            cursor: 'auto',
            onStopDrag: function(e) {
                $('body').children('.proxy').remove();
            }
        });

        // 放入框内
        $('.flowchart-demo').droppable({
            onDrop: function(e, source) {
                // 获取拖动div坐标
                let moveX = $(' .proxy').offset().left - $(this).offset().left;
                let moveY = $(' .proxy').offset().top - $(this).offset().top;
                let tableId = source.childNodes[5].innerHTML;
                let ID = tableId.split('.');// 提取表名
                tableDate.tableNodes = that.refs.tree.tableNodes(); // 添加数据信息到tableDate中
                let baseId = base.encode(ID[ID.length - 1]);
                // 创建div
                let p = $('<div style="min-width:180px;left:' + moveX +
                    'px;top:' + moveY + 'px"' + 'class="SqlList window jtk-node" tableId='
                    + tableId + ' id=' + baseId + '><i class="fa fa-trash-o fa_delect"></i></div>');
                p.append($('<p class="cloum_title">' +
                    '<label class="checkCloums_title" title="' + tableId + '">' +
                    '<input type="checkbox" class="checkCloums title" tableId="' + tableId + '"/><span class="table-title">' + ID[ID.length - 1] + '</span></label></p>'));

                // 创建字段列表
                let ulCloums = $('<ul class="list-group table-group"></ul>');
                let cloumList = {};
                // 提取字段
                for (let key in tableDate.tableNodes) {
                    if (key == tableId) {
                        cloumList = tableDate.tableNodes[key];
                    }
                }
                // 输出字段
                let all = {};
                for (let key in cloumList) {
                    let cloumsName = tableId + '.' + key;
                    let baseCloName = base.encode(cloumsName);
                    let li = $('<li class="list-group-item liCloum" id="' + baseCloName + '"><label><input type="checkbox" class="checkCloums" tableId="' + tableId + '" value="' + cloumsName + '"/>' + key + '</label></li>');
                    ulCloums.append(li);
                    // 拖动对象信息存储到allcloums中
                    all[cloumsName] = {
                        name: cloumsName,
                        value: cloumList[key]
                    }
                }
                // 防止新添加重复
                let flag = false;
                $('.flowchart-demo .window').each(function () {
                    if ($(this).attr('tableId') == tableId) {
                        flag = true;
                    }
                });
                if (flag) return;
                p.append(ulCloums);
                date.tableName.push(tableId); // 添加表名信息
                date.allCloums[tableId] = all; // 添加字段
                // 新加一个拖动对象
                $(this).append(p);
                that.setState({sql: date});
                // 初始化移动
                that.jsPlumbMove(baseId);

                // 绑定移除模块
                $('#SQL .fa').on('click', function() {
                    let parents = $(this).parent();
                    let tableName = parents.attr('tableId');
                    instance.remove(parents);
                    // 移除表
                    for (let i = 0; i < date.tableName.length; i++) {
                        if (date.tableName[i] == tableName) {
                            date.tableName.splice(i, 1);
                            date.cloums[tableName] = {};
                            that.clearTable(tableName, date);
                            break;
                        }
                    }
                    // 清除相关联连线
                    let jsplumbs = tableDate.sql.jsplumbs;
                    for (let key in jsplumbs) {
                        if (tableName == key) {
                            delete jsplumbs[tableName];
                        } else {
                            jsplumbs[key].map((date)=>{
                                if (date.source.indexOf(tableName) > -1 || date.target.indexOf(tableName) > -1) {
                                    delete jsplumbs[key];
                                    that.refs.Exhibition.clearJsplumStorageAlias(key); // 清除限制
                                }
                            })
                        }
                    }
                    // 恢复类型为逗号连接
                    $('.Exhibition_select[data-name = "FROM"] .list-group-item').each(function() {
                        let menu = $(this).prev().find('.join-condition-menu');
                        if (menu.length == 0) {
                            $(this).find('.joinCondition').val(',');
                            let tableName = $(this).attr('title');
                            that.refs.Exhibition.joinCondition(',', tableName);
                        }

                    });
                    that.setState({sql: date});
                })

                // 全选反选
                $('.title').on('click', function() {
                    $(this).parents('.SqlList').find('input').prop('checked', this.checked);
                    that.cloumsChange(date, $(this), this.checked);
                });

                // 取消选择或重新全选时操作
                $('input:checkbox').on('click', function() {
                    $(this).parents('.table-group').find('input').each(function() {
                        if (!this.checked) {
                            $(this).parents('.SqlList').find('.title').prop('checked', this.checked);
                            return false;
                        }
                        $(this).parents('.SqlList').find('.title').prop('checked', this.checked);
                    })
                    that.cloumsChange(date, $(this));
                })
            }
        });
    }
    // 反向取消字段时清除存储信息
    clearTable(cloum, date) {
        delete date.cloums[cloum];
        delete date.allCloums[cloum];
        this.refs.Exhibition.clearcloumsDate(cloum);
    }
    // 字段选择变化更改state状态
    cloumsChange(date, obj, checked = true) {
        let tableId = obj.attr('tableId');
        let arr = {};
        // arr中添加checked选中的value
        obj.parents('.SqlList').find('.table-group').find('input:checked').each(function () {
            let value = $(this).attr('value');
            // 设置初始化对象
            if (this.checked) arr[value] = {
                name: value,
                Func: 'Func',
                bd: '',
                switch: true
            };
            // 判断是否存在字段别名
            if (tableId in date.cloums) {
                if (value in date.cloums[tableId]) {
                    arr[value] = date.cloums[tableId][value];
                }
            }
        });
        date.cloums[tableId] = arr;
        // 反向选择清空cloums
        if (!checked) date.cloums[tableId] = [];

        this.setState({
            sql: date
        });
    }
    // 字段别名
    bdCloums() {
        let value = event.target.value;
        let cloums = tableDate.sql.cloums;
        let parents = $(event.target).parents('.list-group-item');
        // parents.find('.AS').remove(); // 初始
        // 获取字段名
        let cloumsName = parents.find('.cloumsName').html();
        // 判断是存在括号，存在去除
        if (cloumsName.indexOf('(') > -1) {
            cloumsName = cloumsName.slice(1, cloumsName.length - 1);
        }
        if (value == '' || value.indexOf(' ') > -1) {
            // parents.find('.alias').html('别名');
            $(this).val('');
            for (let key in cloums) {
                for (let pop in cloums[key]) {
                    let target = cloums[key][pop];
                    if (pop == cloumsName) {
                        target.name = target.bd;
                        target.bd = '';
                        target.switch = true;
                    }
                }
            }
        } else {
            for (let key in cloums) {
                for (let pop in cloums[key]) {
                    let Record = '';
                    let target = cloums[key][pop];
                    if (pop == cloumsName && target.bd == '') {
                        Record = target.name;
                        target.bd = Record;
                        target.name = value;
                        target.switch = false;
                    } else if (pop == cloumsName && target.bd != '') {
                        target.name = value;
                    }
                }
            }
        }
        this.setState({sql: tableDate.sql});
    }
    // 修改连线
    jsPlumbChange(tableSource, source, target, index) {
        tableDate.sql.jsplumbs[tableSource][index] = {
            source: source,
            target: target,
            index: index
        }
        this.jsPlumbContent();
    }
    // 新增连线
    jsPlumbPush(tableSource, source, target, length) {
        let jsplumbs = tableDate.sql.jsplumbs;
        let offSet = tableSource in jsplumbs;
        if (!offSet) {
            jsplumbs[tableSource] = []
        }
        tableDate.sql.jsplumbs[tableSource].push({
            source: source,
            target: target,
            index: length - 1
        });
        this.setState({sql: tableDate.sql});
    }
    // 连线配置
    jsPlumbContent() {
       // 清除连接
        let allCloums = tableDate.sql.allCloums;
        for (let key in allCloums) {
            let allCloumName = Object.keys(allCloums[key]);
            allCloumName.map((date)=>{
                let source = base.encode(date);
                let el = jsPlumb.getSelector('#' + source);
                instance.removeAllEndpoints(el);
            })
        }
        // 进行连线
        let jsplumbs = tableDate.sql.jsplumbs;
        for (let key in jsplumbs) {
            jsplumbs[key].map((date)=>{
                let source = base.encode(date.source);
                let target = base.encode(date.target);
                instance.connect({
                    source: source,
                    target: target,
                    anchors: [['Right'], ['Left']] // 源点，目标点位置
                });
            })
        }
    }
    // 删除连线
    jsPlumbDelete(tableSource, index) {
        tableDate.sql.jsplumbs[tableSource].splice(index, 1);
        this.jsPlumbContent();
    }
    // jsPlumb内移动
    jsPlumbMove(id) {
        let el = jsPlumb.getSelector('#' + id);
        instance.draggable(el, {});
    }
    // 修改原数据
    ergodicChange(date, value, tableName) {
        for (let key in date) {
            if (key == tableName) {
                let Selected = date[key];
                for (let k in Selected) {
                    let valueSplit = Selected[k].name.split('.');
                    Selected[k].name = value + '.' + valueSplit[valueSplit.length - 1];
                }
            }
        }
    }
    // 当创建别名时，更改
    bdChange(value, tableName) {
        // 符合别名添加
        let cloums = tableDate.sql.cloums;
        let allCloums = tableDate.sql.allCloums;
        let bdTable = tableDate.sql.bdTable;
            bdTable[tableName] = value;
        // 不符合别名时删除tableName
        if (value == '') {
            if (tableName in bdTable) {
                delete bdTable[tableName];
                this.ergodicChange(allCloums, tableName, tableName);
                this.ergodicChange(cloums, tableName, tableName);
            }
        } else {
            this.ergodicChange(allCloums, value, tableName);
            this.ergodicChange(cloums, value, tableName);
        }
        this.setState({sql: tableDate.sql});
    }
    // fun函数修改数据
    FuncMenuChange(value, cloumsName) {
        let cloums = tableDate.sql.cloums;
        for (let key in cloums) {
            let cloumsList = cloums[key];
            for (let k in cloumsList) {
                if (cloumsList[k].name == cloumsName) {
                    cloumsList[k].Func = value;
                }
            }
        }
        this.setState({sql: tableDate.sql});
    }
    // 输出sql语句 ，每一块分别以函数返回
    GeneratingSQL() {
        let sql = '';
        let cloumsDate = this.refs.Exhibition.ReturnInformation();
        let Distinct = $('.Distinct').hasClass('label') ? ' Distinct ' : ' ';
        let cloumsList = this.selectCloums(); // 字段
        let tableList = this.fromTabel(cloumsDate); // 表名
        let where = this.whereSentence(); // 条件
        let GROUPBY = this.GROUPBYSentence();
        let HAVING = this.HAVINGSentence();
        let ORDERBY = this.ORDERBYSentence();
        let LIMIT = this.LIMITSentence();
        sql = 'SELECT' + Distinct + cloumsList + ' FROM ' + tableList + where + GROUPBY + HAVING + ORDERBY + LIMIT;
        $('#' + this.props.SQLID).val(sql);
        $('#SQL').modal('toggle');
    }
    fromTabel(cloumsDate) {
        let LocaIn = tableDate.sql;
        let Sentence = '';
        LocaIn.tableName.map((date, i)=>{
            let bdName = date in LocaIn.bdTable ? ' AS ' + LocaIn.bdTable[date] : '';
            let str = date in cloumsDate.joinCondition ? ' ' + cloumsDate.joinCondition[date] + ' ' : ',';
            let joinMenu = '';
            $('.join-condition-menu[data-name = "' + date + '"]').each(function() {
                joinMenu += ' ' + $(this).find('.key-right').html() + ' ' + $(this).find('.offsetColumn').eq(0).val() +
                        $(this).find('.offsetColumn').eq(1).val() + $(this).find('.offsetColumn').eq(2).val();

            });
            if (i == LocaIn.tableName.length - 1) str = '';
            Sentence += date + bdName + joinMenu + str;
        })
        return Sentence;
    }
    selectCloums() {
        let LocaIn = tableDate.sql;
        let Sentence = '';
        for (let key in LocaIn.cloums) {
            let Func = '';
            let cloumsName = '';
            let cloumsBD = '';
            let LocaInCloums = LocaIn.cloums[key];
            // let keys = Object.keys(LocaInCloums);
            // let props = keys[keys.length - 1]; // 获取对象最后一位属性
            let str = ',';
            for (let pop in LocaInCloums) {
                // if (pop == props) str = '';
                let obj = LocaInCloums[pop];
                let strName = obj.switch ? obj.name : obj.bd;
                Func = obj.Func == 'Func' ? '' : obj.Func; // 输出函数
                cloumsName = obj.Func == 'Func' ? strName : '(' + strName + ')'; // 字段名
                cloumsBD = obj.bd == '' || obj.bd == '别名' ? ' ' : ' AS ' + obj.name; // 输出别名
                Sentence += Func + cloumsName + cloumsBD + str;
            }
        }
        // 清除最后一位逗号
        Sentence = Sentence.slice(0, Sentence.length - 1);
        // 未选择字段时
        if (Sentence == '') Sentence = '* ';
        return Sentence;
    }
    whereSentence() {
        let Sentence = '';
        let where = '';
        $('.Exhibition_select[data-name = "WHERE"]').find('.join-condition-menu').each(function() {
            where += ' ' + $(this).find('.key-right').html() + ' ' + $(this).find('.offsetColumn').eq(0).val() +
                $(this).find('.offsetColumn').eq(1).val() + $(this).find('.offsetColumn').eq(2).val();
        });
        if (where != '') Sentence = ' WHERE ' + where;
        return Sentence;
    }
    GROUPBYSentence() {
        let Sentence = '';
        let GROUPBY = '';
        $('.Exhibition_select[data-name = "GROUP BY"]').find('.join-condition-menu').each(function() {
            GROUPBY += $(this).find('.offsetColumn').val() + $(this).find('.GROUPBY-str').html();

        });
        if (GROUPBY != '') Sentence = ' GROUPBY ' + GROUPBY;
        return Sentence;
    }
    ORDERBYSentence() {
        let Sentence = '';
        let ORDERBY = '';
        $('.Exhibition_select[data-name = "ORDER BY"]').find('.join-condition-menu').each(function() {
            ORDERBY += $(this).find('.offsetColumn').val() + ' ' + $(this).find('.ORDERBY-ASC').html() + $(this).find('.ORDERBY-str').html();
        });
        if (ORDERBY != '') Sentence = ' ORDERBY ' + ORDERBY;
        return Sentence;
    }
    HAVINGSentence() {
        let Sentence = '';
        let HAVING = '';
        $('.Exhibition_select[data-name = "HAVING"]').find('.join-condition-menu').each(function() {
            HAVING += ' ' + $(this).find('.key-right').html() + ' ' + $(this).find('.offsetColumn').eq(0).val() +
                $(this).find('.offsetColumn').eq(1).val() + $(this).find('.offsetColumn').eq(2).val();
        });
        if (HAVING != '') Sentence = ' HAVING' + HAVING;
        return Sentence;
    }
    LIMITSentence() {
        let Sentence = '';
        let LIMIT = $('.Exhibition_select[data-name = "LIMIT"]').find('.list-group-item').text().split(',');
        if (LIMIT[0] == '<-->' && LIMIT[1] == '<-->') {
            LIMIT = '';
        } else if (LIMIT[0] == '<-->') {
            LIMIT = LIMIT[1];
        } else if (LIMIT[1] == '<-->') {
            LIMIT = LIMIT[0];
        }
        if (LIMIT != '') Sentence = ' LIMIT ' + LIMIT;
        return Sentence;
    }
    render() {
        return <div id="SQL" className="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header hide">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">sql查询插件</h4>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    {/* tree数据源结构*/}
                                    <Tree ref='tree' draggable={this.draggable}></Tree>
                                    {/* 数据表拖动展示*/}
                                    <div className='col-md-9'>
                                        <div className="jtk-demo-main">
                                            <div className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" id="canvas"></div>
                                        </div>
                                        <Exhibition sql={this.state.sql} ref='Exhibition'
                                                    bdChange={this.bdChange}
                                                    FuncMenuChange={this.FuncMenuChange}
                                                    bdCloums={this.bdCloums}
                                                    jsPlumbPush={this.jsPlumbPush}
                                                    jsPlumbChange={this.jsPlumbChange}
                                                    jsPlumbDelete ={this.jsPlumbDelete}
                                        ></Exhibition>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal"> 取消</button>
                                <button type="button" className="btn btn-primary " onClick={this.GeneratingSQL}>确认</button>
                            </div>
                        </div>
                    </div>
                </div>
    }
}
