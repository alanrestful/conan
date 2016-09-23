require("../index.scss");
require("./index.scss");

import React from "react";
import { Card, Timeline, Icon, Modal, Form, Input, Select, Checkbox, Button, Alert, Popconfirm } from "antd";

const FormItem = Form.Item,
      Option = Select.Option,
      TimelineItem = Timeline.Item;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillMount() {
    this.props.getData();
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
        <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 14, offset: 6 }} help=" ">
          <Alert message="当前有4个选项被选中！" type="info" showIcon />
        </FormItem>
        <FormItem { ...formItemLayout } label="模板组">
          <Input placeholder="查询模板组" />
        </FormItem>
        <FormItem { ...formItemLayout } label="模板名称">
          <Input placeholder="模板名称" />
        </FormItem>
        <FormItem { ...formItemLayout } label="用例组">
          <Input placeholder="查询用例组" />
        </FormItem>
        <FormItem { ...formItemLayout } label="用例名称">
          <Input placeholder="用例名称" />
        </FormItem>
      </Form>
    )
  }

  handleSubmit() {}

  confirm() {
    // message.success('点击了确定');
  }

  updateSelected() {}

  render() {
    return (
      <div>
        <Card title="Title" extra={ <span><a href="#" onClick={ this.showModal.bind(this) }><Icon type="play-circle-o" /> 回放</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick={ this.showModal.bind(this) }><Icon type="plus-circle-o" /> 创建</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a href="#"><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel timeline">
          <div className="group-result clearfix">
            <span className="group-result-info">预期结果：以下报错均出现</span>
            <span className="group-result-control">
              <a href="#" onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                <a href="#"><Icon type="cross-circle-o" /> 删除</a>
              </Popconfirm>
            </span>
          </div>
          <Timeline>
            <TimelineItem key={1} dot={ <Checkbox onChange={ this.updateSelected.bind(this) } /> }>初步排除网络异常 2015-09-01</TimelineItem>
            <TimelineItem key={2} dot={ <Checkbox onChange={ this.updateSelected.bind(this) } /> }>技术测试异常 2015-09-01</TimelineItem>
            <TimelineItem key={3} dot={ <Checkbox onChange={ this.updateSelected.bind(this) } /> }>网络异常正在修复 2015-09-01</TimelineItem>
          </Timeline>
        </Card>
        <Modal title="创建用例或模板" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
            { this.modalContext.call(this) }
        </Modal>
      </div>
    )
  }
}
