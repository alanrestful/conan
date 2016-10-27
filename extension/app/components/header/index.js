require("./index.scss");

import React from "react";
import Identicon from "identicon.js";
import pureRender from "pure-render-decorator";
import { Link } from "react-router";
import { Row, Col, Menu, Dropdown, Icon } from "antd";

@pureRender
export default class extends React.Component {

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
    let name = "JSANN",
        names = name.split("");
    return (
      <div className="header">
        <Row>
          <Col span={5}><Link to="/" className="logo"><img src={ require("images/parana.png") } alt="Parana" /><span>Conan</span></Link></Col>
          <Col span={8} offset={11}>
            <nav>
              <ul>
                <li><Link to="/" activeClassName="actived">录制</Link></li>
                <li><Link to="/playback" activeClassName="actived">回放</Link></li>
                <li style={{ display: "none" }}><Link to="/dashboard" activeClassName="actived">统计</Link></li>
                <li><Link to="/setting" activeClassName="actived">设置</Link></li>
              </ul>
            </nav>
            <Dropdown overlay={this.dropdown()}>
              <a className="ant-dropdown-link user-menu"><img className="avatar" src={ require("images/avatar.png") || `data:image/png;base64, ${new Identicon(`\\x${ names.map((v, i) => name.charCodeAt(i).toString(16)).join("\\x") }`, 35).toString()}` } alt={ name } /> { name } <Icon type="down" /></a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    )
  }
}
