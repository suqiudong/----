/**
 *角色列表组件
 * User: jiaomx
 * Date: 2017/5/23
 * Time: 14:40
 */

import React, { Component } from 'react';
import {Link} from 'react-router';
import { success } from '../../utils/notification';

class InstallChoice extends Component {
    constructor(props) {
        super(props);
        this.install = this.install.bind(this);
    }

    componentWillMount() {
        //
    }

    componentDidUpdate() {
        //
    }

    install () {
        console.log('install');
        success('安装成功！')
    }

    render() {
        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title"></h3>
                    </div>
                    <div className="box-body">
                        <div className="portlet light" style={{ margin: '150px 0' }}>
                            <div className="row">
                                <div className="col-md-4 col-md-offset-4">
                                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ this.install }>一键安装</button>
                                </div>
                            </div>
                            <div className="row" style={{ marginTop: '30px' }}>
                                <div className="col-md-4 col-md-offset-4">
                                    <Link to="/install">
                                        <button type="button" className="btn btn-default btn-lg btn-block">安装向导</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default InstallChoice;
