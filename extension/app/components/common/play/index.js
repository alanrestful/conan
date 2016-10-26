require("./index.scss");

import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Popover, Icon, Tooltip, Switch } from "antd";

import { getPleySetting, setPlaySetting } from "actions/groups";

@connect(state => ({
  playSetting: state.groups.playSetting
}), dispatch => bindActionCreators({ getPleySetting, setPlaySetting }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drivers: [],
      defaults: false,
      background: false,
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.props.playSetting
    });
  }

  onChange(name, checked) {
    let drivers = this.state.drivers;
    if(checked) {
      drivers.push(name);
    } else {
      drivers.splice(drivers.indexOf(name), 1);
    }
    this.setState({
      drivers: [ ...drivers ]
    });
    this.saveSetting();
  }

  backgroundChange(checked) {
    this.setState({
      background: checked
    });
    this.saveSetting();
  }

  defaultChange(checked) {
    this.setState({
      defaults: checked
    });
    this.saveSetting();
  }

  saveSetting() {
    let { drivers, defaults, background } = this.state;
    if(defaults) {
      this.props.setPlaySetting({ drivers, defaults, background });
    }
  }

  renderSetting() {
    let drivers = this.state.drivers;
    return(
      <ul className="play-setting">
        <li>Chrome<Switch size="small" onChange={ this.onChange.bind(this, "chrome") } checked={ this.state.background ? false : drivers.includes("chrome") } disabled={ this.state.background } /></li>
        <li>Firefox<Switch size="small" onChange={ this.onChange.bind(this, "firefox") } checked={ this.state.background ? false : drivers.includes("firefox") } disabled={ this.state.background } /></li>
        <li>Safari<Switch size="small" onChange={ this.onChange.bind(this, "safari") } checked={ this.state.background ? false : drivers.includes("safari") } disabled={ this.state.background } /></li>
        <li className="hr"></li>
        <li>静默执行<Switch size="small" onChange={ this.backgroundChange.bind(this) } checked={ this.state.background } /></li>
        <li>以此为默认选项<Switch size="small" onChange={ this.defaultChange.bind(this) } checked={ this.state.default } /></li>
      </ul>
    )
  }

  playIt() {
    clearTimeout(this.state.timeout);
    let callback = this.props.callback;
    callback instanceof Function && callback(this.state.drivers);
  }

  showPopover() {
    this.setState({
      timeout: setTimeout(() => {
        this.setState({
          visible: true
        })
      }, 2000)
    });
  }

  closePopover() {
    clearTimeout(this.state.timeout);
  }

  handleVisibleChange(visible) {
    !visible && this.setState({
      visible
    });
  }

  render() {
    return(
      <Popover title="回放选项" trigger="hover" placement="bottomRight" visible={ this.state.visible } arrowPointAtCenter={ true } content={ this.renderSetting() } onVisibleChange={ this.handleVisibleChange.bind(this) }>
        <Tooltip title="回放，更多选项请静候。">
          <a onClick={ this.playIt.bind(this) } onMouseEnter={ this.showPopover.bind(this) } onMouseLeave={ this.closePopover.bind(this) }>
            <Icon type="play-circle-o" />
          </a>
        </Tooltip>
      </Popover>
    )
  }
}
