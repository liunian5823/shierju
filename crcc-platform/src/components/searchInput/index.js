import React from 'react';
import {Button,Input} from 'antd';
const InputGroup = Input.Group;
import "./contact.css";

import less from "./contact.less";
import classNames from 'classnames';


export default class SearchInput extends React.Component{
    state = {
        value: this.props.value,
        focus: false
    }
    handleInputChange =(e)=> {
        this.props.keyWordsOnChange(e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    handleFocusBlur =(e)=> {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }
    handleSearch=()=> {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    }
    resetInput=()=>{
        this.setState({value:""})
    }
    componentDidMount() {
        this.props.resetInputRef(this);
    }
    render(){
        const { style, size, placeholder } = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': this.state.value?!!this.state.value.trim():false,
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });
        return(
            <div className="ant-search-input-wrapper" style={style}>
                <div style={{display: 'flex'}}>
                    <InputGroup className={searchCls}>
                        <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
                            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
                        />
                        <div className="ant-input-group-wrap">
                            <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
                        </div>
                    </InputGroup>
                    <span onClick={()=>{
                        this.setState({
                            value: ''
                        })
                        }} className="empty_btn">
                        清空
                    </span>
                </div>
            </div>
        )
    }
}