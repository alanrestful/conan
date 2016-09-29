import React from "react";
import { Modal, Form, Input, Button, Alert } from "antd";

const FormItem = Form.Item;

export default Form.create()(class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
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
      confirmLoading: false
    });
    this.props.onClose();
  }

  handleSubmit() {
    this.props.onSubmit();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal title="设置" visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>取 消</Button>, <Button key="submit" type="primary" size="large" loading={ this.state.confirmLoading } onClick={ this.handleOk.bind(this) }>创 建</Button>, <Button key="continue" type="primary" size="large" loading={ this.state.continueLoading } onClick={ this.handleContinue.bind(this) }>创建并执行</Button>] }>
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
      </Modal>
    )
  }
})
