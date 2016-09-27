require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import { Card, Icon, Popconfirm } from "antd";

import Spin from "../../common/spin/index";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: []
    };
  }

  componentWillMount() {
    this.props.getActionData();
  }

  componentWillReceiveProps(nextProps) {
    let pages = [ ...this.state.pages, ...nextProps.pages ],
        action = nextProps.action;
    if(action) {
      pages.map((v, i) => {
        if(v && action.baseURI == v.url) {
          v.tArray = [ ...v.tArray, action ];
        }
      });
    }
    this.setState({
      pages: nextProps.page ? [ ...pages, nextProps.page ] : pages
    });
  }

  pageItem(pages) {
    return (
      <ul className="pages">
      {
        pages.map((v, i) => {
          if(v) {
            return (
              <li key={i} onClick={ this.pageActived.bind(this, v, i) } className={ this.state.actived == i ? "actived" : null }>
                <p className="link" title={ v.url }>{ v.url }</p>
                <p className="time"><Icon type="clock-circle-o" /> { moment().format("YYYY-MM-DD HH:mm:ss") }</p>
              </li>
            )
          }
        })
      }
      </ul>
    )
  }

  pageActived(selectedPage, index) {
    this.setState({
      actived: index
    });
    this.props.pageActived(selectedPage);
  }

  clearAllPages() {
    this.props.clearAllPages();
  }

  render() {
    let pages = this.state.pages;
    return (
      <Card title="页面" extra={ pages.length ? <Popconfirm title="此操作将不可恢复，您确定要清空所有用例？" placement="bottom" onConfirm={ this.clearAllPages.bind(this) }><a><Icon type="delete" /> 清空</a></Popconfirm> : null } className="panel">
      {
        pages.length ? this.pageItem(pages) : <Spin done />
      }
      </Card>
    )
  }
}
