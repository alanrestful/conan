require("./index.scss");

import React from "react";
import { Modal, Button } from "antd";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  handleCancel() {
    this.props.onClose();
  }

  render() {
    return (
      <Modal title="查看JSON" visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>关 闭</Button>] }>
        <pre>
          <code dangerouslySetInnerHTML={{__html: Prism.highlight(this.props.jsons, Prism.languages.json)}}></code>
        </pre>
      </Modal>
    )
  }
}
