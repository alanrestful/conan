require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Checkbox, Tooltip, message } from "antd";

import Spin from "common/spin";
import { getActionData, clearAllPages, checkedPages, selectedPages } from "actions/actions";
import { isEmpty } from "scripts/helpers";

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
}, dispatch => bindActionCreators({ getActionData, clearAllPages, checkedPages, selectedPages }, dispatch))
@pureRender
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getActionData();
  }

  pageItem(pages) {
    return (
      <ul className="pages">
      {
        pages.map((v, i) => {
          if(v) {
            return (
              <li key={ i } className={ v.selected ? "actived" : null }>
                <p className="link" title={ v.url } onClick={ this.selectedPages.bind(this, i) }>{ v.url }</p>
                <p className="time" onClick={ this.selectedPages.bind(this, i) }><Icon type="clock-circle-o" /> { moment().format("YYYY-MM-DD HH:mm:ss") }</p>
                <Checkbox className="checkbox" onChange={ this.checkedPages.bind(this, i) } checked={ v.checked } indeterminate={ v.indeterminate } />
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
  checkedPages(index, event) {
    this.props.checkedPages(this.props.pages, index, event.target.checked);
  }

  selectedPages(index) {
    this.props.selectedPages(this.props.pages, index);
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
