/**
 * tree结构和表信息
 * User: xiongjie
 * Date: 2017/8/5
 * Time: 15:45
 * */

import React, { Component } from 'react';
import dataSourceModelService from 'SERVICE/dataSourceModelService';
let defaultData = {
    animate: true,
    data: [{
        text: '数据源',
        children: []
    }]
};
let tableNodes = {};
export default class Tree extends Component {
    constructor(props) {
        super(props);
        this.towTable = this.towTable.bind(this);
        this.readTabel = this.readTabel.bind(this);
    }
    tableNodes () {
        return tableNodes;
    };
    componentDidMount() {
         defaultData = {
            animate: true,
            data: [{
                text: '数据源',
                children: []
            }]
        };
        // 获取数据源列表
        (async ()=>{
            let List = await dataSourceModelService.readDataSource();
            if (List) {
                // tree数据节点
                let deNodes = defaultData.data[0].children;
                // 插入获取的数据源
                List.map((dataName, i)=> {
                    // 防止页面重新渲染再次添加
                    if (deNodes.length <= i) {
                        deNodes.push({
                            text: dataName.dataSourceName,
                            children: [],
                            id: i
                        });
                    }
                });
                // 生成tree数据结构
                this.towTable(defaultData);
            } else {
                this.towTable(defaultData);
            }
        })()
        // 禁止tree复制
        document.getElementById('tree').oncontextmenu = new Function('event.returnValue=false');
        document.getElementById('tree').onselectstart = new Function('event.returnValue=false');
    }
    towTable(defaultData) {
        let deNodes = defaultData.data[0].children;
        // 生成二级tree
        $(' #tree').tree(defaultData);

        $(' #tree').tree('collapseAll');

        $(' #tree').tree({
            onClick: (node)=> {
                if (node.text == '数据源') {
                    return;
                }
                // 判断点击是否生成tree
                if (node.children) {
                    if (node.children.length <= 0) {
                        this.readTabel(node, deNodes);
                    } else {
                        return;
                    }
                } else {
                    this.props.draggable(node.domId);
                }
            }
        });

    }
    // 生成三级tree
    readTabel(node, deNodes) {
        // 点击二级tree发送请求获取DataSourceTabel
        let dataSource = {
            dataSourceName: node.text,
            offset: 1,
            num: 10000,
            tableNameFilter: ''
        };
        // 异步请求数据
        (async () => {
            let DataSourceDetail = await dataSourceModelService.getDataSource(dataSource);
            if (DataSourceDetail) {
                let DataSourceTabel = DataSourceDetail.schemaModule;
                let dataSourceName = DataSourceDetail.dataSourceName;
                let tableModel = [];
                for (let key in DataSourceTabel) {
                    let tableName = [];
                    DataSourceTabel[key].map(function (data, i) {
                        let targetName = dataSourceName + '.' + key + '.' + data.tableName;
                        tableNodes[targetName] = data.columns;
                        tableName.push({
                            id: i,
                            attributes: {
                                title: 'name'
                            },
                            text: targetName
                        })
                    });
                    tableModel.push({
                        animate: true,
                        state: 'closed',
                        dnd: true,
                        text: key,
                        children: tableName

                    })
                }
                // 把数据添加defaultData中；
                for (let key in deNodes) {
                    if (deNodes[key].text == node.text) {
                        deNodes[key].children = tableModel;
                    }
                }
                // $(' #tree').tree(defaultData);

                // 节点添加子元素
                $(' #tree').tree('append', {
                    parent: node.target,
                    data: tableModel
                });
            }
        })();
    }
    render() {
        return <div className='col-md-3'>
                    <ul id='tree'></ul>
                </div>
    }
}

