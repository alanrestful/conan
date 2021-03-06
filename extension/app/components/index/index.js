import React from "react";
import { Link } from "react-router";
import { Row, Col } from "antd";

import Header from "header";
import Footer from "footer";
import Timeline from "panel/timeline";
import Setting from "panel/project_setting";
import Pages from "panel/pages";

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
        <Footer />
      </div>
    )
  }
}
