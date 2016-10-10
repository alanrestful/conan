import React from "react";
import { Link } from "react-router";
import { Row, Col } from "antd";

import Header from "header";
import Timeline from "panel/timeline/connect";
import Setting from "panel/setting/connect";
import Pages from "panel/pages/connect";

export default class extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Row gutter={24}>
          <Col span={6}>
            <Setting />
            <Pages />
          </Col>
          <Col span={18}>
            <Timeline />
          </Col>
        </Row>
      </div>
    )
  }
}
