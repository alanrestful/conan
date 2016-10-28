require("../index.scss");
require("./index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, message } from "antd";

import Spin from "common/spin";
import { getAllResult, clearAllResult } from "actions/result";
import { isEmpty } from "scripts/helpers";

@pureRender
@connect(state => ({
  results: state.result.results,
  result: state.result.result
}), dispatch => bindActionCreators({ getAllResult, clearAllResult }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getAllResult();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if(nextProps.results) {
      this.setState({
        results: nextProps.results
      });
    }
    if(nextProps.result) {
      this.setState({
        results: [ ...this.state.results, nextProps.result ]
      });
    }
  }

  render() {
    let results = this.state.results;
    return (
      <div>
        <Card title="结果" className="panel">
          <ul className="result-list">
            {
              results ? isEmpty(results) ? <Spin done /> : results.map((v, i) => {
                return (
                  <li key={ i }>
                    <div><Icon type="link" /> { v.url } <Icon type="chrome" /> { v.browser } <Icon type="clock-circle-o" /> { v.start }</div>
                    <div>{ v.pass ? <span><Icon type="smile-o" /> 通过</span> : <span><Icon type="frown-o" /> 不通过</span> }</div>
                  </li>
                )
              }) : <Spin />
            }
          </ul>
        </Card>
      </div>
    )
  }
}
