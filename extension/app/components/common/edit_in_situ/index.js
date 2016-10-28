/**
 * by JSANN.
 */
require("./index.scss");

import React from "react";
import { Input, Tooltip, Icon } from "antd";

export default class extends React.Component {

  /**
   * 按键事件
   * 这里用于监听`ESC`键
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  handleKeyUp(event) {
    if(event.keyCode == 27) {
      this.handleCancel();
    }
  }

  handleBlur(event) {
    event.target.value ? this.handleEnter(event) : this.handleCancel();
  }

  /**
   * 取消事件
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  handleCancel(event) {
    let onCancel = this.props.onCancel;
    onCancel instanceof Function && onCancel();
  }

  /**
   * 回车事件
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  handleEnter(event) {
    let onEnter = this.props.onEnter;
    onEnter instanceof Function && onEnter(event.target.value);
  }

  render() {
    return (
      <div className="edit-in-situ">
        <Input placeholder={ this.props.placeholder || "请输入..." } autoFocus={true} defaultValue={ this.props.value } onBlur={ this.handleBlur.bind(this) } onKeyUp={ this.handleKeyUp.bind(this) } onPressEnter={ this.handleEnter.bind(this) }/>
        <Tooltip title="确定请按Enter，取消请按ESC。">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    )
  }
}
