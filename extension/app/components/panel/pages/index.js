require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Checkbox, Tooltip, message } from "antd";

import Spin from "common/spin";
import { getActionData, clearAllPages, pageActived } from "actions/actions";
import { isEmpty } from "scripts/helpers";

@pureRender
@connect(state => {
  let pages = state.actions.pages || [],
      page = state.result.page,
      action = state.result.action,
      status = false;
  pages.map(v => {
    if(page) {
      if(v.url == page.url) {
        status = true;
      }
    }
    if(action) {
      if(v.url == action.baseURI) {
        v.tArray[0].push(action);
      }
    }
  });
  if(page && !status) {
    pages.push(page);
  }
  return {
    pages: [ ...pages ],
    selectedActionIndexs: state.actions.selectedActionIndexs
  }
}, dispatch => bindActionCreators({ getActionData, clearAllPages, pageActived }, dispatch))
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getActionData();
  }

  changeSelectedActions(event) {
    event.stopPropagation();
  }

  pageItem(pages) {
    let selectedActionIndexs = this.props.selectedActionIndexs || {};
    return (
      <ul className="pages">
      {
        pages.map((v, i) => {
          if(v) {
            return (
              <li key={ i } onClick={ this.pageActived.bind(this, i) } className={ this.state.actived == i ? "actived" : null }>
                <p className="link" title={ v.url }>{ v.url }</p>
                <p className="time"><Icon type="clock-circle-o" /> { moment().format("YYYY-MM-DD HH:mm:ss") }</p>
                <Checkbox className="checkbox" onChange={ this.changeSelectedActions.bind(this) } checked={ !!selectedActionIndexs[i] } />
              </li>
            )
          }
        })
      }
      </ul>
    )
  }

  /**
   * 页面选中
   * @param  {Int} index 页面的索引
   * @return {[type]}       [description]
   */
  pageActived(index) {
    this.setState({
      actived: index
    });
    this.props.pageActived(index);
  }

  /**
   * 清除所有的页面
   * @return {[type]} [description]
   */
  clearAllPages() {
    this.props.clearAllPages(() => message.success("页面清空成功！"));
  }

  render() {
    let pages = this.props.pages;
    return (
      <Card title="页面" extra={ pages.length ? <Popconfirm title="此操作将不可恢复，您确定要删除所有的页面？" placement="bottom" onConfirm={ this.clearAllPages.bind(this) }><Tooltip title="清空"><a><Icon type="delete" /></a></Tooltip></Popconfirm> : null } className="panel">
      {
        pages.length ? this.pageItem(pages) : <Spin done />
      }
      </Card>
    )
  }
}
