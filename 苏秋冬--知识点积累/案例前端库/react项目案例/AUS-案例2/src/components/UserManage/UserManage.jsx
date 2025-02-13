/**
 *用户列表组件
 * User: jiaomx
 * Date: 2016/12/19
 * Time: 17:10
 */

import React, { Component } from 'react';
import Modal from 'COMPONENT/Common/Modal/Modal';
import createList, { bindTableEvent } from 'UTIL/baseList';
import { success } from 'UTIL/notification';
import md5 from 'UTIL/md5';

class UserManage extends Component {
	constructor(props) {
        super(props);
        this.createTable = this.createTable.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.removeOKHandler = this.removeOKHandler.bind(this);
        this.resetPasswdHandler = this.resetPasswdHandler.bind(this);
        this.resetPasswdOKHandler = this.resetPasswdOKHandler.bind(this);
        this.userDetail = this.userDetail.bind(this);
        this.userUpdate = this.userUpdate.bind(this);
        this.createUserHander = this.createUserHander.bind(this);
        this.saveUserCom = this.saveUserCom.bind(this);
        this.userSysManage = this.userSysManage.bind(this);
    }

	componentWillMount() {
        // 读取用户列表数据
        this.props.readUser();
    }

    // componentDidMount() {
    //     this.createTable(this.props.usermanage.usermanagesData.result.data);
    // }
    componentDidUpdate() {
        this.createTable(this.props.usermanage.usermanagesData.result.data);
    }

    createTable(data) {
        // 获取自己用户名
        let XDataUserName = sessionStorage.getItem('XDataUserName');
        // 构造列表配置项
        let tableConfig = {};

        tableConfig.id = 'userList';

        // 定义用户列字段数据
        tableConfig.columns = [
            { data: 'userName', 'defaultContent': '-' },
            { data: 'name', 'defaultContent': '-' },
            { data: 'roleName', 'defaultContent': '-' },
            { data: 'createTime', 'defaultContent': '-' },
            { data: 'privilege', 'defaultContent': '无任何权限' }
        ];
        tableConfig.order = [[3, 'desc']];
        let userRolePermission = sessionStorage.getItem('userRolePermission');
        // 定义列表内操作列
        if (userRolePermission.indexOf('USER_') != -1) {
            tableConfig.columnDefs = [{
                'targets': 4, // 操作列生成位置，当前为列表第4列
                'render': function (data, type, row) {
                    let html = '';
                    if (row.privilege.USER.indexOf('查看') != -1) {
                        html += `<a href='javascript:void(0);'  class='userDetail btn btn-default btn-xs'  ><i class='fa fa-file-text-o'></i> 详情</a> `;
                    }
                    if (row.privilege.USER.indexOf('修改') != -1) {
                        html += `<a href='javascript:void(0);' class='userUpdate btn btn-default btn-xs'><i class='fa fa-pencil-square-o'></i> 修改</a> `;
                    }
                    if (row.privilege.USER.indexOf('重置密码') != -1) {
                        html += `<a href='#'  class='resetPasswd btn btn-default btn-xs' data-toggle="modal" data-target="#resetPasswd" ><i class='fa fa-rotate-left'></i> 重置密码</a> `;
                    }
                    if (row.privilege.USER.indexOf('授权') != -1) {
                        html += `<a href='javascript:void(0);'  class='userManage btn btn-default btn-xs'><i class='fa fa-wrench'></i> 权限管理</a> `;
                    }
                    if (row.userName != 'admin' && row.userName != XDataUserName && row.privilege.USER.indexOf('删除') != -1) {
                        html += `<a href='#' class='userRemove btn btn-default btn-xs' data-toggle="modal" data-target="#removeUser"><i class='fa fa-trash-o'></i> 删除</a>`;
                    }
                    return html;
                }
            }];
        }

        // 获取用户列表内数据列
        tableConfig.data = data;

        // 生成用户列表
        createList(tableConfig);

        // 用户列表内删除事件绑定
        bindTableEvent('userList', 'click', 'a.userRemove', this.removeHandler);

        // 用户列表内重置密码事件绑定
        bindTableEvent('userList', 'click', 'a.resetPasswd', this.resetPasswdHandler);

        // 用户列表内查看详细事件绑定
        bindTableEvent('userList', 'click', 'a.userDetail', this.userDetail);

        // 用户列表内修改事件绑定
        bindTableEvent('userList', 'click', 'a.userUpdate', this.userUpdate);

        // 用户列表内权限管理事件绑定
        bindTableEvent('userList', 'click', 'a.userManage', this.userSysManage);
    }
    // 保存用户到组件
    saveUserCom(e) {
        let selectedRecord = $('#userList').DataTable().row($(e.currentTarget).parents('tr')).data();
        this.props.selectUser(selectedRecord);
        return selectedRecord;
    }

    // 用户记录删除处理
    removeHandler(e) {
        let selectedRecord = this.saveUserCom(e);
        this.refs.delUser.setContent('您确定要删除用户：' + selectedRecord.userName + '（' + selectedRecord.name + '）吗？');
    }

    removeOKHandler() {
        let names = [];
        names.push(this.props.usermanage.selectedRecord.userName);
        (async () => {
            await this.props.delUser(names);
            $('#removeUser').modal('hide');
            window.location.reload();
        })();
        // window.location.href = window.location.href;
    }
    // 重置用户密码处理
    resetPasswdHandler(e) {
        let selectedRecord = this.saveUserCom(e);
        this.refs.resetPasswd.setContent('您确定要重置用户：' + selectedRecord.userName + '（' + (selectedRecord.name || '-') + '）的密码吗？（重置密码：000000）');
    }

    resetPasswdOKHandler() {
        let passwd = md5('000000').toUpperCase();
        (async () => {
            await this.props.resUserPass(this.props.usermanage.selectedRecord.userName, passwd);
            if (this.props.usermanage.resUserPasswd.code == 0) {
                $('#resetPasswd').modal('hide');
                success('重置成功！')
            }
        })();
    }
    // 用户详细事件处理
    userDetail(e) {
        let selectedRecord = this.saveUserCom(e);
        this.props.history.replace('/usermanage/detail/' + selectedRecord.userName);
    }

   // 用户修改事件处理
    userUpdate(e) {
        let selectedRecord = this.saveUserCom(e);
        this.props.history.replace('/usermanage/update/' + selectedRecord.userName);
    }

    // 用户权限管理
    userSysManage(e) {
        let selectedRecord = this.saveUserCom(e);
        this.props.history.replace('/usermanage/sysPrivilege/' + selectedRecord.userName);
    }

    // 创建新用户处理
    createUserHander() {
        this.props.history.replace('/usermanage/add');
    }
	render() {
        // 判断有无仪表板操作权限
        let thTpl = <tr><th>用户名</th>
            <th>姓名</th>
            <th>角色</th>
            <th>创建时间</th></tr>;
        let userRolePermission = sessionStorage.getItem('userRolePermission');
        if (userRolePermission.indexOf('USER_') != -1) {
            thTpl = <tr><th>用户名</th>
                <th>姓名</th>
                <th>角色</th>
                <th>创建时间</th>
                <th>操作</th></tr>;
        }
        let addBtnTpl = '';
        if (userRolePermission.indexOf('USER_CREATE') != -1) {
            addBtnTpl = <button type="submit" className="btn btn-primary" onClick={ this.createUserHander}>新建</button>
        }
		return (
			<div id="userManage" className="box box-primary" >
                <div className="row">
                    <div className="col-md-12">
                        <div className="box-header">
                            {addBtnTpl}
                            {/* <button type="submit" className="btn btn-primary" onClick={ this.createUserHander}>新建</button>*/}
                        </div>
                        <div className="box-body">
                            <table id="userList" className="table table-striped table-bordered">
                                <thead>
                                {thTpl}
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal modalId="removeUser" ref='delUser' title="删除用户" okHandler={ this.removeOKHandler } />
                <Modal modalId="resetPasswd" ref='resetPasswd' title="重置密码" okHandler={ this.resetPasswdOKHandler } />
            </div>
		)
	}
}
export default UserManage;
