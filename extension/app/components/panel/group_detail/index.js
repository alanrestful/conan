require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Button, Row, Col, Checkbox, Popover, notification, message } from "antd";

import Search from "common/search";
import Spin from "common/spin";
import EditInSitu from "common/edit_in_situ";
import CreateCaseModal from "./modals/create_case";
import EditModelModal from "./modals/edit_model";
import ViewjsonModal from "../modals/viewjson";
import { playback } from "actions/actions";
import { checkedModel, editModel, deleteModel, createCase, getCases } from "actions/groups";
import { isEmpty } from "scripts/helpers";

@pureRender
@connect(state => ({
  groups: state.groups.groups,
  selectedGroup: state.groups.selectedGroup,
  models: state.groups.models,
  checkedModelIndexs: state.groups.checkedModelIndexs,
  cases: state.groups.cases,
  project: state.projects.project
}), dispatch => bindActionCreators({ playback, checkedModel, editModel, deleteModel, createCase, getCases }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      jsons: "",
      selectedModel: {},
      checkedModels: [],
      createCaseModalVisible: false,
      viewjsonModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let selectedModel = this.state.selectedModel;
    if(this.props.selectedGroup && nextProps.selectedGroup._id != this.props.selectedGroup._id) {
      selectedModel = {};
    }
    this.setState({
      selectedModel
    });
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
    let selectedModel = this.state.selectedModel,
        fragment = JSON.parse(selectedModel.fragment);
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
      selectedModel: { ...selectedModel, fragment: JSON.stringify(fragment) }
    });
  }

  playIt() {
    let selectedModel = this.state.selectedModel,
        fragment = JSON.parse(selectedModel.fragment);
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
    let { groups, selectedGroup, models } = this.props;
    this.props.createCase({ ...data, fragment: JSON.stringify(data.fragment), pid: this.props.project.id }, groups, selectedGroup, models);
    tag && this.serializePlay(data.fragment);
    message.success("用例创建成功！");
  }

  /**
   * 显示修改模板的对话框
   * @return {[type]} [description]
   */
  showEditModelModal() {
    this.setState({
      editModelModalVisible: true
    })
  }

  /**
   * 关闭修改模板的对话框
   * @return {[type]} [description]
   */
  closeEditModelModal() {
    this.setState({
      editModelModalVisible: false
    })
  }

  /**
   * 修改模板
   * @param  {Object} data 模板数据
   * @return {[type]}      [description]
   */
  editModelModalSubmit(data) {
    this.props.editModel({ ...data, fragment: JSON.stringify(data.fragment), pid: this.props.project.id }, this.props.models);
    message.success("修改模板成功！");
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
    this.props.playback({ ...actions, tArray: [ actions.tArray ]});
    notification.success({
      message: "提示",
      description: "所选用例已经开始尝试执行，请耐心等待执行结果！（大误）"
    });
  }

  /**
   * 删除当前组
   * @param  {Object} model 模板信息
   * @return {[type]}       [description]
   */
  deleteModel(model) {
    this.props.deleteModel(model, this.props.models);
    this.setState({
      selectedModel: {}
    });
    message.success("模板删除成功！");
  }

  /**
   * 选择模板
   * @param  {Object} model 模板数据
   * @return {[type]}       [description]
   */
  selectedModel(model) {
    this.setState({
      selectedModel: model
    });
  }

  /**
   * 选择模板
   * @param  {Object} model 模板数据
   * @return {[type]}       [description]
   */
  checkedModel(model) {
    let checkedModels = this.state.checkedModels,
        checkedModelIndexs = this.props.checkedModelIndexs || {},
        groupId = this.props.selectedGroup._id,
        current = checkedModelIndexs[groupId];
    if(current) {
      if(current.includes(model._id)) {
        current.splice(current.indexOf(model._id), 1);
        checkedModels.map((v, i) => {
          if(v._id == model._id) {
            checkedModels.splice(i, 1);
          }
        })
        if(isEmpty(current)) {
          delete checkedModelIndexs[groupId];
        }
      } else {
        current.push(model._id);
        checkedModels.push(model);
      }
    } else {
      checkedModelIndexs[groupId] = [model._id];
      checkedModels.push(model);
    }
    this.setState({
      checkedModels
    });
    this.props.checkedModel({ ...checkedModelIndexs });
  }

  /**
   * 显示或者隐藏用例列表
   * @param  {Object} info    用例数据
   * @param  {Boolean} visible 显示状态
   * @return {[type]}         [description]
   */
  changeMenu(info, visible) {
    let selectCaseModalVisible = {};
    selectCaseModalVisible[`selectCaseModalVisible${ info._id }`] = visible;
    if(visible) {
      this.props.getCases(info._id);
      this.setState({
        tempModel: info,
        ...selectCaseModalVisible
      });
    } else {
      this.setState(selectCaseModalVisible);
    }
  }

  /**
   * 生成用例列表
   * @param  {Int} id 用例Id
   * @return {[type]}    [description]
   */
  createMenus(id) {
    let cases = this.props.cases;
    return (
      <ul className="case-list">
      {
        cases ? isEmpty(cases) ? <Spin done /> : cases.map((v, i) => (
          <li key={ i } onClick={ this.selectedCase.bind(this, v, id) }>{ v.name } <span>{ moment(v.created_at).format("YYYY-MM-DD HH:mm:ss") }</span></li>
        )) : <Spin />
      }
      </ul>
    )
  }

  /**
   * 选择用例
   * @param  {Object} info 用例的数据
   * @param  {Int} modelId 模板Id
   * @return {[type]}      [description]
   */
  selectedCase(info, modelId) {
    let model = this.state.tempModel,
        selectCaseModalVisible = {};
    selectCaseModalVisible[`selectCaseModalVisible${ modelId }`] = false;
    this.setState({
      selectedModel: { ...model, fragment: JSON.stringify(this.serializeModel(JSON.parse(model.fragment), JSON.parse(info.data))) },
      ...selectCaseModalVisible
    });
    message.success("用例加载成功！");
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
    let models = this.props.models || [],
        model = this.state.selectedModel,
        fragment = isEmpty(model) ? [] : JSON.parse(model.fragment),
        group = this.props.selectedGroup || {},
        checkedModelIndexs = this.props.checkedModelIndexs || {},
        checkedCurrentModel = isEmpty(group) ? [] : checkedModelIndexs[group._id];
    return (
      <div>
        <Card title={ `${ group.name || "组名称" } ${ isEmpty(models) ? "" : `${ models.length }个模板` }` } extra={ isEmpty(group) ? null : <span>{ isEmpty(checkedModelIndexs) ? null : <a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="plus-circle-o" /> 创建用例</a> }&nbsp;&nbsp;&nbsp;&nbsp;{ isEmpty(this.state.selectedModel) ? null : <span><a onClick={ this.showEditModelModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="此操作将不可恢复，您确定要删除此模板？" placement="bottom" onConfirm={ this.deleteModel.bind(this, model) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> }</span> } className="panel">
          <Row className="group-detail">
            <Col span={10} className="group-list-wrapper">
              <div className="group-search"><Search /></div>
              <ul className="group-list">
              {
                isEmpty(models) ? <Spin done text="您还没有选择组，或者所选组暂无数据~" /> : models.map((v, i) => {
                  return (
                    <li key={ i } className={ model._id == v._id ? "actived" : "" }>
                      <Popover placement="bottomRight" title="用例" content={ this.createMenus(v._id) } onVisibleChange={ this.changeMenu.bind(this, v) } trigger="click" visible={ !!this.state[`selectCaseModalVisible${ v._id }`] }>
                        <a className="ant-dropdown-link">用例 <Icon type="down" /></a>
                      </Popover>
                      <Checkbox onChange={ this.checkedModel.bind(this, v) } checked={ checkedCurrentModel && checkedCurrentModel.includes(v._id) } />
                      <p className="link" onClick={ this.selectedModel.bind(this, v) }>{ v.name }</p>
                      <p className="time" onClick={ this.selectedModel.bind(this, v) }><Icon type="clock-circle-o" /> { moment(v.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                    </li>
                  )
                })
              }
              </ul>
            </Col>
            {
              isEmpty(model) ? <Spin done text="您还没有选择模板，或者所选模板暂无数据~" /> : (
                <Col span={ 14 } className="group-item">
                  <div className="group-item-title clearfix">
                    <h4>{ model.name }</h4>
                    <Button size="small" type="ghost" onClick={ this.viewJson.bind(this, undefined, model) }>JSON</Button>
                    <Button size="small" type="primary" onClick={ this.playIt.bind(this) }>回放</Button>
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
        <CreateCaseModal visible={ this.state.createCaseModalVisible } checkedModels={ this.state.checkedModels } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <EditModelModal visible={ this.state.editModelModalVisible } selectedModel={ this.state.selectedModel } onSubmit={ this.editModelModalSubmit.bind(this) } onClose={ this.closeEditModelModal.bind(this) } />
        <ViewjsonModal jsons={ this.state.jsons } visible={ this.state.viewjsonModalVisible } onClose={ this.closeViewjsonModal.bind(this) } />
      </div>
    )
  }
}
