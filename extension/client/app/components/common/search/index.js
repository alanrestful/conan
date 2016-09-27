import React from "react";
import { Input, Button } from "antd";
import classNames from "classnames";

const InputGroup = Input.Group;

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      focus: false
    };
  }

  handleInputChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleFocusBlur(event) {
    this.setState({
      focus: event.target === document.activeElement
    });
  }

  handleSearch() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.value);
    }
  }

  render() {
    const { style, size, placeholder } = this.props;
    const btnCls = classNames({
      "ant-search-btn": true,
      "ant-search-btn-noempty": !!this.state.value.trim()
    });
    const searchCls = classNames({
      "ant-search-input": true,
      "ant-search-input-focus": this.state.focus
    });
    return (
      <div className="ant-search-input-wrapper" style={ style }>
        <InputGroup className={ searchCls }>
          <Input placeholder={ placeholder || "请输入搜索内容" } value={ this.state.value } onChange={ this.handleInputChange.bind(this) } onFocus={ this.handleFocusBlur.bind(this) } onBlur={ this.handleFocusBlur.bind(this) } onPressEnter={ this.handleSearch.bind(this) }/>
          <div className="ant-input-group-wrap">
            <Button icon="search" className={ btnCls } size={ size } onClick={ this.handleSearch.bind(this) }/>
          </div>
        </InputGroup>
      </div>
    )
  }
}
