require("../index.scss");
require("./index.scss");

import React from "react";
import { Card, Timeline, Icon, Modal, Form, Input, Select, Checkbox, Button, Alert, Popconfirm } from "antd";

import Spin from "../../common/spin/index";

const FormItem = Form.Item,
      Option = Select.Option,
      TimelineItem = Timeline.Item;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: {},
      actions: [],
      selectedActions: [],
      visible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.selectedPage,
      actions: nextProps.selectedPage.tArray
    });
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

  timelineItem(actions) {
    return actions.map((v, i) => {
      return (
        <TimelineItem key={i} dot={ <Checkbox onChange={ this.selectedAction.bind(this, i) } /> }>
          <div className="time"><Icon type="clock-circle-o" /> { v.createAt }</div>
          <div className="action"><span className="address"><Icon type="environment-o" /> { v.xPath }</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="tagname"><Icon type="setting" /> { v.tagName }</span>&nbsp;&nbsp;&nbsp;&nbsp;{ v.value ? <span className="value"><Icon type="book" /> { v.value }</span> : null }</div>
          {
            v.isFormEl ? (
              <div className="group-result small error clearfix">
                <span className="group-result-info">预期结果：以下报错均出现</span>
                <span className="group-result-control">
                  <a onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                    <a><Icon type="cross-circle-o" /> 删除</a>
                  </Popconfirm>
                </span>
              </div>
            ) : <div className="control"><Button size="small">JSON</Button></div>
          }

        </TimelineItem>
      )
    })
  }

  selectedAction(index) {
    let actions = this.state.selectedActions;
    if(actions.includes(index)) {
      actions.splice(actions.indexOf(index), 1);
    } else {
      actions = [ ...actions, index ]
    }
    this.setState({
      selectedActions: actions
    });
  }

  render() {
    let actions = this.state.actions;
    return (
      <div>
        <Card title={this.state.page.url || "动作"} extra={ <span>{ this.state.selectedActions.length ? <span><a onClick={ this.showModal.bind(this) }><Icon type="play-circle-o" /> 回放</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showModal.bind(this) }><Icon type="plus-circle-o" /> 创建</a>&nbsp;&nbsp;&nbsp;&nbsp;</span> : null }<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel timeline">
          <div className="group-result clearfix">
            <span className="group-result-info">预期结果：以下报错均出现</span>
            <span className="group-result-control">
              <a onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                <a><Icon type="cross-circle-o" /> 删除</a>
              </Popconfirm>
            </span>
          </div>
          <Timeline>
          {
            actions.length ? this.timelineItem(actions) : <Spin done text="您还没有选择一个页面，或者当前页面暂无数据~" />
          }
          </Timeline>
        </Card>
        <Modal title="创建用例或模板" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
            { this.modalContext.call(this) }
        </Modal>
      </div>
    )
  }
}
