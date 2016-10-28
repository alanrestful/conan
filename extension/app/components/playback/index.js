import React from "react";
import { Row, Col } from "antd";

import Header from "header";
import Footer from "footer";
import Setting from "panel/project_setting";
import Group from "panel/group";
import GroupDetail from "panel/group_detail";

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
        <Footer />
      </div>
    )
  }
}
