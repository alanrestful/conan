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
      <Modal title="查看结果" visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>关 闭</Button>] }>
      {
        this.props.result.map((v, i) => {
          return (
            <ul key={ i } className="result-list">
              <li>开始时间：{ v.start }</li>
              <li>结果：{ v.pass ? <span className="success">通过</span> : <span className="error">不通过</span> }</li>
              {
                v.expectResult.map((v, i) => <li key={ i }>{ 1 + i }，{ v }</li>)
              }
            </ul>
          )
        })
      }
      </Modal>
    )
  }
}
