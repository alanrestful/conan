import React from "react";
import { Modal, Form, Input, Button, Alert } from "antd";

const FormItem = Form.Item;

@Form.create()
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  handleContinue() {
    this.setState({
      continueLoading: true
    });
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(errors) {
        this.setState({
          continueLoading: false
        });
        return false;
      }
      this.handleCommon(values, true);
    });
  }

  handleOk() {
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(errors) {
        this.setState({
          confirmLoading: false
        });
        return false;
      }
      this.handleCommon(values);
    });
  }

  handleCommon(values, tag) {
    let onSubmit = this.props.onSubmit,
        fragment = [];
    this.props.checkedModels.map(v => {
      fragment = [ ...fragment, ...JSON.parse(v.fragment) ];
    });
    onSubmit instanceof Function && onSubmit({ ...values, fragment }, tag);
    this.handleCancel();
  }

  handleCancel() {
    this.setState({
      continueLoading: false,
      confirmLoading: false
    });
    this.props.onClose();
  }

  render() {
    let getFieldDecorator = this.props.form.getFieldDecorator,
        checkedModels = this.props.checkedModels,
        hash = {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    checkedModels.map(v => {
      JSON.parse(v.fragment).map(v => {
        if(v.hash) {
          hash[v.hash] = { expect: v.expect || "" }
        }
        v.tArray && v.tArray.map(v => {
          if(v.hash) {
            hash[v.hash] = { expect: v.expect || "" }
          }
        });
      });
    });
    return (
      <Modal title="创建用例" visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>取 消</Button>, <Button key="submit" type="primary" size="large" loading={ this.state.confirmLoading } onClick={ this.handleOk.bind(this) }>创 建</Button>, <Button key="continue" type="primary" size="large" loading={ this.state.continueLoading } onClick={ this.handleContinue.bind(this) }>创建并执行</Button>] }>
        <Form horizontal>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 14, offset: 6 }} help=" ">
            <Alert message={ `当前有${ checkedModels.length }个选项被选中！` } type="info" showIcon />
          </FormItem>
          <FormItem { ...formItemLayout } label="用例组">
            { getFieldDecorator("tempGroup", {
                initialValue: "",
                rules: [ { required: true, whitespace: false, message: "请输入用例组名称！" } ]
              })(
                <Input placeholder="查询用例组" />
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="用例名称">
            { getFieldDecorator("tempName", {
                initialValue: "",
                rules: [ { required: true, whitespace: false, message: "请输入用例名称！" } ]
              })(
                <Input placeholder="用例名称" />
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="数据">
            { getFieldDecorator("data", {
                initialValue: JSON.stringify(hash),
                rules: [ { required: true, whitespace: false, message: "请输入用例组数据！" } ]
              })(
                <Input type="textarea" placeholder="数据" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
