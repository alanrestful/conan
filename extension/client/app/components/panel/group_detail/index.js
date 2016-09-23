require("./index.scss");

import React from "react";
import { Card, Modal, Icon, Form, Input, Popconfirm, Alert, Button, Row, Col, Checkbox } from "antd";

import Search from "../../common/search/index";

const FormItem = Form.Item;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  showModal() {
    this.setState({ visible: true });
  }

  handleContinue() {
    this.setState({ continueLoading: true });
  }

  handleOk() {
    this.setState({ confirmLoading: true });
  }

  handleCancel() {
    this.setState({
      continueLoading: false,
      confirmLoading: false,
      visible: false
    });
  }

  modalContext() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 14, offset: 6 }} help=" ">
          <Alert message="当前有4个选项被选中！" type="info" showIcon />
        </FormItem>
        <FormItem { ...formItemLayout } label="用例组">
          <Input placeholder="查询用例组" />
        </FormItem>
        <FormItem { ...formItemLayout } label="用例名称">
          <Input placeholder="用例名称" />
        </FormItem>
        <FormItem { ...formItemLayout } label="数据">
          <Input type="textarea" placeholder="数据" />
        </FormItem>
      </Form>
    )
  }

  handleSubmit() {}

  confirm() {}

  changeGroupSelected() {}

  render() {
    return (
      <div>
        <Card title="商品模块 125个模板" extra={ <span><a href="#" onClick={ this.showModal.bind(this) }><Icon type="plus-circle-o" /> 创建用例</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a href="#"><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel">
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
                  <a href="#" onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                    <a href="#"><Icon type="cross-circle-o" /> 删除</a>
                  </Popconfirm>
                </span>
              </div>
              <ul className="action-line">
                <li>
                  <span className="action-layout index">1.</span>
                  <span className="action-layout">
                    <div><span className="address"><Icon type="environment-o" /> //*[@id='button']</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="action"><Icon type="setting" /> click</span></div>
                    <div><Button size="small">Comment</Button></div>
                  </span>
                </li>
                <li>
                  <span className="index">2.</span>
                  <span className="action-layout">
                    <div><span className="address"><Icon type="environment-o" /> //*[@id='button']</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="action"><Icon type="setting" /> click</span></div>
                    <div className="group-result small error clearfix">
                      <span className="group-result-info">预期结果：以下报错均出现</span>
                      <span className="group-result-control">
                        <a href="#" onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                          <a href="#"><Icon type="cross-circle-o" /> 删除</a>
                        </Popconfirm>
                      </span>
                    </div>
                  </span>
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
        <Modal title="设置" visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>返 回</Button>, <Button key="submit" type="primary" size="large" loading={ this.state.confirmLoading } onClick={ this.handleOk.bind(this) }>创 建</Button>, <Button key="continue" type="primary" size="large" loading={ this.state.continueLoading } onClick={ this.handleContinue.bind(this) }>创建并执行</Button>] }>
            { this.modalContext.call(this) }
        </Modal>
      </div>
    )
  }
}
