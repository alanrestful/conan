require("../index.scss");
require("./index.scss");

import React from "react";
import moment from "moment";
import pureRender from 'pure-render-decorator';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Icon, Popconfirm, Checkbox } from "antd";

import Spin from "common/spin";
import { getActionData, clearAllPages, pageActived } from "actions/actions";
import { isEmpty } from "scripts/helpers";

@pureRender
@connect(state => ({
  pages: state.actions.pages,
  page: state.actions.page,
  action: state.actions.action,
  selectedActions: state.actions.selectedActions
}), dispatch => bindActionCreators({ getActionData, clearAllPages, pageActived }, dispatch))
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
    let _pages = isEmpty(this.state.pages) ? nextProps.pages : this.state.pages,
        pages = nextProps.page ? [ ..._pages, nextProps.page ] : _pages,
        action = nextProps.action;
    if(action) {
      pages.map((v, i) => {
        if(v && action.baseURI == v.url) {
          v.tArray[0] = [ ...v.tArray[0], action ];
        }
      });
    }
    this.setState({
      pages,
      selectedActions: nextProps.selectedActions
    });
  }

  changeSelectedActions(event) {
    event.stopPropagation();
  }

  pageItem(pages) {
    let selectedActions = this.state.selectedActions || {};
    return (
      <ul className="pages">
      {
        pages.map((v, i) => {
          if(v) {
            return (
              <li key={i} onClick={ this.pageActived.bind(this, i) } className={ this.state.actived == i ? "actived" : null }>
                <p className="link" title={ v.url }>{ v.url }</p>
                <p className="time"><Icon type="clock-circle-o" /> { moment().format("YYYY-MM-DD HH:mm:ss") }</p>
                <Checkbox className="checkbox" onChange={ this.changeSelectedActions.bind(this) } checked={ !!selectedActions[i] } />
              </li>
            )
          }
        })
      }
      </ul>
    )
  }

  pageActived(index) {
    this.setState({
      actived: index
    });
    this.props.pageActived(index);
  }

  clearAllPages() {
    this.props.clearAllPages();
    this.setState({
      pages: []
    })
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
