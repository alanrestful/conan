import React from "react";
import { Row, Col } from "antd";

import Header from "header";
import Footer from "footer";
import Setting from "panel/setting";

export default class extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Row gutter={24}>
          <Col span={24}>
            <Setting />
          </Col>
        </Row>
        <Footer />
      </div>
    )
  }
}
