require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import { Card, Timeline, Icon, Modal, Form, Input, Select, Checkbox, Button, Alert, Popconfirm } from "antd";

import { isEmpty } from "../../../static/scripts/helpers";

import Spin from "../../common/spin/index";
import EditInSitu from "../../common/edit_in_situ/index";

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
    let pages = nextProps.pages,
        index = nextProps.selectedPageIndex,
        action = nextProps.action;
    if(index == undefined) {
      return false;
    }
    let page = pages[index];
    this.setState({
      pages,
      page,
      actions: action ? [ ...page.tArray[0], action ] : page.tArray ? page.tArray[0] : []
    });
  }

  /**
   * 回放
   * @return {[type]} [description]
   */
  playIt() {}

  /**
   * 显示编辑 预期 的文本框
   * @param  {Int} index 索引
   * @return {[type]}       [description]
   */
  showEditInSitu(index) {
    this.expectCommon(index, {
      expectEditing: true
    });
  }

  /**
   * 编辑 预期 完成
   * @param  {Int} index 索引
   * @param  {String} value 值
   * @return {[type]}       [description]
   */
  editOnEnter(index, value) {
    this.expectCommon(index, {
      expect: value,
      expectEditing: false
    });
  }

  /**
   * 取消编辑 预期
   * @param  {Int} index 索引
   * @return {[type]}       [description]
   */
  editOnCancel(index) {
    this.expectCommon(index, {
      expectEditing: false
    });
  }

  /**
   * 删除 预期
   * @param  {Int} index 索引
   * @return {[type]}       [description]
   */
  deleteExpect(index) {
    this.expectCommon(index, {
      expect: undefined,
      expectEditing: false
    });
  }

  /**
   * 对 预期 操作的通用方法
   * @param  {Int} index  索引
   * @param  {String} expect 值
   * @return {[type]}        [description]
   */
  expectCommon(index, expect) {
    if(index === undefined) {
      this.setState({
        page: { ...this.state.page, ...expect }
      });
    } else {
      this.setState({
        actions: this.state.actions.map((v, i) => {
          return i == index ? { ...v, ...expect } : v;
        })
      });
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
      <Form horizontal onSubmit={ this.handleSubmit.bind(this) }>
        <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 14, offset: 6 }} help=" ">
          <Alert message={ `当前有${ this.state.selectedActions.length }个选项被选中！` } type="info" showIcon />
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
        <TimelineItem key={i} dot={ <Checkbox key={v.baseURI + i} onChange={ this.selectedAction.bind(this, i) } /> }>
          <div className="time"><Icon type="clock-circle-o" /> { moment(v.inDate).format("YYYY-MM-DD HH:mm:ss") }</div>
          <div className="action">
            <span className="address" title={ `xPath: ${ v.xPath }` }><Icon type="environment-o" /> { v.xPath }</span>
            { v.className ? <span className="tagname" title={ `Class Name: ${ v.className }` }><Icon type="tag-o" /> { v.className }</span> : null }
            { v.id ? <span className="tagname" title={ `ID: ${ v.id }` }><Icon type="tags-o" /> { v.id }</span> : null }
            { v.name ? <span className="tagname" title={ `Name: ${ v.name }` }><Icon type="eye-o" /> { v.name }</span> : null }
            { v.type ? <span className="tagname" title={ `Type: ${ v.type }` }><Icon type="file-unknown" /> { v.type }</span> : null }
            { v.tagName ? <span className="tagname" title={ `Tag Name: ${ v.tagName }` }><Icon type="setting" /> { v.tagName }</span> : null }
            { v.value ? <span className="value" title={ `Value: ${ v.value }` }><Icon type="book" /> { v.value }</span> : null }
          </div>
          {
            v.expectEditing ? <EditInSitu value={ v.expect } onEnter={ this.editOnEnter.bind(this, i) } onCancel={ this.editOnCancel.bind(this, i) } /> : v.expect ? (
              <div className="group-result small error clearfix">
                <span className="group-result-info">预期结果：{ v.expect }</span>
                <span className="group-result-control">
                  <a onClick={ this.showEditInSitu.bind(this, i) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deleteExpect.bind(this, i) }>
                    <a><Icon type="cross-circle-o" /> 删除</a>
                  </Popconfirm>
                </span>
              </div>
            ) : <div className="control"><Button size="small" onClick={ this.showEditInSitu.bind(this, i) }>预期</Button> { v.isFormEl ? null : <Button size="small">代码</Button> }</div>
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
    let page = this.state.page,
        actions = this.state.actions;
    return (
      <div>
        <Card title={ page.url || "动作" } extra={ isEmpty(page) ? null : <span>{ isEmpty(this.state.selectedActions) ? null : <span><a onClick={ this.playIt.bind(this) }><Icon type="play-circle-o" /> 回放</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showModal.bind(this) }><Icon type="plus-circle-o" /> 创建</a>&nbsp;&nbsp;&nbsp;&nbsp;</span> }<a onClick={ this.showEditInSitu.bind(this, undefined) }><Icon type="exclamation-circle-o" /> 预期</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel timeline">
          {
            page.expectEditing ? <EditInSitu value={ page.expect } onEnter={ this.editOnEnter.bind(this, undefined) } onCancel={ this.editOnCancel.bind(this, undefined) } /> : page.expect ? (
              <div className="group-result clearfix">
                <span className="group-result-info">预期结果：{ page.expect }</span>
                <span className="group-result-control">
                  <a onClick={ this.showEditInSitu.bind(this, undefined) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deleteExpect.bind(this, undefined) }>
                    <a><Icon type="cross-circle-o" /> 删除</a>
                  </Popconfirm>
                </span>
              </div>
            ) : null
          }
          <Timeline>
          {
            isEmpty(actions) ? <Spin done text="您还没有选择一个页面，或者当前页面暂无数据~" /> : this.timelineItem(actions)
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
