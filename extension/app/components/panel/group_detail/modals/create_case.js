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
        mid = this.props.model._id;
    onSubmit instanceof Function && onSubmit({ ...values, mid }, tag);
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
        fragment = this.props.model.fragment,
        isEdit = this.props.isEdit,
        hash = {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    fragment = fragment ? JSON.parse(fragment) : [];
    fragment.map(v => {
      if(v.hash) {
        hash[v.hash] = {
          expect: v.expect || ""
        }
      }
      v.tArray && v.tArray.map(v => {
        if(v.hash) {
          hash[v.hash] = {
            expect: v.expect || "",
            value: v.value || ""
          }
        }
      });
    });
    return (
      <Modal title={ `${ isEdit ? "编辑" : "创建" }用例` } visible={ this.state.visible } onCancel={ this.handleCancel.bind(this) } footer={ [<Button key="back" type="ghost" size="large" onClick={ this.handleCancel.bind(this) }>取 消</Button>, <Button key="submit" type="primary" size="large" loading={ this.state.confirmLoading } onClick={ this.handleOk.bind(this) }>{ isEdit ? "保 存" : "创 建" }</Button>, <Button key="continue" type="primary" size="large" loading={ this.state.continueLoading } onClick={ this.handleContinue.bind(this) }>{ `${ isEdit ? "保存" : "创建" }并执行` }</Button>] }>
        <Form horizontal>
          <FormItem { ...formItemLayout } label="用例名称">
            { getFieldDecorator("name", {
                initialValue: this.props.cases.name,
                rules: [ { required: true, whitespace: false, message: "请输入用例名称！" } ]
              })(
                <Input placeholder="用例名称" />
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="数据">
            { getFieldDecorator("data", {
                initialValue: JSON.stringify(hash),
                rules: [ { required: true, whitespace: false, message: "请输入用例数据！" } ]
              })(
                <Input type="textarea" placeholder="数据" rows={ 5 } />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
