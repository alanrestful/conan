require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Collapse, Icon, Checkbox, Popconfirm, Tooltip, message } from 'antd';

import Spin from "common/spin";
import CreateCaseModal from "./modals/create_case";
import EditModelModal from "./modals/edit_model";
import { getAllDatas, editModel, deleteModel, checkedModel, getCases, checkedGroups, checkedModels, selectedGroup, selectedModel, createCase } from "actions/groups";
import { isEmpty } from "scripts/helpers";

const Panel = Collapse.Panel;

@connect(state => ({
  groups: state.groups.groups,
  project: state.projects.project
}), dispatch => bindActionCreators({ getAllDatas, editModel, deleteModel, checkedModel, getCases, checkedGroups, checkedModels, selectedGroup, selectedModel, createCase }, dispatch))
@pureRender
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModelCaseVisible: false,
      editModelModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.project && !this.props.project) {
      this.props.getAllDatas(nextProps.project.id);
    }
  }

  /**
   * 显示创建用例对话框
   * @return {[type]} [description]
   */
  showCreateModelModal() {
    this.setState({
      createModelCaseVisible: true
    });
  }

  /**
   * 关闭创建用例对话框
   * @return {[type]} [description]
   */
  closeCreateCaseModal() {
    this.setState({
      createModelCaseVisible: false
    });
  }

  /**
   * 创建用例
   * @param  {Object} data 用例数据
   * @param  {Boolean} tag  是否立即执行
   * @return {[type]}      [description]
   */
  createCaseModalSubmit(data, tag) {
    this.props.createCase(this.props.groups, { ...data, fragment: JSON.stringify(data.fragment), pid: this.props.project.id });
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
    this.props.editModel({ ...data, fragment: JSON.stringify(data.fragment), pid: this.props.project.id }, this.props.groups);
    message.success("修改模板成功！");
  }

  /**
   * 勾选模板组
   * @param  {Object} group 模板组对象
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  checkedGroups(group, event) {
    this.props.checkedGroups(this.props.groups, group.current._id, event.target.checked);
  }

  /**
   * 选择模板组
   * @param  {String} index 模板组的索引
   * @return {[type]}       [description]
   */
  selectedGroup(index) {
    if(index != undefined) {
      let group = this.props.groups[index];
      this.props.selectedGroup(this.props.groups, group.current._id);
    } else {
      this.props.selectedGroup(this.props.groups, undefined);
    }
  }


  /**
   * 选择模板
   * @param  {Object} models 模板数据
   * @return {[type]}       [description]
   */
  selectedModel(models) {
    this.props.selectedModel(this.props.groups, models.current._id);
  }

  /**
   * 删除当前模板
   * @param  {Object} model 模板信息
   * @return {[type]}       [description]
   */
  deleteModel(model) {
    this.props.deleteModel(model, this.props.groups);
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
  checkedModel(models, event) {
    this.props.checkedModels(this.props.groups, models.current._id, event.target.checked);
  }

  /**
   * 获取选中的模板组
   * @return {Object} 所选中的模板组
   */
  getCheckedGroups() {}

  /**
   * 获取选中的模板组
   * @return {Object} 所选中的模板组
   */
  getCheckedModels() {
    let groups = this.props.groups || [],
        models = [];
    groups.map(v => {
      if(v.current.checked || v.current.indeterminate) {
        v.children.map(v => {
          if(v.current.checked || v.current.indeterminate) {
            models.push(v.current);
          }
        });
      }
    });
    return models;
  }

  /**
   * 获取选中的模板组
   * @return {Object} 所选中的模板组对象
   */
  getSelectedGroup() {
    let groups = this.props.groups || [],
        index;
    groups.map((v, i) => {
      if(v.current.selected) {
        index = i;
      }
    });
    return index;
  }

  renderGroups() {
    let groups = this.props.groups,
        model = this.getSelectedModel();
    return groups ? isEmpty(groups) ? <Spin done /> : groups.map((v, i) => {
      return (
        <Panel header={ <div>{ v.current.name }<Checkbox className="checkbox" onChange={ this.checkedGroups.bind(this, v) } checked={ v.current.checked } indeterminate={ v.current.indeterminate } /></div> } key={ i }>
          <ul className="group-list">
          {
            isEmpty(v.children) ? <Spin done /> : v.children.map((v, i) => {
              return (
                <li key={ i } className={ v.current.selected ? "actived" : "" }>
                  <Checkbox onChange={ this.checkedModel.bind(this, v) } checked={ v.current.checked } indeterminate={ v.current.indeterminate } />
                  <p className="link" onClick={ this.selectedModel.bind(this, v) }>{ v.current.name }</p>
                  <p className="time" onClick={ this.selectedModel.bind(this, v) }><Icon type="clock-circle-o" /> { moment(v.current.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                </li>
              )
            })
          }
          </ul>
        </Panel>
      )
    }) : <Spin />
  }

  /**
   * 获取选中的模板
   * @return {Object} 所选中的模板对象
   */
  getSelectedModel() {
    let groups = this.props.groups || [],
        model = {};
    groups.map(v => {
      if(v.current.selected) {
        v.children.map(v => {
          if(v.current.selected) {
            model = v.current;
          }
        });
      }
    });
    return model;
  }

  render() {
    console.log(this.props.groups)
    let model = this.getSelectedModel(),
        checkedModels = this.getCheckedModels(),
        fragment = isEmpty(model) ? [] : JSON.parse(model.fragment),
        selectedGroupIndex = this.getSelectedGroup();
    return (
      <div>
        <Card title="模板" extra={ isEmpty(model) ? null : <span><Tooltip title="创建模板"><a onClick={ this.showCreateModelModal.bind(this) }><Icon type="plus-circle-o" /></a></Tooltip><Tooltip title="编辑"><a onClick={ this.showEditModelModal.bind(this) }><Icon type="edit" /></a></Tooltip><Popconfirm title="此操作将不可恢复，您确定要删除此模板？" placement="bottom" onConfirm={ this.deleteModel.bind(this, model) }><Tooltip title="删除"><a><Icon type="cross-circle-o" /></a></Tooltip></Popconfirm></span> } className="panel">
          <Collapse accordion defaultActiveKey={[ isEmpty(selectedGroupIndex) ?  "" : `${selectedGroupIndex}` ]} onChange={ this.selectedGroup.bind(this)}>
          {
            this.renderGroups()
          }
          </Collapse>
        </Card>
        <CreateCaseModal visible={ this.state.createModelCaseVisible } checkedModels={ !isEmpty(checkedModels) ? checkedModels : !isEmpty(model) ? [ model ] : [] } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreateCaseModal.bind(this) } />
        <EditModelModal visible={ this.state.editModelModalVisible } selectedModel={ model } onSubmit={ this.editModelModalSubmit.bind(this) } onClose={ this.closeEditModelModal.bind(this) } />
      </div>
    )
  }
}
