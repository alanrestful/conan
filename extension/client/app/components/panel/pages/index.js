require("../index.scss");
require("./index.scss");

import React from "react";
import { Card, Icon } from "antd";

import Spin from "../../common/spin/index";

export default class extends React.Component {

  pageItem(pages) {
    return (
      <ul className="pages">
      {
        pages.map((v, i) => {
          <li onClick={ this.pageSelected.bind(this) }>
            <p className="link">{ v.link }</p>
            <p className="time"><Icon type="clock-circle-o" /> { v.time }</p>
          </li>
        })
      }
      </ul>
    )
  }

  pageSelected() {}

  render() {
    let pages = this.props.pages || [];
    return (
      <Card title="页面" extra={ pages ? pages.length ? <a href="#"><Icon type="delete" /> 清空</a> : null : null } className="panel">
      {
        pages ? pages.length ? this.pageItem.bind(this, pages) : <Spin done /> : <Spin />
      }
      <ul className="pages">
        <li>
          <p className="link">http://www.baidu.com/</p>
          <p className="time"><Icon type="clock-circle-o" /> 2016-09-21 10:12:22</p>
        </li>
        <li>
          <p className="link">http://www.baidu.com/</p>
          <p className="time"><Icon type="clock-circle-o" /> 2016-09-21 10:12:22</p>
        </li>
        <li>
          <p className="link">http://www.baidu.com/</p>
          <p className="time"><Icon type="clock-circle-o" /> 2016-09-21 10:12:22</p>
        </li>
      </ul>
      </Card>
    )
  }
}
