require("./index.scss");

import React from "react";
import { Spin, Icon } from "antd";

export default class extends React.Component {

  render() {
    return (
      <div className="spin">
      {
        this.props.done ? <span><Icon type="frown" /> 暂时还没有数据哦~</span> : <Spin />
      }
      </div>
    )
  }
}
