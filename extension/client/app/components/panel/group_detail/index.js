require("./index.scss");

import React from "react";
import moment from "moment";
import { Card, Icon, Popconfirm, Button, Row, Col, Checkbox } from "antd";

import { isEmpty } from "../../../static/scripts/helpers";

import Search from "../../common/search/index";
import Spin from "../../common/spin/index";
import EditInSitu from "../../common/edit_in_situ/index";
import CreateCaseModal from "./modals/create_case";

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      models: [],
      selectedGroup: {},
      selectedModel: {},
      createCaseModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      models: nextProps.models,
      selectedGroup: nextProps.selectedGroup
    });
  }

  /**
   * 显示创建用例对话框
   * @return {[type]} [description]
   */
  showCreateCaseModal() {
    this.setState({
      createCaseModalVisible: true
    });
  }

  /**
   * 关闭创建用例对话框
   * @return {[type]} [description]
   */
  closeCreatesModal() {
    this.setState({
      createCaseModalVisible: false
    });
  }

  createCaseModalSubmit() {}

  deleteGroup() {}

  selectedModel(model) {
    this.setState({
      selectedModel: model
    });
  }

  checkedModel() {}

  confirm() {}

  render() {
    let models = this.state.models,
        model = this.state.selectedModel,
        fragment = isEmpty(model) ? [] : JSON.parse(model.fragment),
        group = this.state.selectedGroup;
    console.log(555, fragment)
    return (
      <div>
        <Card title={ `${ group.name || "组名称" } ${ isEmpty(models) ? null : `${ models.length }个模板` }` } extra={ <span><a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="plus-circle-o" /> 创建用例</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.deleteGroup.bind(this) }><a><Icon type="cross-circle-o" /> 删除</a></Popconfirm></span> } className="panel">
          <Row className="group-detail">
            <Col span={10} className="group-list-wrapper">
              <div className="group-search"><Search /></div>
              <ul className="group-list">
              {
                isEmpty(models) ? <Spin done text="您还没有选择组，或者所选组暂无数据~" /> : models.map((v, i) => {
                  return (
                    <li key={ i } onClick={ this.selectedModel.bind(this, v) }>
                      <Checkbox onChange={ this.checkedModel.bind(this) }>
                        <p className="link">{ v.name }</p>
                        <p className="time"><Icon type="clock-circle-o" /> { moment(v.updated_at).format("YYYY-MM-DD HH:mm:ss") } &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> JSANN</p>
                      </Checkbox>
                    </li>
                  )
                })
              }
              </ul>
            </Col>
            {
              isEmpty(model) ? <Spin done text="您还没有选择模板，或者所选模板暂无数据~" /> : (
                <Col span={ 14 } className="group-item">
                  <div className="group-item-title clearfix">
                    <h4>{ model.name }</h4>
                    <Button size="small">代码</Button>
                  </div>
                  <div className="group-result clearfix">
                    <span className="group-result-info">预期结果：以下报错均出现</span>
                    <span className="group-result-control">
                      <a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                        <a><Icon type="cross-circle-o" /> 删除</a>
                      </Popconfirm>
                    </span>
                  </div>
                  <ul className="action-line">
                  {
                    fragment.map(v => {
                      return v.tArray.map((v, i) => {
                        return (
                          <li className="clearfix" key={ i }>
                            <span className="index">{ i + 1 }.</span>
                            <span className="action-content-wrap">
                              <span className="action-content">
                                <div>
                                  <span className="address" title={ `xPath: ${ v.xPath }` }><Icon type="environment-o" /> { v.xPath }</span>
                                  { v.className ? <span className="action" title={ `Class Name: ${ v.className }` }><Icon type="tag-o" /> { v.className }</span> : null }
                                  { v.id ? <span className="action" title={ `ID: ${ v.id }` }><Icon type="tags-o" /> { v.id }</span> : null }
                                  { v.name ? <span className="action" title={ `Name: ${ v.name }` }><Icon type="eye-o" /> { v.name }</span> : null }
                                  { v.type ? <span className="action" title={ `Type: ${ v.type }` }><Icon type="file-unknown" /> { v.type }</span> : null }
                                  { v.tagName ? <span className="action" title={ `Tag Name: ${ v.tagName }` }><Icon type="setting" /> { v.tagName }</span> : null }
                                  { v.value ? <span className="address" title={ `Value: ${ v.type == "password" ? v.value.replace(/./g, "*") : v.value }` }><Icon type="book" /> { v.type == "password" ? v.value.replace(/./g, "*") : v.value }</span> : null }
                                </div>
                                <div><Button size="small">Comment</Button></div>
                                <div className="group-result small error clearfix">
                                  <span className="group-result-info">预期结果：以下报错均出现</span>
                                  <span className="group-result-control">
                                    <a onClick={ this.showCreateCaseModal.bind(this) }><Icon type="edit" /> 编辑</a><Popconfirm title="您确定要删除此记录？" placement="bottom" onConfirm={ this.confirm.bind(this) }>
                                      <a><Icon type="cross-circle-o" /> 删除</a>
                                    </Popconfirm>
                                  </span>
                                </div>
                              </span>
                            </span>
                          </li>
                        )
                      })
                    })
                  }
                  </ul>
                </Col>
              )
            }
          </Row>
        </Card>
        <CreateCaseModal visible={ this.state.createCaseModalVisible } onSubmit={ this.createCaseModalSubmit.bind(this) } onClose={ this.closeCreatesModal.bind(this) } />
      </div>
    )
  }
}
