require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Collapse, Icon, Checkbox, Popconfirm, Tooltip, message } from 'antd';

import Spin from "common/spin";
import CreateModelModal from "./modals/create_model";
import EditModelModal from "./modals/edit_model";
import { getGroup, getModels, editModel, deleteModel, checkedModel, getCases } from "actions/groups";
import { isEmpty } from "scripts/helpers";

const Panel = Collapse.Panel;

@pureRender
@connect(state => ({
  groups: state.groups.groups,
  models: state.groups.models,
  selectedModel: state.groups.selectedModel,
  checkedIds: state.groups.checkedIds,
  project: state.projects.project
}), dispatch => bindActionCreators({ getGroup, getModels, editModel, deleteModel, checkedModel, getCases }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: {},
      selectedModel: {},
      checkedModels: [],
      checkedIds: {},
      createModelModalVisible: false,
      editModelModalVisible: false
    }
  }

  componentWill() {
    let project = this.props.project;
    if(project) {
      this.props.getGroup(project.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.project && !this.props.project) {
      this.props.getGroup(nextProps.project.id);
    }
    this.setState({
      checkedIds: nextProps.checkedIds || {}
    });
  }


  /**
   * 显示创建用例对话框
   * @return {[type]} [description]
   */
  showCreateModelModal() {
    this.setState({
      createModelModalVisible: true
    });
  }

  /**
   * 关闭创建用例对话框
   * @return {[type]} [description]
   */
  closeCreatesModal() {
    this.setState({
      createModelModalVisible: false
    });
  }

  /**
   * 创建用例
   * @param  {Object} data 用例数据
   * @param  {Boolean} tag  是否立即执行
   * @return {[type]}      [description]
   */
  createModelModalSubmit(data, tag) {
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
   * 选择模板组
   * @param  {String} index 模板组的索引
   * @return {[type]}       [description]
   */
  selectedGroup(index) {
    let group = this.props.groups[index];
    this.props.getModels(group);
    this.setState({
      selectedGroup: group
    });
  }

  changeSelectedActions() {}

  /**
   * 选择模板
   * @param  {Object} model 模板数据
   * @return {[type]}       [description]
   */
  selectedModel(model) {
    this.props.getCases(model);
    this.setState({
      selectedModel: model
    });
  }

  /**
   * 删除当前模板
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
  checkedModel(model) {
    let checkedModels = this.state.checkedModels,
        checkedIds = this.props.checkedIds || {},
        groupId = this.state.selectedGroup._id,
        current = checkedIds[groupId];
    if(current) {
      if(current.includes(model._id)) {
        current.splice(current.indexOf(model._id), 1);
        checkedModels.map((v, i) => {
          if(v._id == model._id) {
            checkedModels.splice(i, 1);
          }
        })
        if(isEmpty(current)) {
          delete checkedIds[groupId];
        }
      } else {
        current.push(model._id);
        checkedModels.push(model);
      }
    } else {
      checkedIds[groupId] = [model._id];
      checkedModels.push(model);
    }
    this.setState({
      checkedModels
    });
    this.props.checkedModel({ ...checkedIds });
  }

  renderGroups() {
    let groups = this.props.groups,
        group = this.state.selectedGroup,
        model = this.state.selectedModel,
        models = this.props.models || [],
        checkedIds = this.props.checkedIds || {},
        checkedCurrent = checkedIds[group._id] || {};
    return groups ? isEmpty(groups) ? <Spin done /> : groups.map((v, i) => {
      return (
        <Panel header={ <div>{ v.name } <Checkbox className="checkbox" onChange={ this.changeSelectedActions.bind(this) } checked={ !isEmpty(this.state.checkedIds[v._id]) } /></div> } key={ i } className={ v._id == group._id ? "actived" : "" }>
          <ul className="group-list">
          {
            isEmpty(models) ? <Spin done /> : models.map((v, i) => {
              return (
                <li key={ i } className={ model._id == v._id ? "actived" : "" }>
                  <Checkbox onChange={ this.checkedModel.bind(this, v) } checked={ !isEmpty(checkedCurrent[v._id]) } />
                  <p className="link" onClick={ this.selectedModel.bind(this, v) }>{ v.name }</p>
                  <p className="time" onClick={ this.selectedModel.bind(this, v) }><Icon type="clock-circle-o" /> { moment(v.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                </li>
              )
            })
          }
          </ul>
        </Panel>
      )
    }) : <Spin />
  }

  render() {
    let model = this.state.selectedModel,
        fragment = isEmpty(model) ? [] : JSON.parse(model.fragment),
        group = this.state.selectedGroup || {},
        checkedIds = this.props.checkedIds || {};
    return (
      <div>
        <Card title="模板" extra={ isEmpty(group) ? null : <span>{ isEmpty(checkedIds) ? null : <Tooltip title="创建模板"><a onClick={ this.showCreateModelModal.bind(this) }><Icon type="plus-circle-o" /></a></Tooltip> }{ isEmpty(this.state.selectedModel) ? null : <span><Tooltip title="编辑"><a onClick={ this.showEditModelModal.bind(this) }><Icon type="edit" /></a></Tooltip><Popconfirm title="此操作将不可恢复，您确定要删除此模板？" placement="bottom" onConfirm={ this.deleteModel.bind(this, model) }><Tooltip title="删除"><a><Icon type="cross-circle-o" /></a></Tooltip></Popconfirm></span> }</span> } className="panel">
          <Collapse accordion onChange={ this.selectedGroup.bind(this)}>
          {
            this.renderGroups()
          }
          </Collapse>
        </Card>
        <CreateModelModal visible={ this.state.createModelModalVisible } checkedModels={ this.state.checkedModels } onSubmit={ this.createModelModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
        <EditModelModal visible={ this.state.editModelModalVisible } selectedModel={ this.state.selectedModel } onSubmit={ this.editModelModalSubmit.bind(this) } onClose={ this.closeEditModelModal.bind(this) } />
      </div>
    )
  }
}
