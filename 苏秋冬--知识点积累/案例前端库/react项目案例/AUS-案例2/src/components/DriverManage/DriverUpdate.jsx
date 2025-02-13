/**
 *插件更新组件
 * User: jiaomx
 * Date: 2017/02/20
 * Time: 13:20
 */

import React, { Component } from 'react';
import { error, success } from 'UTIL/notification';
class DriverUpdate extends Component {
	constructor(props) {
        super(props);
        this.returnHander = this.returnHander.bind(this);
        this.installHander = this.installHander.bind(this);
    }
    componentWillMount() {
        // let driverName = this.props.driverManage.driverData.driverName;
        let driverName = this.props.params.driverName;
        this.props.lastDriverInfo(driverName);
        this.props.driverManage.fileInfo = {};
    }

    componentWillUpdate() {
        // let driverName = this.props.driverManage.driverData.driverName;
        let driverName = this.props.params.driverName;
        this.props.lastDriverInfo(driverName);
    }

    componentDidMount() {
      // let opations = {};
      //   opations.obj = $('#upload');
      //   opations.maxFileCount = 1;
      //   opations.autoSubmit = false;
      //   opations.showDone = false;
      //   opations.showPreview = false;
      //   opations.allowedTypes = 'dat';
      //   opations.fileName = 'aus-license';
      //   opations.dragDrop = false;
      //   opations.showProgress = true;
      //   opations.uploadStr = '插件上传';
      //   opations.cancelStr = '取消';
      //   opations.extErrorStr = '是不允许的，只接受扩展名为：';
        let that = this;
        $('#upload').uploadFile({
            url: '/DriverManager/upload',
            maxFileCount: 1,
            showDone: false,
            showPreview: false,
            dragDrop: false,
            showProgress: true,
            showFileCounter: false,
            acceptFiles: 'aplication/zip',
            fileName: 'driverFile',
            uploadStr: '插件上传',
            abortStr: '移除',
            cancelStr: '取消',
            returnType: 'json',
            extErrorStr: '文件上传错误，只接受扩展名为：*.zip 的文件',
            showQueueDiv: 'output',
            onSuccess(files, xhr) {
                $('.ajax-file-upload-container').hide();
                if (xhr.code == 0) {
                    success('上传成功！');
                    $('#output').empty();
                    $('.uploadbtn').hide();
                    $('.uploadfilename').append(files[0]);
                    that.props.driverFileInfo(xhr);
                } else if (xhr.code == '302') {
                    error(xhr.msg);
                    setTimeout(function() {
                        sessionStorage.removeItem('XDataUserName');
                        sessionStorage.removeItem('userRolePermission');
                        window.location.replace('/');
                    }, 1000);
                } else {
                    error(xhr.msg);
                    $('.uploadbtn').show();
                    // setTimeout(() => {window.location.reload()}, 1000);
                }
            },
            onError() {
                error('上传失败！');
                $('.ajax-file-upload-container').hide();
                $('#output').empty();
            }
        });
    }

   
    uploadHandler(e) {
        e.stopPropagation();
        $('#upload input').click();
    }

   
    returnHander() {
        this.props.history.replace('/driver');
    }

    installHander() {
        let that = this;
        let install = this.props.driverManage.fileInfo.result;
        let opType = this.props.driverManage.opType;
        if (this.props.driverManage.isUse.result) {
            install.opType = opType;
        }
        this.props.driverUpdate(install);
        if (this.props.driverManage.isUpdateSuccess.code == 0) {
            setTimeout(() => {that.props.history.replace('/driver')}, 1000);
        }
    }
   
	render() {
        let tpl;
        if (this.props.driverManage.fileInfo.code == 0) {
            tpl = <button type="submit" className="btn btn-primary" onClick={ this.installHander}>Install</button>
        }
		return (
			<div id="driverUpdate">
                 <div className="box box-primary" id="pluginAdd">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box-header">
                                <h4>上传插件</h4>
                                <div className="uploadStr" onClick={this.uploadHandler}>
                                    <span className="uploadfilename"></span>
                                    <div className="uploadbtn">
                                        <i className="fa fa-upload"></i> 点击上传驱动
                                    </div>
                                    <div id="upload"></div>
                                </div>
                                <div id="output"></div>
                            </div>
                            <div className="box-body">
                                <div><span>插件名：</span><p>{this.props.driverManage.lastDriverData.result.detail.driverName}</p></div>
                                <div><span>jar包名：</span><p>{this.props.driverManage.lastDriverData.result.detail.jarName}</p></div>
                                <div><span>所有者：</span><p>{this.props.driverManage.lastDriverData.result.detail.owner}</p></div>
                                <div><span>开发者：</span><p>{this.props.driverManage.lastDriverData.result.detail.developer}</p></div>
                                <div><span>描述信息：</span><p>{this.props.driverManage.lastDriverData.result.detail.description}</p></div>
                                <div><span>版本号：</span><p>{this.props.driverManage.lastDriverData.result.detail.version}</p></div>
                            </div>
                            <div className="box-footer">
                                <div>
                                    <button type="submit" className="btn btn-primary" style={{marginRight: '20px'}} onClick={ this.returnHander}>返回</button>
                                    {tpl}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
		)
	}
}
export default DriverUpdate;
