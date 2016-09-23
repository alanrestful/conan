require("../index.scss");

import React from "react";
import { Card, Icon, Modal, Form, Input, Select, Button } from "antd";

const FormItem = Form.Item,
      Option = Select.Option;

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

  handleOk() {
    this.setState({ confirmLoading: true });
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  modalContext() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem { ...formItemLayout } label="项目">
          <Select defaultValue="jidd">
            <Option value="jidd">水泥</Option>
            <Option value="conan">柯南</Option>
            <Option value="xinyi">滚筒洗衣机</Option>
            <Option value="" disabled>更多...</Option>
          </Select>
        </FormItem>
        <FormItem { ...formItemLayout } label="环境">
          <Select defaultValue="test">
            <Option value="test">测试</Option>
            <Option value="production">生产</Option>
          </Select>
        </FormItem>
        <FormItem { ...formItemLayout } label="IP地址">
          <Input placeholder="服务端IP地址" />
        </FormItem>
        <FormItem { ...formItemLayout } label="设备">
          <Select defaultValue="chrome">
            <Option value="chrome">Chrome</Option>
            <Option value="Firefox">Firefox</Option>
            <Option value="Webview">Webview</Option>
            <Option value="" disabled>更多...</Option>
          </Select>
        </FormItem>
        <FormItem { ...formItemLayout } label="日志级别">
          <Select defaultValue="warning">
            <Option value="info">Info</Option>
            <Option value="warning">Warning</Option>
            <Option value="error">Error</Option>
          </Select>
        </FormItem>
      </Form>
    )
  }

  handleSubmit() {}

  render() {
    return (
      <div>
        <Card title="设置" extra={ <a href="#" onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a> } className="panel">
        </Card>
        <Modal title="设置" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
            { this.modalContext.call(this) }
        </Modal>
      </div>
    )
  }
}
