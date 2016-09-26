require("./index.scss");

import React from "react";
import Identicon from "identicon.js";
import { Row, Col, Menu, Dropdown, Icon } from "antd";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar: require("../../static/images/avatar.png") || `data:image/png;base64, ${new Identicon("JSANN").toString()}`
    }
  }

  dropdown() {
    return (
      <Menu>
        <Menu.Item>
          <a>退出</a>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <div className="header">
        <Row>
          <Col span={5}><a href="#/" className="logo"><img src={ require("../../static/images/parana.png") } alt="Parana" /><span>Conan</span></a></Col>
          <Col span={9} offset={10}>
            <nav>
              <ul>
                <li><a href="#/">录制</a></li>
                <li><a href="#/playback">回放</a></li>
                <li><a href="#/dashboard">统计</a></li>
                <li><a href="#/setting">设置</a></li>
              </ul>
            </nav>
            <Dropdown overlay={this.dropdown()}>
              <a className="ant-dropdown-link user-menu"><img className="avatar" src={ this.state.avatar } alt="JSANN" /> JSANN <Icon type="down" /></a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    )
  }
}
