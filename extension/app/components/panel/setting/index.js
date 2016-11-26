require("../index.scss");

import React from "react";
import pureRender from "pure-render-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, Form, Input, Select, Button, message } from "antd";

const FormItem = Form.Item,
      Option = Select.Option;

@Form.create()
@connect(state => ({}), dispatch => bindActionCreators({}, dispatch))
@pureRender
export default class extends React.Component {

  constructor(props) {
    super(props);
    let config = localStorage.getItem("config");
    if(config) {
      config = JSON.parse(config);
    } else {
      config = {};
    }
    this.state = {
      config,
      visible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.config) {
      this.setState({
        config: nextProps.config
      });
    }
  }

  /**
   * 保存配置信息
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  configSubmit(event) {
    event.preventDefault();
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
      localStorage.setItem("config", JSON.stringify(values));
      message.success("保存成功！")
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let getFieldDecorator = this.props.form.getFieldDecorator,
        config = this.state.config;
    return (
      <div>
        <Card title="全局设置" className="panel">
          <Form horizontal onSubmit={ this.configSubmit.bind(this) }>
            <FormItem wrapperCol={{ span: 16, offset: 6 }}>
              Client配置
            </FormItem>
            <FormItem { ...formItemLayout } label="测试服务器">
              { getFieldDecorator("testerServer", {
                  initialValue: config.testerServer,
                  rules: [ { required: true, whitespace: true, message: "请输入测试服务器地址！" } ]
                })(
                  <Input placeholder="测试服务器地址" />
                )
              }
            </FormItem>
            <FormItem { ...formItemLayout } label="日志级别">
              { getFieldDecorator("logLevel", {
                  initialValue: config.logLevel || "log",
                  rules: [ { required: true, whitespace: true, message: "请选择日志级别！" } ]
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
            <FormItem { ...formItemLayout } label="同步测试">
              { getFieldDecorator("syncTester", {
                  initialValue: config.syncTester || "true",
                  rules: [ { required: true, whitespace: true, message: "请选择是否同步测试！" } ]
                })(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }}>
              WebDriver配置
            </FormItem>
            <FormItem { ...formItemLayout } label="引擎">
              { getFieldDecorator("driver", {
                  initialValue: config.driver || "",
                  rules: [ { required: true, whitespace: true, message: "请选择Web引擎！" } ]
                })(
                  <Select>
                    <Option value="">请选择Web引擎</Option>
                    <Option value="chrome">Chrome</Option>
                    <Option value="firefox">FireFox</Option>
                    <Option value="ie">IE</Option>
                    <Option value="opera">Opera</Option>
                    <Option value="safari">Safari</Option>
                    <Option value="android">Android</Option>
                    <Option value="MicrosoftEdge">MicrosoftEdge</Option>
                    <Option value="iPad">iPad</Option>
                    <Option value="iPhone">iPhone</Option>
                    <Option value="phantomjs">Phantomjs</Option>
                    <Option value="htmlunit">Htmlunit</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem { ...formItemLayout } label="地址">
              { getFieldDecorator("path", {
                  initialValue: config.path,
                  rules: [ { required: true, whitespace: true, message: "请输入WebDriver地址！" } ]
                })(
                  <Input placeholder="WebDriver地址" />
                )
              }
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }}>
              <Button type="primary" htmlType="submit">保 存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}
