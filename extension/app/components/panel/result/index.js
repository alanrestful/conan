require("../index.scss");
require("./index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Tooltip, message } from "antd";

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

  clearAllResult() {
    this.props.clearAllResult();
  }

  render() {
    let results = this.state.results;
    return (
      <div>
        <Card title="结果" className="panel" extra={ results && results.length ? <Popconfirm title="此操作将不可恢复，您确定要删除所有的记录？" placement="bottom" onConfirm={ this.clearAllResult.bind(this) }><Tooltip title="清空"><a><Icon type="delete" /></a></Tooltip></Popconfirm> : null }>
          <ul className="results-list">
            {
              results ? isEmpty(results) ? <Spin done /> : results.map((v, i) => {
                return (
                  <li key={ i }>
                    <div>
                      <span><Icon type="link" /> { v.url }</span>
                      <span><Icon type="chrome" /> { v.browser }</span>
                      <span><Icon type="clock-circle-o" /> { v.start }</span>
                    </div>
                    {
                      v.error ? (
                        <ul>
                        {
                          v.error.map((v, i) => <li key={ i }>{ v }</li>)
                        }
                        </ul>
                      ) : null
                    }
                    {
                      v.expectResult ? (
                        <ul>
                        {
                          v.expectResult.map((v, i) => <li key={ i }>
                              <div>v.expect</div>
                              <div>{ v.pass ? <span className="success"><Icon type="smile-o" /> 通过</span> : <span className="error"><Icon type="frown-o" /> 不通过</span> }</div>
                            </li>
                          )
                        }
                        </ul>
                      ) : null
                    }
                    <div>{ v.pass ? <span className="success"><Icon type="smile-o" /> 通过</span> : <span className="error"><Icon type="frown-o" /> 不通过</span> }</div>
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
