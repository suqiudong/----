/**
 * 登录组件
 * User: jiaomx
 * Date: 2016/12/27
 * Time: 11:23
 */
import React, { Component } from 'react';
import Footer from 'COMPONENT/Footer/Footer'
import md5 from 'UTIL/md5';
import { connect } from 'react-redux';
import Modal from 'COMPONENT/Common/Modal/Modal';
require('../../../node_modules/jquery-file-upload/css/uploadfile.css');
require('../../../node_modules/jquery-file-upload/js/jquery.uploadfile.min');
import { error, alert } from 'UTIL/notification';
import { baseValidate } from 'UTIL/baseValidate';
import usermanageService from 'SERVICE/usermanageService';

let uploadObj;
@connect(
    ({ login, router }) => ({login, router}),
    require('ACTION/login').default
)
class Login extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.activation = this.activation.bind(this);
        this.activationOKHandler = this.activationOKHandler.bind(this);
        this.loadModalControlHandler = this.loadModalControlHandler.bind(this);
        this.state = {
            display: 'none'
        }
    }


    login() {
        if (this.props.login.isActive.code == 0 && this.props.login.isActive.result.detail.status != 2) {
            let userName = this.refs.userName.value;
            let passwd = this.refs.passwd.value;


            let constraints = {
                passwd: {
                    presence: {
                        message: '密码不能为空'
                    }
                },
                userName: {
                    // 必填
                    presence: {
                        message: '用户名不能为空'
                    }
                }
            };

            // if (userName == '' || passwd == '') {
            // 	error('请输入用户名和密码！');
            // 	return;
            // }

            let isValidate = baseValidate($('#wrap'), constraints);
            if (!isValidate) {
                passwd = md5(passwd).toUpperCase();
                this.props.userLogin(userName, passwd);
            }
            if (this.props.login.loginData.code == 0) {
                usermanageService.readUsermanages();
                this.props.userRole(userName);
                if (this.props.login.userRolePermission.code == 0) {
                    // window.location.href = window.location.href;
                    window.location.reload();
                }
            }
        } else if (this.props.login.isActive.code == 0 && this.props.login.isActive.result.detail.status == 2) {
            error('系统许可已到期，请重新激活！')
        }
    }

    componentWillMount() {
        this.props.getActive();
    }
    componentWillUpdate() {
        this.props.getActive();
    }

    componentDidMount() {
        require('../../../static/canvas-nest');
        $('#flash > div').mousemove(function (e) {
            e.stopPropagation();
        });
        $('#content').removeClass(' animated').addClass(' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated');
        });

        document.addEventListener('keydown', (e) => {
            if (e && e.keyCode == 13) {
                this.login();
            }
        });
        if (this.props.login.isActive.code == 0 && this.props.login.isActive.result.detail.status != 1) {
            this.setState({
                display: 'block'
            })
        }
        this.refs.userName.focus();
    }
    // 弹窗DOM 
    activation() {
        let modalDom = <div className="activation-wrap">
			<div style={{margin: '10px 0', fontSize: '16px'}}>如果您的License使用期限不足，您可以由下导入新的License。</div>
			<div id="uploadId"></div>

			<a download="aus-uuid" href="./aus-uuid.dat">点击下载UUID文件</a><br/>
		</div>
        this.refs.activation.setContent(modalDom);

    }

    loadModalControlHandler() {
        let that = this;
        uploadObj = $('#uploadId').uploadFile({
            url: '/LicenseManager/uploadLicenseFile',
            // autoSubmit: false,
            multiple: false,
            maxFileCount: 1,
            showDone: false,
            showPreview: false,
            returnType: 'json',
            fileName: 'aus-license',
            dragDrop: false,
            showProgress: true,
            showFileCounter: false,
            uploadStr: '选择LICENSE',
            cancelStr: '取消',
            extErrorStr: '是不允许的，只接受扩展名为：',
            onSuccess(files, xhr) {
                if (xhr.code == 0) {
                    alert('上传成功！');
                    $('#activation').modal('hide');
                    $('.ajax-file-upload-container').empty();
                    that.props.licenseUpload(xhr);
                } else {
                    error(xhr.msg);
                    $('.ajax-file-upload-container').empty();
                    $('#activation').modal('hide');
                }
            },
            onError() {
                alert('上传失败！');
                $('#activation').modal('hide');
                $('.ajax-file-upload-container').empty();
            }
        });
        return uploadObj;
    }

    // 确定激活
    activationOKHandler() {
        uploadObj.startUpload();
    }


    render() {
        return (
			<div id="wrap">
                <div className="header"></div>
				<div className="login row" style={{ position: 'relative' }} id="flash">
					<div style={{width: '1200px', margin: '0 auto', zIndex: 1}}>
						<div className="form-box col-md-12 bounceIn" id="content">
							<div className="xdata-img col-md-7 col-sm-12 col-xs-12">
								<div className="col-md-12 col-sm-7 col-xs-7 img">
									<img style={{ width: '100%' }} className="col-md-12 col-sm-12 col-xs-12" src={ require('../../assets/img/login.png') }/>
								</div>
							</div>
							<div className="col-md-2 col-sm-0 col-xs-0"></div>
							<div className="col-md-3 col-sm-12 col-xs-12 row login-container">
								<div className="form-login col-md-12 col-sm-6 col-xs-6 row">
									<h3>用户登录</h3>
									<div className="form-group" style={{position: 'relative', overflow: 'hidden', margin: 0}}>
										<input type="text" ref="userName" maxLength={20} name="userName" className="col-md-12 col-sm-12 col-xs-12 form-control" placeholder="用户名" />
										<span className="messages" style={{position: 'absolute', right: 0}}></span>
									</div>
									<div className="form-group" style={{position: 'relative', overflow: 'hidden', margin: 0}}>
										<input type="password" maxLength={20} ref="passwd" name="passwd" className="col-md-12 col-sm-12 col-xs-12 form-control" placeholder="密码" />
										<span className="messages" style={{position: 'absolute', right: 0}}></span>
									</div>
									<button className="btn btn-primary col-md-12 col-sm-12 col-xs-12" ref="save" onClick={this.login} >登录</button>
									<a href="#" className="activation" ref="activation" data-toggle="modal" data-target="#activation" style={{float: 'right', padding: '0 10px', fontSize: '15px', display: this.state.display, marginBottom: '10px'}} onClick={this.activation} >激活</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Modal modalId="activation" button='noButton' ref='activation' title="用户激活" okHandler={ this.activationOKHandler } loadModalControlHandler = {this.loadModalControlHandler} />
				<Footer />
			</div>
        )
    }
}
export default Login;
