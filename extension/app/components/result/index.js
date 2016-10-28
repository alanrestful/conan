import React from "react";
import { Row, Col } from "antd";

import Header from "header";
import Footer from "footer";
import Result from "panel/result";

export default class extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Row gutter={24}>
          <Col span={24}>
            <Result />
          </Col>
        </Row>
        <Footer />
      </div>
    )
  }
}
