import React from "react";
import { Modal, Form, Input } from "antd";

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
      onSubmit instanceof Function && onSubmit({ ...values, mid: this.props.selectedModel._id});
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
    let getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal title="编辑模板" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
        <Form horizontal>
          <FormItem { ...formItemLayout } label="模板名称">
            { getFieldDecorator("name", {
                initialValue: this.props.selectedModel.name,
                rules: [ { required: true, whitespace: false, message: "请输入模板名称！" } ]
              })(
                <Input placeholder="模板名称" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
