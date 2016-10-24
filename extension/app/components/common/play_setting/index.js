require("./index.scss");

import React from "react";
import { Switch } from "antd";

export default class extends React.Component {

  onChange(name, checked) {
    let onChange = this.props.onChange,
        drivers = this.props.drivers;
    if(checked) {
      drivers.push(name);
    } else {
      drivers.splice(drivers.indexOf(name), 1);
    }
    onChange instanceof Function && onChange([ ...drivers ]);
  }

  render() {
    let drivers = this.props.drivers;
    return(
      <ul className="play-setting">
        <li>Chrome<Switch size="small" onChange={ this.onChange.bind(this, "chrome") } checked={ drivers.includes("chrome") } /></li>
        <li>Firefox<Switch size="small" onChange={ this.onChange.bind(this, "firefox") } checked={ drivers.includes("firefox") } /></li>
      </ul>
    )
  }
}
