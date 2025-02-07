/**
 *用户详细组件
 * User: jiaomx
 * Date: 2016/12/21
 * Time: 9:10
 */

import React, { Component } from 'react';

class UserDetail extends Component {
	constructor(props) {
        super(props);
        this.returnHandler = this.returnHandler.bind(this);
        this.updetaHandler = this.updetaHandler.bind(this);
    }
    componentWillMount() {
        // 读取用户详细信息
        this.props.userDetail(this.props.usermanage.selectedRecord.userName);
    }

    // 返回事件
    returnHandler() {
        this.props.history.replace('/usermanage');
    }
	
    // 修改当前用户信息
    updetaHandler() {
        this.props.history.replace('/usermanage/update/' + this.props.usermanage.selectedRecord.userName);
    }
	render() {
        // 判断是否存在仪表板修改权限
        let modifyBtnTpl = '';
        if (sessionStorage.getItem('userRolePermission').indexOf('DASHBOARD_MODIFY') != -1) {
            modifyBtnTpl = <button className="btn btn-primary" onClick={this.updetaHandler}>修改</button>;
        }

        let userDetail = (this.props.usermanage.userDetail.result != undefined) ? this.props.usermanage.userDetail.result.detail : {};
        let roleName = (userDetail.roleName == undefined) ? '' : userDetail.roleName.join();

		return (
			<div id="userDetail" className="box box-primary" >
                <div className="row">
                    <div className="box-body col-md-12">
                        <div className="col-md-5">
                            <div className="form-group col-md-12">
                                <label>账号：</label>
                                <span>{userDetail.userName}</span>
                            </div>
                            <div className="form-group col-md-12">
                                <label>姓名：</label>
                                <span>{userDetail.name}</span>
                            </div>
                            <div className="form-group col-md-12">
                                <label>邮箱：</label>
                                <span>{userDetail.email}</span>
                            </div>
                            <div className="form-group col-md-12">
                                <label>电话：</label>
                                <span>{userDetail.phoneNo}</span>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="form-group col-md-12">
                                <label>部门：</label>
                                <span>{userDetail.department}</span>
                            </div>
                            <div className="form-group col-md-12">
                                <label>职位：</label>
                                <span>{userDetail.position}</span>
                            </div>
                            <div className="form-group col-md-12">
                                <label>角色名称：</label>
                                <span>{roleName}</span>
                            </div>
                        </div>
                        <div className="box-button col-md-12">
                            <button className="btn btn-primary" onClick={this.returnHandler}>返回</button>
                            {modifyBtnTpl}
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}
export default UserDetail;
