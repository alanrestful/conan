require("./index.scss");

import React from "react";
import { Card, Icon, Popconfirm, Button, Row, Col, Checkbox } from "antd";

import { isEmpty } from "../../../static/scripts/helpers";

import Search from "../../common/search/index";
import Spin from "../../common/spin/index";
import EditInSitu from "../../common/edit_in_situ/index";
import CreateCaseModal from "./modals/create_case";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createCaseModalVisible: false
    }
  }

  showCreateCaseModal() {
    this.setState({
      createCaseModalVisible: true
    });
  }

  closeCreatesModal() {
    this.setState({
      createCaseModalVisible: false
    });
  }

  createCaseModalSubmit() {}

  confirm() {}

  changeGroupSelected() {}

  render() {
    return (
      <div>
        <Card title="商品模块 125个模板" extra={ <span><a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="plus-circle-o" /> 创建用例</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel">
          <Row className="group-detail">
            <Col span={10} className="group-list-wrapper">
              <div className="group-search"><Search /></div>
              <ul className="group-list">
                <li>
                  <Checkbox onChange={ this.changeGroupSelected.bind(this) }>
                    <p className="link">http://www.baidu.com/</p>
                    <p className="time"><Icon type="clock-circle-o" /> 2016-09-21 10:12:22 &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                  </Checkbox>
                </li>
              </ul>
            </Col>
            <Col span={14} className="group-item">
              <div className="group-item-title clearfix">
                <h4>das</h4>
                <Button size="small">json</Button>
              </div>
              <div className="group-result clearfix">
                <span className="group-result-info">预期结果：以下报错均出现</span>
                <span className="group-result-control">
                  <a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                    <a><Icon type="cross-circle-o" /> 删除</a>
                  </Popconfirm>
                </span>
              </div>
              <ul className="action-line">
                <li className="clearfix">
                  <span className="index">1.</span>
                  <span className="action-content-wrap">
                    <span className="action-content">
                      <div><span className="address"><Icon type="environment-o" /> //*[@id='button']</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="action"><Icon type="setting" /> click</span></div>
                      <div><Button size="small">Comment</Button></div>
                    </span>
                  </span>
                </li>
                <li className="clearfix">
                  <span className="index">2.</span>
                  <span className="action-content-wrap">
                    <span className="action-content">
                      <div><span className="address"><Icon type="environment-o" /> //*[@id='button']</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="action"><Icon type="setting" /> click</span></div>
                      <div className="group-result small error clearfix">
                        <span className="group-result-info">预期结果：以下报错均出现</span>
                        <span className="group-result-control">
                          <a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                            <a><Icon type="cross-circle-o" /> 删除</a>
                          </Popconfirm>
                        </span>
                      </div>
                    </span>
                  </span>
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
        <CreateCaseModal visible={ this.state.createCaseModalVisible } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
      </div>
    )
  }
}
