import React from "react";
import { Link } from "react-router";
import { Row, Col } from "antd";

import Header from "../header/index";
import Timeline from "../panel/timeline/connect";
import Setting from "../panel/setting/index";
import Pages from "../panel/pages/index";

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
