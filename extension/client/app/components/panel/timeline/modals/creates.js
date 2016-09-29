import React from "react";
import { Modal, Form, Input, Select, Checkbox, Button, Alert } from "antd";

const FormItem = Form.Item,
      Option = Select.Option;

export default Form.create()(class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      selectedActions: this.props.selectedActions
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      selectedActions: nextProps.selectedActions
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
      let onSubmit = this.props.onSubmit;
      onSubmit instanceof Function && onSubmit(values);
      this.handleCancel();
    });
  }

  handleCancel() {
    this.setState({
      confirmLoading: false
    });
    this.props.onClose();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let selectedActions = this.state.selectedActions || {},
        actions = [];
    for(let k of Object.keys(selectedActions)) {
      selectedActions[k].map(v => {
        actions.push(v);
      })
    }
    let getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <Modal title="创建模板和用例" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
        <Form horizontal>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 14, offset: 6 }} help=" ">
            <Alert message={ `当前有${ actions.length }个选项被选中！` } type="info" showIcon />
          </FormItem>
          <FormItem { ...formItemLayout } label="模板组">
            { getFieldDecorator("tempGroup", {
                initualValue: "",
                rules: [ { required: true, whitespace: true } ]
              })(
                <Input placeholder="查询模板组" />
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="模板名称">
            { getFieldDecorator("tempName", {
                initualValue: "",
                rules: [ { required: true, whitespace: true } ]
              })(
                <Input placeholder="模板名称" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
})
