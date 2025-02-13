/**
 * 模态窗组件
 * User: gaogy
 * Date: 2016/12/16
 * Time: 11:27
 */
import React, { Component } from 'react';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };

        this.okHandler = this.okHandler.bind(this);
        this.safeokHandler = this.safeokHandler.bind(this);
        this.setContent = this.setContent.bind(this);
    }

    // 弹窗确认事件
    okHandler() {
        this.props.okHandler();
    }
    safeokHandler() {
        this.props.safeokHandler();
    }

    // 设置弹窗内容方法
    setContent(msg) {
        this.setState({
            content: msg
        })
    }

    componentDidUpdate() {
        if (this.props.loadModalControlHandler) {
            this.props.loadModalControlHandler();
        }
    }

    render() {
        let modalFooter;
        if (this.props.button == 'threeButton') {
            modalFooter = <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ this.props.cancelBtn || '取消' }</button>
                                <button type="button" onClick={ this.okHandler } className="btn btn-primary">{ this.props.okBtn || '确认' }</button>
                                <button type="button" onClick={ this.safeokHandler } className="btn btn-primary">{ this.props.safeokBtn || '确认' }</button>
                            </div>
        }else if (this.props.button == 'noButton') {
            modalFooter = '';

        }else if (this.props.button == 'oneButton') {
            modalFooter = <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ this.props.cancelBtn || '取消' }</button>
                            </div>
        }else {
            modalFooter = <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ this.props.cancelBtn || '取消' }</button>
                                <button type="button" onClick={ this.okHandler } className="btn btn-primary">{ this.props.okBtn || '确认' }</button>
                            </div>
        }
        return (
            <div id={ this.props.modalId } className="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document" style={{ width: this.props.width || 'auto'}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">{ this.props.title }</h4>
                        </div>
                        <div className="modal-body">
                            <p style={{ wordWrap: 'break-word' }}>{ this.state.content }</p>
                        </div>
                        {modalFooter}
                    </div>
                </div>
            </div>
        )
    }
}
export default Modal;
