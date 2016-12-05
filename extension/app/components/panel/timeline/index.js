require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Timeline, Icon, Popconfirm, Checkbox, Button, Tooltip, Popover, notification, message } from "antd";

import Spin from "common/spin";
import EditInSitu from "common/edit_in_situ";
import Play from "common/play";
import CreatesModal from "./modals/creates";
import ViewjsonModal from "../modals/viewjson";
import { playback, createGroups, setPages, deletePage, checkedActions, editExpect } from "actions/actions";
import { isEmpty } from "scripts/helpers";

const TimelineItem = Timeline.Item;

@connect(state => ({
  pages: state.actions.pages,
  project: state.projects.project
}), dispatch => bindActionCreators({ playback, createGroups, setPages, deletePage, checkedActions, editExpect }, dispatch))
@pureRender
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      jsons: "",
      createsModalVisible: false,
      viewjsonModalVisible: false
    }
  }

  playSettingChange(drivers) {
    this.setState({
      drivers
    });
  }

  /**
   * 回放
   * @return {[type]} [description]
   */
  playIt(playSetting) {
    let selectedActions = this.convertSelectedActions(),
        actions;
    selectedActions.map((v, i) => {
      if(i) {
        actions.tArray = [ ...actions.tArray, ...v.tArray ];
      } else {
        actions = v;
      }
    });
    let { drivers, background } = playSetting || {};
    if(background) {
      drivers = "";
    } else if(isEmpty(drivers)){
      drivers = [ "chrome" ];
    }
    this.props.playback(actions, drivers, background);
    notification.success({
      message: "提示",
      description: "所选用例已经开始尝试执行，请稍后去 结果 页面查看执行结果！"
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
    this.props.editExpect(this.getSelectedPageIndex(), 0, index, value);
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
    this.props.editExpect(this.getSelectedPageIndex(), 0, index, "");
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
    let pageIndex = this.getSelectedPageIndex(),
        pages = this.props.pages,
        currentPage = pages[pageIndex];
    if(index === undefined) {
       pages[pageIndex] = { ...currentPage, ...expect }
    } else {
      pages[pageIndex].tArray = [ currentPage.tArray[0].map((v, i) => i == index ? { ...v, ...expect } : v) ];
    }
    this.props.setPages(pages);
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
    this.props.deletePage(this.getSelectedPageIndex(), this.state.pages, () => message.success("页面删除成功！"));
  }

  viewJson(index) {
    let pageIndex = this.getSelectedPageIndex(),
        actions = [ ...this.props.pages[pageIndex].tArray[0] ],
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
    return actions.map((v, i) => {
      return (
        <TimelineItem key={ i } dot={ <Checkbox onChange={ this.checkedActions.bind(this, i) } checked={ v.checked } /> }>
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
   * @param  {Int} index  动作所在的索引
   * @param  {[type]} event  [description]
   * @return {[type]}        [description]
   */
  checkedActions(index, event) {
    this.props.checkedActions(this.props.pages, index, event.target.checked);
  }

  /**
   * 将索引数据转成动作数据
   * @return {Array} 转换好的动作数据
   */
  convertSelectedActions() {
    let pages = this.props.pages,
        actions = [];
    pages.map(v => {
      if(v.indeterminate || v.checked) {
        let tArray = [];
        v.tArray[0].map(v => tArray.push(v));
        actions.push({ ...v, tArray });
      }
    });
    return actions;
  }

  getSelectedPageIndex() {
    let index;
    (this.props.pages || []).map((v, i) => {
      if(v.selected) {
        index = i;
      }
    });
    return index;
  }

  getSelectedActions(pages) {
    let actions = [];
    pages.map(v => {
      if(v.checked || v.indeterminate) {
        v.tArray[0].map(v => {
          if(v.checked) {
            actions.push(v);
          }
        });
      }
    });
    return actions;
  }

  render() {
    let pages = this.props.pages || [],
        page = pages[this.getSelectedPageIndex()] || {},
        actions = page.tArray ? page.tArray[0] : {},
        selectedActions = this.getSelectedActions(pages);
    return (
      <div>
        <Card title={ page.url || "动作" } extra={ isEmpty(page) ? null : <span>{ isEmpty(selectedActions) ? null : <span><Play callback={ this.playIt.bind(this) } /><Tooltip title="创建模板"><a onClick={ this.showCreatesModal.bind(this) }><Icon type="plus-circle-o" /></a></Tooltip></span> }<Tooltip title="预期"><a onClick={ this.showEditInSitu.bind(this, undefined) }><Icon type="exclamation-circle-o" /></a></Tooltip><Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deletePage.bind(this) }><Tooltip title="删除"><a><Icon type="cross-circle-o" /></a></Tooltip></Popconfirm></span> } className="panel timeline">
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
        <CreatesModal selectedActions={ selectedActions } visible={ this.state.createsModalVisible } onSubmit={ this.createsModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <ViewjsonModal jsons={ this.state.jsons } visible={ this.state.viewjsonModalVisible } onClose={ this.closeViewjsonModal.bind(this) } />
      </div>
    )
  }
}
