require("../index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Tag } from "antd";

import Spin from "common/spin";
import SettingModal from "./modals/setting";
import { getAllProjects, getProjectInfo, setProjectInfo } from "actions/projects";

@pureRender
@connect(state => ({
  projects: state.projects.projects,
  project: state.projects.project
}), dispatch => bindActionCreators({ getAllProjects, getProjectInfo, setProjectInfo }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillMount() {
    let project = localStorage.getItem("project");
    if(project) {
      this.props.getProjectInfo(JSON.parse(project));
    } else {
      this.props.getAllProjects();
    }
  }

  showModal() {
    this.props.getAllProjects();
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  settingModalSubmit(data) {
    this.props.setProjectInfo(data);
    localStorage.setItem("project", JSON.stringify(data));
  }

  render() {
    let project = this.props.project;
    return (
      <div>
        <Card title="设置" extra={ <a onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a> } className="panel">
        {
          project ? <div><Tag color="red" title="项目名称">{ project.name }</Tag><Tag color="yellow" title="环境">{ project.env }</Tag><Tag color="blue" title="设备">{ project.device }</Tag><Tag color="green" title="日志级别">{ project.logs }</Tag><Tag title="IP">{ project.ip }</Tag></div> : <Spin done text="待配置" />
        }
        </Card>
        <SettingModal projects={ this.props.projects } project={ this.state.project } visible={ this.state.visible } onSubmit={ this.settingModalSubmit.bind(this) } onClose={ this.closeModal.bind(this) } />
      </div>
    )
  }
}
