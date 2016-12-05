require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Button, Row, Col, Checkbox, Tooltip, notification, message } from "antd";

import Search from "common/search";
import Spin from "common/spin";
import EditInSitu from "common/edit_in_situ";
import Play from "common/play";
import CreateCaseModal from "./modals/create_case";
import ViewjsonModal from "../modals/viewjson";
import { playback } from "actions/actions";
import { deleteCase, createCase, editCase, editCaseExpect, exportCase, checkedCases, selectedCase, commonCaseExpect } from "actions/groups";
import { isEmpty } from "scripts/helpers";

@connect(state => ({
  groups: state.groups.groups,
  playSetting: state.groups.playSetting,
  project: state.projects.project
}), dispatch => bindActionCreators({ playback, deleteCase, createCase, editCase, editCaseExpect, exportCase, checkedCases, selectedCase, commonCaseExpect }, dispatch))
@pureRender
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      jsons: "",
      createCaseModalVisible: false,
      isEditCaseModelVisible: false,
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
    this.props.editCaseExpect(this.props.groups, hash, value, this.getSelectedCase());
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
    this.props.editCaseExpect(this.props.groups, hash, "", this.getSelectedCase());
  }

  /**
   * 对 预期 操作的通用方法
   * @param  {String} hash  哈希值
   * @param  {String} expect 值
   * @return {[type]}        [description]
   */
  expectCommon(hash, expect) {
    let models = this.getCases(),
        fragment = JSON.parse(models.model.fragment);
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
    this.props.commonCaseExpect(this.props.groups, models.model._id, JSON.stringify(fragment));
  }

  /**
   * 回放
   * @param  {Object} playSetting 回放设置
   * @return {[type]}             [description]
   */
  playIt(playSetting) {
    this.serializePlay(undefined, playSetting);
  }

  /**
   * 显示创建用例对话框
   * @return {[type]} [description]
   */
  showCreateCaseModal(isEdit) {
    this.setState({
      createCaseModalVisible: true,
      isEditCaseModelVisible: isEdit
    });
  }

  /**
   * 关闭创建用例对话框
   * @return {[type]} [description]
   */
  closeCreatesModal() {
    this.setState({
      createCaseModalVisible: false,
      isEditCaseModelVisible: false
    });
  }

  /**
   * 创建用例
   * @param  {Object} data 用例数据
   * @param  {Boolean} tag  是否立即执行
   * @return {[type]}      [description]
   */
  createCaseModalSubmit(data, tag) {
    let models = this.getCases();
    if(!this.state.isEditCaseModelVisible) {
      this.props.createCase(this.props.groups, { ...data, pid: this.props.project.id });
    } else {
      this.props.editCase(this.props.groups, { ...data, pid: this.props.project.id });
    }
    tag && this.serializePlay(this.serializeModel(JSON.parse(models.model.fragment), data));
    message.success("用例创建成功！");
  }

  /**
   * 整理回放数据并回放
   * @param  {Object} fragment 回访数据
   * @param  {Object} playSetting 回放参数
   * @return {[type]}          [description]
   */
  serializePlay(fragment, playSetting) {
    let actions;
    if(fragment) {
      actions = {};
      fragment.map((v, i) => {
        if(i) {
          actions.tArray = [ ...actions.tArray, ...v.tArray ];
        } else {
          actions = v;
        }
      });
      actions = { ...actions, tArray: [ actions.tArray ]};
    } else {
      actions = this.getCheckedCases(this.props.groups);
      actions = actions.length == 1 ? actions[0] : actions;
    }
    let { drivers, background } = playSetting || this.props.playSetting || {};
    if(background) {
      drivers = "";
    } else if(isEmpty(drivers)){
      drivers = [ "chrome" ];
    }
    this.props.playback(actions, actions instanceof Array ? drivers[0] : drivers , background);
    notification.success({
      message: "提示",
      description: "所选用例已经开始尝试执行，请稍后去 结果 页面查看执行结果！"
    });
  }

  /**
   * 获取用例数据
   * @return {Object} 用例对象
   */
  getCases() {
    let groups = this.props.groups || [],
        model = {},
        cases = [];
    groups.map(v => {
      if(v.current.selected) {
        v.children.map(v => {
          if(v.current.selected) {
            model = v.current;
            cases = v.children;
          }
        })
      }
    });
    return { model, cases };
  }

  /**
   * 获取选中的用例
   * @param  {Array}  children 模板组列表
   * @return {Array}          所选中的用例列表
   */
  getCheckedCases(children = []) {
    let cases = [];
    children.map(v => {
      if(v.current.indeterminate || v.current.checked) {
        v.children.map(v => {
          if(v.current.indeterminate || v.current.checked) {
            v.children.map(v => {
              if(v.selected) {
                cases.push(v);
              }
            });
          }
        });
      }
    });
    return cases;
  }

  /**
   * 删除当前用例
   * @param  {Object} c 用例信息
   * @return {[type]}       [description]
   */
  deleteCase(c) {
    this.props.deleteCase(this.props.groups, this.getSelectedCase());
    message.success("用例删除成功！");
  }

  /**
   * 选择用例
   * @param  {Object} c 用例数据
   * @return {[type]}       [description]
   */
  checkedCase(c, event) {
    this.props.checkedCases(this.props.groups, c._id, event.target.checked);
  }

  /**
   * 选择用例
   * @param  {Object} info 用例的数据
   * @return {[type]}      [description]
   */
  selectedCase(info) {
    this.props.selectedCase(this.props.groups, info._id);
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

  /**
   * 导出用例
   * @return {[type]} [description]
   */
  exportCase() {
    this.props.exportCase(this.getCases().model);
  }

  /**
   * 查看JSON
   * @param  {Int} index [description]
   * @param  {Object} jsons [description]
   * @return {[type]}       [description]
   */
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

  /**
   * 关闭查看JSON对话框
   * @return {[type]} [description]
   */
  closeViewjsonModal() {
    this.setState({
      viewjsonModalVisible: false
    })
  }

  /**
   * 搜索
   * @param  {Stringify} value 搜索的值
   * @return {[type]}       [description]
   */
  onSearch(value) {
    console.log("SEARCH:", value);
  }

  /**
   * 获取选中的用例
   * @return {Object} 所选中的用例对象
   */
  getSelectedCase() {
    let groups = this.props.groups || [],
        selectedCase = {};
    groups.map(v => {
      if(v.current.selected) {
        v.children.map(v => {
          if(v.current.selected) {
            v.children.map(v => {
              if(v.selected) {
                selectedCase = v;
              }
            });
          }
        });
      }
    });
    return selectedCase;
  }

  render() {
    let models = this.getCases(),
        cases = models.cases,
        selectedCases = this.getSelectedCase(),
        model = models.model,
        fragment = isEmpty(model) || isEmpty(selectedCases) ? [] : this.serializeModel(JSON.parse(model.fragment), JSON.parse(selectedCases.data));
    return (
      <div>
        <Card title={ `${ model.name || "用例" } ${ isEmpty(cases) ? "" : `${ cases.length }个用例` }` } extra={ <span>{ isEmpty(this.getCheckedCases(this.props.groups)) ? null : <Play callback={ this.playIt.bind(this) } /> }{ isEmpty(model) ? null : <Tooltip title="创建用例"><a onClick={ this.showCreateCaseModal.bind(this, false) }><Icon type="plus-circle-o" /></a></Tooltip> }{ isEmpty(selectedCases) ? null : <span><Tooltip title="编辑"><a onClick={ this.showCreateCaseModal.bind(this, true) }><Icon type="edit" /></a></Tooltip><Popconfirm title="此操作将不可恢复，您确定要删除此用例？" placement="bottom" onConfirm={ this.deleteCase.bind(this, selectedCases) }><Tooltip title="删除"><a><Icon type="cross-circle-o" /></a></Tooltip></Popconfirm></span> }</span> } className="panel">
          {
            isEmpty(cases) ? <Spin done text="您还没有选择模板，或者所选模板暂无数据~" /> : (
              <Row className="group-detail">
                <Col span={10} className="group-list-wrapper">
                  <div className="group-search"><Search onSearch={ this.onSearch.bind(this) } /></div>
                  <ul className="group-list">
                  {
                    cases.map((v, i) => {
                      return (
                        <li key={ i } className={ v.selected ? "actived" : "" }>
                          <Checkbox onChange={ this.checkedCase.bind(this, v) } checked={ v.checked } indeterminate={ v.indeterminate }/>
                          <p className="link" onClick={ this.selectedCase.bind(this, v) }>{ v.name }</p>
                          <p className="time" onClick={ this.selectedCase.bind(this, v) }><Icon type="clock-circle-o" /> { moment(v.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                        </li>
                      )
                    })
                  }
                  </ul>
                </Col>
                {
                  isEmpty(selectedCases) ? <Spin done text="您还没有选择用例，或者所选用例暂无数据~" /> : (
                    <Col span={ 14 } className="group-item">
                      <div className="group-item-title clearfix">
                        <h4>{ selectedCases.name }</h4>
                        <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, undefined, selectedCases) }>JSON</Button>
                        <Button size="small" onClick={ this.exportCase.bind(this) }>导出</Button>
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
                        )
                      )
                    }
                  </Col>
                )
              }
            </Row>
          )
        }
        </Card>
        <CreateCaseModal visible={ this.state.createCaseModalVisible } cases={ selectedCases } model={ model } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <ViewjsonModal jsons={ this.state.jsons } visible={ this.state.viewjsonModalVisible } onClose={ this.closeViewjsonModal.bind(this) } />
      </div>
    )
  }
}
