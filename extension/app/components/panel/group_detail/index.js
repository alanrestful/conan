require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Button, Row, Col, Checkbox, Popover, Tooltip, notification, message } from "antd";

import Search from "common/search";
import Spin from "common/spin";
import EditInSitu from "common/edit_in_situ";
import PlaySetting from "common/play_setting";
import CreateCaseModal from "./modals/create_case";
import ViewjsonModal from "../modals/viewjson";
import { playback } from "actions/actions";
import { checkedCase, editCase, deleteCase, createCase } from "actions/groups";
import { isEmpty } from "scripts/helpers";

@pureRender
@connect(state => ({
  models: state.groups.models,
  cases: state.groups.cases,
  selectedGroup: state.groups.selectedGroup,
  selectedModel: state.groups.selectedModel,
  checkedIds: state.groups.checkedIds,
  project: state.projects.project
}), dispatch => bindActionCreators({ playback, checkedCase, editCase, deleteCase, createCase }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    let drivers = localStorage.getItem("drivers");
    if(drivers) {
      drivers = JSON.parse(drivers);
    } else {
      drivers = ["chrome"];
    }
    this.state = {
      drivers,
      jsons: "",
      checkedCases: [],
      selectedCase: {},
      createCaseModalVisible: false,
      viewjsonModalVisible: false
    }
  }

  /**
   * 显示编辑 预期 的文本框
   * @param  {String} hash 哈希值
   * @return {[type]}       [description]
   */
  showEditInSitu(hash) {
    this.expectCommon(hash, {
      expectEditing: true
    });
  }

  /**
   * 编辑 预期 完成
   * @param  {String} hash 哈希值
   * @param  {String} value 值
   * @return {[type]}       [description]
   */
  editOnEnter(hash, value) {
    this.expectCommon(hash, {
      expect: value,
      expectEditing: false
    });
  }

  /**
   * 取消编辑 预期
   * @param  {String} hash 哈希值
   * @return {[type]}       [description]
   */
  editOnCancel(hash) {
    this.expectCommon(hash, {
      expectEditing: false
    });
  }

  /**
   * 删除 预期
   * @param  {String} hash 哈希值
   * @return {[type]}       [description]
   */
  deleteExpect(hash) {
    this.expectCommon(hash, {
      expect: undefined,
      expectEditing: false
    });
  }

  /**
   * 对 预期 操作的通用方法
   * @param  {String} hash  哈希值
   * @param  {String} expect 值
   * @return {[type]}        [description]
   */
  expectCommon(hash, expect) {
    let selectedCase = this.state.selectedCase,
        fragment = JSON.parse(selectedCase.fragment);
    fragment = fragment.map(v => {
      if(v.hash == hash) {
        v = { ...v, ...expect };
      }
      if(v.tArray) {
        v.tArray = v.tArray.map(v => {
          if(v.hash == hash) {
            v = { ...v, ...expect };
          }
          return v;
        });
      }
      return v;
    });
    this.setState({
      selectedCase: { ...selectedCase, fragment: JSON.stringify(fragment) }
    });
  }

  playSettingChange(drivers) {
    this.setState({
      drivers
    });
  }

  playIt() {
    let selectedCase = this.state.selectedCase,
        fragment = JSON.parse(selectedCase.fragment);
    this.serializePlay(fragment);
  }

  /**
   * 显示创建用例对话框
   * @return {[type]} [description]
   */
  showCreateCaseModal() {
    this.setState({
      createCaseModalVisible: true
    });
  }

  /**
   * 关闭创建用例对话框
   * @return {[type]} [description]
   */
  closeCreatesModal() {
    this.setState({
      createCaseModalVisible: false
    });
  }

  /**
   * 创建用例
   * @param  {Object} data 用例数据
   * @param  {Boolean} tag  是否立即执行
   * @return {[type]}      [description]
   */
  createCaseModalSubmit(data, tag) {
    this.props.createCase({ ...data, pid: this.props.project.id }, this.props.cases);
    tag && this.serializePlay(this.serializeModel(JSON.parse(this.props.selectedModel.fragment), data));
    message.success("用例创建成功！");
  }

  /**
   * 整理回放数据并回放
   * @param  {Object} fragment 回访数据
   * @return {[type]}          [description]
   */
  serializePlay(fragment) {
    let actions = {};
    fragment.map((v, i) => {
      if(i) {
        actions.tArray = [ ...actions.tArray, ...v.tArray ];
      } else {
        actions = v;
      }
    });
    this.props.playback({ ...actions, tArray: [ actions.tArray ]}, this.state.drivers);
    notification.success({
      message: "提示",
      description: "所选用例已经开始尝试执行，请耐心等待执行结果！"
    });
  }

  /**
   * 删除当前用例
   * @param  {Object} c 用例信息
   * @return {[type]}       [description]
   */
  deleteCase(c) {
    this.props.deleteCase(c, this.props.cases);
    this.setState({
      selectedCase: {}
    });
    message.success("用例删除成功！");
  }

  /**
   * 选择用例
   * @param  {Object} c 用例数据
   * @return {[type]}       [description]
   */
  checkedCase(c) {
    let checkedCases = this.state.checkedCases,
        checkedIds = this.props.checkedIds || {},
        groupId = this.props.selectedGroup._id,
        modelId = this.props.selectedModel._id,
        current = checkedIds[groupId];
    if(current) {
      current = current[modelId]
      if(current) {
        if(current.includes(c._id)) {
          current.splice(current.indexOf(c._id), 1);
          checkedCases.map((v, i) => {
            if(v._id == c._id) {
              checkedCases.splice(i, 1);
            }
          })
          if(isEmpty(current)) {
            delete checkedIds[groupId];
          }
        } else {
          current.push(c._id);
          checkedCases.push(c);
        }
      } else {
        current[modelId] = [c._id];
        checkedCases.push(c);
      }
    } else {
      checkedIds[groupId] = {};
      checkedIds[groupId][modelId] = [c._id];
      checkedCases.push(c);
    }
    this.setState({
      checkedCases
    });
    this.props.checkedCase({ ...checkedIds });
  }

  /**
   * 选择用例
   * @param  {Object} info 用例的数据
   * @return {[type]}      [description]
   */
  selectedCase(info) {
    let model = this.props.selectedModel;
    this.setState({
      selectedCase: { ...info, fragment: JSON.stringify(this.serializeModel(JSON.parse(model.fragment), JSON.parse(info.data))) }
    });
  }

  /**
   * 将用例的数据塞入模板当中
   * @param  {Array} fragment 模板数据
   * @param  {Array} data     用例数据
   * @return {Array}          序列化好的数据
   */
  serializeModel(fragment, data) {
    return fragment.map(v => {
      let _data = data[v.hash]
      if(_data) {
        v.expect = _data.expect;
        v.value = _data.value;
      }
      if(v.tArray) {
        v.tArray = this.serializeModel(v.tArray, data);
      }
      return v;
    });
  }

  viewJson(index, jsons) {
    if(index) {
      let actions = [ ...jsons ];
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
      jsons.reverse();
    }
    this.setState({
      viewjsonModalVisible: true,
      jsons: JSON.stringify(jsons, null, 2)
    });
  }

  closeViewjsonModal() {
    this.setState({
      viewjsonModalVisible: false
    })
  }

  render() {
    let cases = this.props.cases || [],
        selectedCase = this.state.selectedCase,
        model = this.props.selectedModel || {},
        fragment = isEmpty(selectedCase) ? [] : JSON.parse(selectedCase.fragment),
        checkedIds = this.props.checkedIds || {},
        groupId = this.props.selectedGroup ? this.props.selectedGroup._id : "",
        checkedCurrent = checkedIds[groupId] ? checkedIds[groupId][model._id] || [] : [];
    return (
      <div>
        <Card title={ `${ model.name || "用例" } ${ isEmpty(cases) ? "" : `${ cases.length }个用例` }` } extra={ <span>{ isEmpty(selectedCase) ? null : <Popover title="回放选项" trigger="hover" placement="bottomRight" arrowPointAtCenter={ true } content={ <PlaySetting onChange={ this.playSettingChange.bind(this) } drivers={ this.state.drivers } /> }><a onClick={ this.playIt.bind(this) }><Icon type="play-circle-o" /></a></Popover>}{ isEmpty(model) ? null : <Tooltip title="创建用例"><a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="plus-circle-o" /></a></Tooltip> }{ isEmpty(selectedCase) ? null : <span><Tooltip title="编辑"><a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /></a></Tooltip><Popconfirm title="此操作将不可恢复，您确定要删除此用例？" placement="bottom" onConfirm={ this.deleteCase.bind(this, selectedCase) }><Tooltip title="删除"><a><Icon type="cross-circle-o" /></a></Tooltip></Popconfirm></span> }</span> } className="panel">
          <Row className="group-detail">
            <Col span={10} className="group-list-wrapper">
              <div className="group-search"><Search /></div>
              <ul className="group-list">
              {
                isEmpty(cases) ? <Spin done text="您还没有选择模板，或者所选模板暂无数据~" /> : cases.map((v, i) => {
                  return (
                    <li key={ i } className={ selectedCase._id == v._id ? "actived" : "" }>
                      <Checkbox onChange={ this.checkedCase.bind(this, v) } checked={ checkedCurrent.includes(v._id) } />
                      <p className="link" onClick={ this.selectedCase.bind(this, v) }>{ v.name }</p>
                      <p className="time" onClick={ this.selectedCase.bind(this, v) }><Icon type="clock-circle-o" /> { moment(v.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                    </li>
                  )
                })
              }
              </ul>
            </Col>
            {
              isEmpty(selectedCase) ? <Spin done text="您还没有选择用例，或者所选用例暂无数据~" /> : (
                <Col span={ 14 } className="group-item">
                  <div className="group-item-title clearfix">
                    <h4>{ selectedCase.name }</h4>
                    <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, undefined, selectedCase) }>JSON</Button>
                    <Button size="small">导出</Button>
                  </div>
                  {
                    fragment.map((m, i) => (
                      <div key={ i }>
                        <div className="page-title">{ m.url }</div>
                        {
                          m.expectEditing ? <EditInSitu value={ m.expect } onEnter={ this.editOnEnter.bind(this, m.hash) } onCancel={ this.editOnCancel.bind(this, m.hash) } /> : m.expect ? (
                            <div className="group-result clearfix">
                              <span className="group-result-info">预期结果：{ m.expect }</span>
                              <span className="group-result-control">
                                <a onClick={ this.showEditInSitu.bind(this, m.hash) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deleteExpect.bind(this, m.hash) }>
                                  <a><Icon type="cross-circle-o" /> 删除</a>
                                </Popconfirm>
                              </span>
                            </div>
                          ) : (
                            <div className="page-control">
                              <Button size="small" onClick={ this.showEditInSitu.bind(this, m.hash) }>预期</Button>
                              {
                                m.isFormEl ? null : <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, undefined, m) }>JSON</Button>
                              }
                            </div>
                          )
                        }
                        <ul className="action-line">
                        {
                          m.tArray.map((v, i) => (
                            <li className="clearfix" key={ i }>
                              <span className="index">{ i + 1 }.</span>
                              <span className="action-content-wrap">
                                <span className="action-content">
                                  <div>
                                    <span className="address" title={ `xPath: ${ v.xPath }` }><Icon type="environment-o" /> { v.xPath }</span>
                                    { v.className ? <span className="action" title={ `Class Name: ${ v.className }` }><Icon type="tag-o" /> { v.className }</span> : null }
                                    { v.id ? <span className="action" title={ `ID: ${ v.id }` }><Icon type="tags-o" /> { v.id }</span> : null }
                                    { v.name ? <span className="action" title={ `Name: ${ v.name }` }><Icon type="eye-o" /> { v.name }</span> : null }
                                    { v.type ? <span className="action" title={ `Type: ${ v.type }` }><Icon type="file-unknown" /> { v.type }</span> : null }
                                    { v.tagName ? <span className="action" title={ `Tag Name: ${ v.tagName }` }><Icon type="setting" /> { v.tagName }</span> : null }
                                    { v.value ? <span className="address" title={ `Value: ${ v.type == "password" ? v.value.replace(/./g, "*") : v.value }` }><Icon type="book" /> { v.type == "password" ? v.value.replace(/./g, "*") : v.value }</span> : null }
                                  </div>
                                  {
                                    v.expectEditing ? <EditInSitu value={ v.expect } onEnter={ this.editOnEnter.bind(this, v.hash) } onCancel={ this.editOnCancel.bind(this, v.hash) } /> : v.expect ? (
                                      <div className="group-result small error clearfix">
                                        <span className="group-result-info">预期结果：{ v.expect }</span>
                                        <span className="group-result-control">
                                          <a onClick={ this.showEditInSitu.bind(this, v.hash) }><Icon type="edit" /> 编辑</a>
                                          &nbsp;&nbsp;&nbsp;&nbsp;
                                          <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deleteExpect.bind(this, v.hash) }>
                                            <a><Icon type="cross-circle-o" /> 删除</a>
                                          </Popconfirm>
                                        </span>
                                      </div>
                                    ) : (
                                      <div>
                                        <Button size="small" onClick={ this.showEditInSitu.bind(this, v.hash) }>预期</Button> { v.isFormEl ? null : <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, i, m.tArray) }>JSON</Button> }
                                      </div>
                                    )
                                  }
                                </span>
                              </span>
                            </li>
                          ))
                        }
                        </ul>
                      </div>
                    ))
                  }
                </Col>
              )
            }
          </Row>
        </Card>
        <CreateCaseModal visible={ this.state.createCaseModalVisible } cases={ selectedCase } model={ model } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <ViewjsonModal jsons={ this.state.jsons } visible={ this.state.viewjsonModalVisible } onClose={ this.closeViewjsonModal.bind(this) } />
      </div>
    )
  }
}
