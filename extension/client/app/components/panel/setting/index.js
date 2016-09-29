require("../index.scss");

import React from "react";
import { Card, Icon, Tag } from "antd";

import Spin from "../../common/spin/index";

import SettingModal from "./modals/setting";

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
    if(!this.state.project) {
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
