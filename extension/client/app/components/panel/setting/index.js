require("../index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { Card, Icon, Tag } from "antd";

import Spin from "common/spin";

@pureRender
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
      // this.props.setProjectInfo(this.state.project);
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

  settingModalSubmit(data) {
    // this.props.setProjectInfo(data);
    localStorage.setItem("project", JSON.stringify(data));
  }

  render() {
    let project = this.state.project;
    return (
      <div>
        <Card title="全局设置" className="panel">
        {
          project ? <div><Tag color="red" title="项目名称">{ project.name }</Tag><Tag color="yellow" title="环境">{ project.env }</Tag><Tag color="blue" title="设备">{ project.device }</Tag><Tag color="green" title="日志级别">{ project.logs }</Tag><Tag title="IP">{ project.ip }</Tag></div> : <Spin done text="待配置" />
        }
        </Card>
      </div>
    )
  }
}
