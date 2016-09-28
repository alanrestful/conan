require("../index.scss");

import React from "react";
import { Card, Icon } from "antd";

import Spin from "../../common/spin/index";

import SettingModal from "./modals/setting";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillMount() {
    this.props.getAllProjects();
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  settingModalSubmit(data) {
    console.log("PROJECT:", data);
    this.props.setProjectInfo(data);
  }

  render() {
    return (
      <div>
        <Card title="设置" extra={ <a onClick={ this.showModal.bind(this) }><Icon type="edit" /> 编辑</a> } className="panel">
          <Spin done text="待配置" />
        </Card>
        <SettingModal projects={ this.props.projects } visible={ this.state.visible } onSubmit={ this.settingModalSubmit.bind(this) } />
      </div>
    )
  }
}
