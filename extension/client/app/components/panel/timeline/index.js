require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import { Card, Timeline, Icon, Popconfirm, Checkbox, Button, notification } from "antd";

import { isEmpty } from "../../../static/scripts/helpers";

import Spin from "../../common/spin/index";
import EditInSitu from "../../common/edit_in_situ/index";

import CreatesModal from "./modals/creates";

const TimelineItem = Timeline.Item;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: {},
      actions: [],
      selectedActions: {},
      createsModalVisible: false
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
  playIt() {
    let pages = this.state.pages,
        selectedActions = this.state.selectedActions,
        page = {},
        actions = [];
    for(let k of Object.keys(selectedActions)) {
      page = pages[k];
      for(let key of Object.keys(selectedActions[k])) {
        actions.push(pages[k].tArray[0][key]);
      }
    }
    this.props.playback({ ...page, tArray: actions });
    notification.success({
      message: "提示",
      description: "所选用例已经开始尝试执行，请耐心等待执行结果！（大误）"
    });
  }

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

  showCreatesModal() {
    this.setState({
      createsModalVisible: true
    });
  }

  closeCreatesModal() {
    this.setState({
      createsModalVisible: false
    });
  }

  createsModalSubmit(data) {
    this.props.createGroups({
      ...data,
      fragment: JSON.stringify(this.state.selectedActions),
      pid: this.props.project.id
    });
  }

  confirm() {
    // message.success('点击了确定');
  }

  timelineItem(actions) {
    return actions.map((v, i) => {
      return (
        <TimelineItem key={i} dot={ <Checkbox key={v.baseURI + i} onChange={ this.selectedAction.bind(this, v, i) } /> }>
          <div className="time"><Icon type="clock-circle-o" /> { moment(v.inDate).format("YYYY-MM-DD HH:mm:ss") }</div>
          <div className="action">
            <span className="address" title={ `xPath: ${ v.xPath }` }><Icon type="environment-o" /> { v.xPath }</span>
            { v.className ? <span className="tagname" title={ `Class Name: ${ v.className }` }><Icon type="tag-o" /> { v.className }</span> : null }
            { v.id ? <span className="tagname" title={ `ID: ${ v.id }` }><Icon type="tags-o" /> { v.id }</span> : null }
            { v.name ? <span className="tagname" title={ `Name: ${ v.name }` }><Icon type="eye-o" /> { v.name }</span> : null }
            { v.type ? <span className="tagname" title={ `Type: ${ v.type }` }><Icon type="file-unknown" /> { v.type }</span> : null }
            { v.tagName ? <span className="tagname" title={ `Tag Name: ${ v.tagName }` }><Icon type="setting" /> { v.tagName }</span> : null }
            { v.value ? <span className="value" title={ `Value: ${ v.type == "password" ? v.value.replace(/./g, "*") : v.value }` }><Icon type="book" /> { v.type == "password" ? v.value.replace(/./g, "*") : v.value }</span> : null }
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

  selectedAction(action, index) {
    let selectedPageIndex = this.props.selectedPageIndex,
        selectedActions = this.state.selectedActions,
        actions = selectedActions[ selectedPageIndex ] || [];
    if(actions.includes(index)) {
      actions.splice(actions.indexOf(index), 1);
    } else {
      actions = [ ...actions, index ]
    }
    if(isEmpty(actions)) {
      delete selectedActions[ selectedPageIndex ];
    } else {
      selectedActions[ selectedPageIndex ] = actions;
    }
    // this.setState({
    //   selectedActions
    // });

    this.props.changeSelectedActions(selectedActions);
  }

  render() {
    let page = this.state.page,
        actions = this.state.actions;
    return (
      <div>
        <Card title={ page.url || "动作" } extra={ isEmpty(page) ? null : <span>{ isEmpty(this.state.selectedActions) ? null : <span><a onClick={ this.playIt.bind(this) }><Icon type="play-circle-o" /> 回放</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showCreatesModal.bind(this) }><Icon type="plus-circle-o" /> 创建</a>&nbsp;&nbsp;&nbsp;&nbsp;</span> }<a onClick={ this.showEditInSitu.bind(this, undefined) }><Icon type="exclamation-circle-o" /> 预期</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel timeline">
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
        <CreatesModal selectedActions={ this.state.selectedActions } visible={ this.state.createsModalVisible } onSubmit={ this.createsModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
      </div>
    )
  }
}
