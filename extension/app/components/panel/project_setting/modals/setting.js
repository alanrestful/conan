import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const FormItem = Form.Item,
      Option = Select.Option;

@Form.create()
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    })
  }

  /**
   * 点击确定的事件
   * @return {[type]} [description]
   */
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
      onSubmit instanceof Function && onSubmit({ ...values, name: this.state.selectedProjectName });
      this.handleCancel();
    });
  }

  /**
   * 点击取消的事件
   * @return {[type]} [description]
   */
  handleCancel() {
    this.setState({
      confirmLoading: false
    });
    this.props.onClose();
  }

  /**
   * 切换项目名称
   * @param  {Int} id 项目ID
   * @return {[type]}    [description]
   */
  changeProjectName(id) {
    let env,
        name,
        projects = this.props.projects || [];
    projects.map(v => {
      if(v._id == id) {
        env = v.env_json;
        name = v.name;
      }
    });
    this.setState({
      selectedProjectId: id,
      selectedProjectName: name,
      env
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let getFieldDecorator = this.props.form.getFieldDecorator,
        project = this.props.project || {},
        projects = this.props.projects || [],
        env = this.state.env || [];
    return (
      <Modal title="设置" visible={ this.state.visible } onOk={ this.handleOk.bind(this) } confirmLoading={ this.state.confirmLoading } onCancel={ this.handleCancel.bind(this) }>
        <Form horizontal>
          <FormItem { ...formItemLayout } label="项目">
            { getFieldDecorator("id", {
                initialValue: project.id || "",
                rules: [ { required: true, whitespace: true, message: "请选择项目名称！" } ],
                onChange: this.changeProjectName.bind(this)
              })(
                <Select>
                  <Option value="">请选择...</Option>
                  {
                    projects.map((v, i) => {
                      return <Option key={ i } value={ v._id }>{ v.name }</Option>
                    })
                  }
                  <Option value="-" disabled>更多...</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="环境">
            { getFieldDecorator("env", {
                initialValue: project.env || "",
                rules: [ { required: true, whitespace: true, message: "请选择环境！" } ]
              })(
                <Select>
                  <Option value="">请选择...</Option>
                  {
                    env.map((v, i) => {
                      return <Option key={ i } value={ v.name }>{ v.name }</Option>
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="IP地址">
            { getFieldDecorator("ip", {
                initialValue: project.ip || "192.168.1.1",
                rules: [ { required: true, whitespace: false, message: "请输入IP地址！" } ]
              })(
                <Input placeholder="服务端IP地址" />
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="设备">
            { getFieldDecorator("device", {
                initialValue: project.device || "chrome"
              })(
                <Select>
                  <Option value="chrome">Chrome</Option>
                  <Option value="Firefox">Firefox</Option>
                  <Option value="Webview">Webview</Option>
                  <Option value="" disabled>更多...</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem { ...formItemLayout } label="日志级别">
            { getFieldDecorator("logs", {
                initialValue: project.logs || "warning"
              })(
                <Select>
                  <Option value="log">Log</Option>
                  <Option value="info">Info</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="error">Error</Option>
                </Select>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
