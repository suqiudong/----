/**
 *角色列表组件
 * User: jiaomx
 * Date: 2016/12/22
 * Time: 14:19
 */

import React, { Component } from 'react';
import createList, { bindTableEvent } from 'UTIL/baseList';
import Modal from 'COMPONENT/Common/Modal/Modal';
// import { success } from 'UTIL/notification';

class RoleManage extends Component {
	constructor(props) {
        super(props);
        this.editHandler = this.editHandler.bind(this);
        this.detailHandler = this.detailHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.saveRoleCom = this.saveRoleCom.bind(this);
        this.deleteOKHandler = this.deleteOKHandler.bind(this);
        this.addHandler = this.addHandler.bind(this);
    }

	componentWillMount() {
        // 读取用户列表数据
        this.props.readRole();
    }

    componentDidUpdate() {
        this.createTable(this.props.roleManage.roleManagesData.result.data);
        $('button[name = "createRole"]').on('click', this.addHandler);
    }
    // 新建角色跳转
    addHandler() {
        this.props.history.replace('/roleManage/create');
    }
    // 保存用户到组件
    saveRoleCom(e) {
        let selectedRecord = $('#roleList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.selectRole(selectedRecord);
        return selectedRecord;
    }

    // 编辑事件处理
    editHandler(e) {
        let selectedRecord = this.saveRoleCom(e);
        this.props.history.replace('/roleManage/edit/' + selectedRecord.roleName);
    }
    // 详情
    detailHandler(e) {
        let selectedRecord = this.saveRoleCom(e);
        this.props.history.replace('/roleManage/detail/' + selectedRecord.roleName);
    }
    // 删除弹框
    deleteHandler(e) {
        let selectedRecord = this.saveRoleCom(e);
        this.refs.delRole.setContent('您确定要删除角色：' + selectedRecord.roleName + ' 吗？');
    }

    returnHandler() {
        $('#removeRole').modal('hide');
        this.props.history.replace('/roleManage');
    }

    // 删除成功
    deleteOKHandler() {
        let names = [];
        names.push(this.props.roleManage.selectRole.roleName);
        this.props.deleteRole(names, this.returnHandler.bind(this));
        // $('#removeRole').modal('hide');
        // this.props.history.replace('/roleManage')
    }

    createTable(data) {
        // 构造列表配置项
        let tableConfig = {};
        // 获取用户列表内数据列

        tableConfig.id = 'roleList';

        // 定义用户列字段数据
        tableConfig.columns = [
            {data: 'roleName' },
            { data: 'desc' },
            { data: 'memberNumber' },
            { data: 'privilege' }
        ];

        let userRolePermission = sessionStorage.getItem('userRolePermission');
        // 定义列表内操作列
        if (userRolePermission.indexOf('ROLE_') != -1) {
            tableConfig.columnDefs = [{
                'targets': 3, // 操作列生成位置，当前为列表第3列
                'render': function (type, data, row) {
                    let html = '';
                    if (row.privilege) {
                        if (row.privilege.ROLE.length !== 0) {
                            if (row.privilege.ROLE.indexOf('查看') != -1) {
                                html += `<a href='javascript:void(0);'  class='roleDetail btn btn-default btn-xs'  ><i class='fa fa-file-text-o'></i> 详情</a> `;
                            }
                            if (row.privilege.ROLE.indexOf('修改') != -1) {
                                html += `<a href='javascript:void(0);' class='roleEdit btn btn-default btn-xs'><i class='fa fa-pencil-square-o'></i> 修改</a> `;
                            }
                            if (row.privilege.ROLE.indexOf('删除') != -1) {
                                html += `<a href='#' class='roleDelete btn btn-default btn-xs' data-toggle="modal" data-target="#removeRole"><i class='fa fa-trash-o'></i> 删除</a>`;
                            }
                        } else {
                            html += `<span>  无操作权限<span/>`
                        }
                    } else {
                        html += `<span>  无操作权限<span/>`
                    }
                    return html;
                }
            }];
        }
        tableConfig.data = [];
        for (let i = 0; i < data.length; i++) {
            let roleInfo = {};
            roleInfo.roleName = data[i].roleName;
            roleInfo.desc = data[i].desc || '-';
            roleInfo.memberNumber = data[i].member.length;
            roleInfo.member = data[i].member;
            roleInfo.privilege = data[i].privilege;
            tableConfig.data.push(roleInfo);
        }

        tableConfig.order = [[ 0, 'asc' ]];

        // 生成用户列表
        createList(tableConfig);

        // 角色列表内编辑事件绑定
        bindTableEvent('roleList', 'click', 'a.roleDetail', this.detailHandler);
        bindTableEvent('roleList', 'click', 'a.roleEdit', this.editHandler);
        bindTableEvent('roleList', 'click', 'a.roleDelete', this.deleteHandler);

    }
    
	render() {
        let addBtnTpl = '';
        if (sessionStorage.getItem('userRolePermission').indexOf('ROLE_CREATE') != -1) {
            addBtnTpl = <button type="submit" name="createRole" className="btn btn-primary">新建</button>;
        }
        // 判断有无角色操作权限
        let thTpl = <tr><th>角色名称</th>
            <th>描述</th>
            <th>人数</th>
            </tr>;
        let userRolePermission = sessionStorage.getItem('userRolePermission');
        if (userRolePermission.indexOf('ROLE_') != -1) {
            thTpl = <tr>
                <th>角色名称</th>
                <th>描述</th>
                <th>人数</th>
                <th>操作</th>
            </tr>;
        }
		return (
			<div id="roleManage" className="box box-primary" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="box-header left">
                            {addBtnTpl}
                        </div>
                        <div className="box-body">
                            <table id="roleList" className="table table-striped table-bordered">
                                <thead>
                                {thTpl}
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal modalId="removeRole" ref='delRole' title="删除角色" okHandler={ this.deleteOKHandler } />
            </div>
		)
	}
}
export default RoleManage;
