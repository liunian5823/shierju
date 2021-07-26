import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import './index.css';
import '../../../style/edit.css';
import { Input, Select, DatePicker, Tabs, Button, Table, Modal, Form } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class Edit extends React.Component {
  constructor(props){
    super(props)
  }
  add = () => {
    const { form } = this.props;
    let keys = form.getFieldValue('keys');
    console.log(keys)
    if (keys.length >= 6) {
      return
    }
    // uuid是审批人的默认值
    let uuid = 1
    keys = keys.concat(uuid);
    form.setFieldsValue({
      keys,
    });
  }
  submit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log(errors);
      }
      console.log(values);
    });
  }
  render () {
    const { getFieldProps, getFieldValue } = this.props.form;
    // 初始化默认值
    getFieldProps('keys', {
      initialValue: ["0", "0", "1", 1],
    });
    const formItems = getFieldValue('keys').map((key, index) => {
      return (
        index == 0 ? <FormItem
        label="所属工程公司："
      >
        <Select className="comp" showSearch placeholder="请选择" defaultValue={key}>
          <Option value="0">SSS工程公司</Option>
        </Select>
      </FormItem>
      : index == 1 ? <FormItem
        label="项目部："
      >
        <Select className="comp" showSearch placeholder="请选择" defaultValue={key}>
          <Option value="0">SSS项目部</Option>
        </Select>
      </FormItem>
      : index == 2 ? <div>
        <FormItem
          required
          label="状态："
        >
          <Select className="comp" showSearch placeholder="请选择" defaultValue={key}>
            <Option value="0">关闭</Option>
            <Option value="1">开启</Option>
          </Select>
        </FormItem>
        <div className="add">
          <label><span className="red">*</span>选择审批人：<span className="little">（最多支持3级审批）</span></label>
          <Button className="btn" type="primary" onClick={this.add}>添加</Button>
        </div>
      </div>
      : <FormItem
          required
          label={`${index - 2}级审批`}
        >
          <Select className="comp" showSearch placeholder="请选择" defaultValue={key}>
            <Option value={0}>张三</Option>
            <Option value={1}>李四</Option>
          </Select>
        </FormItem>
      )
    });
    return (
      <div className="approve_edit">
        <Breadcrumb location={this.props.match} />
        <div className="box">
          <div className="title">审批信息</div>
            <Form horizontal>
              <FormItem>
                局级单位：<b>XXX局集团有限公司</b>
              </FormItem>
              {formItems}
            </Form>
        </div>
        <div className="bottom">
          <Button>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submit}>保存</Button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
Edit = createForm()(Edit)
export default withRouter(connect(mapStateToProps)(Edit))