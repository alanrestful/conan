require("../index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Tag } from "antd";

import Spin from "common/spin";
import SettingModal from "./modals/setting";
import { getAllProjects, setProjectInfo } from "actions/projects";

@pureRender
@connect(state => ({
  projects: state.projects.projects,
  project: state.projects.project
}), dispatch => bindActionCreators({ getAllProjects, setProjectInfo }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    let project = localStorage.getItem("project");
    if(project) {
      project = JSON.parse(project);
    }
    this.state = {
      project,
      visible: false
    }
  }

  componentWillMount() {
    if(this.state.project) {
      this.props.setProjectInfo(this.state.project);
    } else {
      this.props.getAllProjects();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.project) {
      this.setState({
        project: nextProps.project
      });
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
    let project = this.state.project;
    return (
      <div>
        <Card title="设置" extra={ <a onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a> } className="panel">
        {
          project ? <div><Tag color="red" title="项目名称">{ project.name }</Tag><Tag color="yellow" title="环境">{ project.env }</Tag><Tag color="blue" title="设备">{ project.device }</Tag><Tag color="green" title="日志级别">{ project.logs }</Tag><Tag title="IP">{ project.ip }</Tag></div> : <Spin done text="待配置" />
        }
        </Card>
        <SettingModal projects={ this.props.projects } visible={ this.state.visible } onSubmit={ this.settingModalSubmit.bind(this) } onClose={ this.closeModal.bind(this) } />
      </div>
    )
  }
}
