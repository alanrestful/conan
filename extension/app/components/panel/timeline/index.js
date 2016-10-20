require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Timeline, Icon, Popconfirm, Checkbox, Button, notification, message } from "antd";

import Spin from "common/spin";
import EditInSitu from "common/edit_in_situ";
import CreatesModal from "./modals/creates";
import ViewjsonModal from "../modals/viewjson";
import { playback, createGroups, deletePage, changeSelectedActions } from "actions/actions";
import { isEmpty } from "scripts/helpers";

const TimelineItem = Timeline.Item;

@pureRender
@connect(state => ({
  pages: state.actions.pages,
  selectedPageIndex: state.actions.selectedPageIndex,
  action: state.actions.action,
  selectedActionIndexs: state.actions.selectedActionIndexs,
  project: state.projects.project
}), dispatch => bindActionCreators({ playback, createGroups, deletePage, changeSelectedActions }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      jsons: "",
      selectedActionIndexs: {},
      createsModalVisible: false,
      viewjsonModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedPageIndex == undefined) {
      return false;
    }
    this.setState({
      pages: nextProps.pages,
      selectedActionIndexs: nextProps.selectedActionIndexs || {}
    });
  }

  /**
   * 回放
   * @return {[type]} [description]
   */
  playIt() {
    let selectedActions = this.convertSelectedActions(),
        actions;
    selectedActions.map((v, i) => {
      if(i) {
        actions.tArray = [ ...actions.tArray, ...v.tArray ];
      } else {
        actions = v;
      }
    });
    this.props.playback({ ...actions, tArray: [actions.tArray] });
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
    let pageIndex = this.props.selectedPageIndex,
        pages = this.state.pages,
        currentPage = pages[pageIndex];
    if(index === undefined) {
       pages[pageIndex] = { ...currentPage, ...expect }
    } else {
      pages[pageIndex].tArray = [ currentPage.tArray[0].map((v, i) => i == index ? { ...v, ...expect } : v) ];
    }
    this.setState({
      pages
    });
  }

  /**
   * 显示创建模板的对话框
   * @return {[type]} [description]
   */
  showCreatesModal() {
    this.setState({
      createsModalVisible: true
    });
  }

  /**
   * 关闭创建模板的对话框
   * @return {[type]} [description]
   */
  closeCreatesModal() {
    this.setState({
      createsModalVisible: false
    });
  }

  /**
   * 提交创建模板的数据
   * @param  {Object} data 模板数据
   * @return {[type]}      [description]
   */
  createsModalSubmit(data) {
    this.props.createGroups({
      ...data,
      fragment: JSON.stringify(this.convertSelectedActions()),
      pid: this.props.project.id
    });
    message.success("模板创建成功！");
  }

  /**
   * 删除页面
   * @return {[type]} [description]
   */
  deletePage() {
    this.props.deletePage(this.props.selectedPageIndex, this.state.pages, () => message.success("页面删除成功！"));
  }

  viewJson(index) {
    let pageIndex = this.props.selectedPageIndex,
        pages = this.state.pages,
        actions = [ ...pages[pageIndex].tArray[0] ],
        jsons = [];
    actions = actions.splice(0, 1 + index).reverse();
    for(let i = 0; i < actions.length; i ++) {
      let action = actions[i];
      if(action.isFormEl || !i){
        jsons.push(action);
      } else {
        break;
      }
    }
    this.setState({
      viewjsonModalVisible: true,
      jsons: JSON.stringify(jsons.reverse(), null, 2)
    });
  }

  closeViewjsonModal() {
    this.setState({
      viewjsonModalVisible: false
    })
  }

  timelineItem(actions) {
    let actionIndexs = this.state.selectedActionIndexs[this.props.selectedPageIndex] || [];
    return actions.map((v, i) => {
      return (
        <TimelineItem key={ i } dot={ <Checkbox onChange={ this.selectedAction.bind(this, v, i) } checked={ actionIndexs.includes(i) } /> }>
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
            ) : <div className="control"><Button size="small" onClick={ this.showEditInSitu.bind(this, i) }>预期</Button> { v.isFormEl ? null : <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, i) }>JSON</Button> }</div>
          }
        </TimelineItem>
      )
    })
  }

  /**
   * 选择动作
   * @param  {Object} action 动作数据（暂时无用）
   * @param  {Int} index  动作所在的索引
   * @return {[type]}        [description]
   */
  selectedAction(action, index) {
    let selectedPageIndex = this.props.selectedPageIndex,
        selectedActionIndexs = this.state.selectedActionIndexs,
        actions = selectedActionIndexs[ selectedPageIndex ] || [];
    if(actions.includes(index)) {
      actions.splice(actions.indexOf(index), 1);
    } else {
      actions = [ ...actions, index ]
    }
    if(isEmpty(actions)) {
      delete selectedActionIndexs[ selectedPageIndex ];
    } else {
      selectedActionIndexs[ selectedPageIndex ] = actions;
    }
    this.props.changeSelectedActions({ ...selectedActionIndexs });
  }

  /**
   * 将索引数据转成动作数据
   * @return {Array} 转换好的动作数据
   */
  convertSelectedActions() {
    let pages = this.state.pages,
        selectedActionIndexs = this.state.selectedActionIndexs,
        actions = [];
    Object.keys(selectedActionIndexs).map(k => {
      let page = pages[k],
          tArray = [];
      selectedActionIndexs[k].map(v => tArray.push(page.tArray[0][v]));
      actions.push({ ...page, tArray });
    });
    return actions;
  }

  render() {
    let pages = this.state.pages,
        index = this.props.selectedPageIndex,
        page = pages[index] || {},
        actions = page.tArray ? page.tArray[0] : {};
    return (
      <div>
        <Card title={ page.url || "动作" } extra={ isEmpty(page) ? null : <span>{ isEmpty(this.state.selectedActionIndexs) ? null : <span><a onClick={ this.playIt.bind(this) }><Icon type="play-circle-o" /> 回放</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showCreatesModal.bind(this) }><Icon type="plus-circle-o" /> 创建</a>&nbsp;&nbsp;&nbsp;&nbsp;</span> }<a onClick={ this.showEditInSitu.bind(this, undefined) }><Icon type="exclamation-circle-o" /> 预期</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deletePage.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel timeline">
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
        <CreatesModal selectedActionIndexs={ this.state.selectedActionIndexs } visible={ this.state.createsModalVisible } onSubmit={ this.createsModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <ViewjsonModal jsons={ this.state.jsons } visible={ this.state.viewjsonModalVisible } onClose={ this.closeViewjsonModal.bind(this) } />
      </div>
    )
  }
}
