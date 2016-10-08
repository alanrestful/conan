require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import { Tabs, Icon } from 'antd';

import Spin from "../../common/spin/index";

import { isEmpty } from "../../../static/scripts/helpers";

const TabPane = Tabs.TabPane;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: {}
    }
  }

  componentWillMount() {
    this.props.getGroup(this.props.project.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedGroup: nextProps.selectedGroup || {}
    });
  }

  changeTab() {}

  /**
   * 选择模板组
   * @param  {Object} group 模板数据
   * @return {[type]}       [description]
   */
  selectedGroup(group) {
    this.props.getModels(group);
  }

  getGroupsItem() {
    let groups = this.props.groups,
        group = this.state.selectedGroup;
    return groups ? isEmpty(groups) ? <Spin done /> : groups.map((v, i) => {
      return (
        <li key={ i } onClick={ this.selectedGroup.bind(this, v) } className={ v._id == group._id ? "actived" : "" }>
          <p className="link">{ v.name }</p>
          <p className="time"><Icon type="clock-circle-o" /> 最后修改：{ moment(v.created_at).format("YYYY-MM-DD HH-mm:ss") }</p>
        </li>
      )
    }) : <Spin />
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={ this.changeTab.bind(this) } className="panel group-tab">
        <TabPane tab="模板组" key="1">
          <ul className="pages">
          {
            this.getGroupsItem()
          }
          </ul>
        </TabPane>
        <TabPane tab="用例组" key="2">
          <ul className="pages">
          {
            this.getGroupsItem()
          }
          </ul>
        </TabPane>
      </Tabs>
    )
  }
}
