require("../index.scss");
require("./index.scss");

import React from "react";
import { Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

export default class extends React.Component {

  changeTab() {}

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={ this.changeTab.bind(this) } className="panel group-tab">
        <TabPane tab="模板组" key="1">
          <ul className="pages">
            <li>
              <p className="link">http://www.baidu.com/</p>
              <p className="time"><Icon type="clock-circle-o" /> 最后修改：2016-09-21 10:12:22</p>
            </li>
            <li>
              <p className="link">http://www.baidu.com/</p>
              <p className="time"><Icon type="clock-circle-o" /> 最后修改：2016-09-21 10:12:22</p>
            </li>
            <li>
              <p className="link">http://www.baidu.com/</p>
              <p className="time"><Icon type="clock-circle-o" /> 最后修改：2016-09-21 10:12:22</p>
            </li>
          </ul>
        </TabPane>
        <TabPane tab="用例组" key="2">选项卡二内容</TabPane>
      </Tabs>
    )
  }
}
