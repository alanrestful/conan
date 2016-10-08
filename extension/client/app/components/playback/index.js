import React from "react";
import { Row, Col } from "antd";

import Header from "../header/index";
import GroupDetail from "../panel/group_detail/connect";
import Setting from "../panel/setting/connect";
import Group from "../panel/group/connect";

export default class extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Row gutter={24}>
          <Col span={6}>
            <Setting />
            <Group />
          </Col>
          <Col span={18}>
            <GroupDetail />
          </Col>
        </Row>
      </div>
    )
  }
}
