import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import { Form, Input, Select, DatePicker, Tabs, Button, Table, Cascader, Upload, Icon } from 'antd';
import '../../style/edit.css';
import options from '../../util/address';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class GoodsEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadFileConfig: {
        name: 'file',
        action: '', // 地址
        data: {}, // 参数
        accept: "image/jpg, image/png, application/pdf, application/xlsx, application/doc",
        multiple: true
      },
      fileList: [
        {
          uid: -1,
          name: 'x8.png',
          status: 'done',
          url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        },
        {
          uid: 0,
          name: 'x90.png',
          status: 'done',
          url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        }
      ],
      uploadImageConfig: {
        name: 'image',
        listType: 'picture-card',
        action: '', // 地址
        data: {}, // 参数
        accept: "image/jpg, image/png",
        multiple: true
      },
      imageList: [
        {
          uid: -1,
          name: 'x8.png',
          status: 'done',
          url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        },
        {
          uid: 0,
          name: 'x90.png',
          status: 'done',
          url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        }
      ]
    }
  }
  fileUploadChange = (info) => {
    console.log(info)
    let fileList = info.fileList;
    // 1. 上传列表数量的限制, 取最后5个
    fileList = fileList.slice(-5);

    this.setState({ fileList });
  }
  imageUploadChange = (info) => {
    console.log(info)
    let imageList = info.fileList;
    // 1. 上传列表数量的限制, 取最后10个
    imageList = imageList.slice(-10);

    this.setState({ imageList });
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const { getFieldProps } = this.props.form;
    const selectProps = getFieldProps('select', {
      rules: [
        { required: true, message: '请选择地址' },
      ],
    });
    const addressProps = getFieldProps('address', {
      rules: [{ required: true, type: 'array', message: '请选择地址' }],
    });
    const goodsNameProps = getFieldProps('goodsName', {
      rules: [{ required: true, type: 'array', message: '请输入资产名称' }],
    });
    return (
      <div className="goods_edit">
        <Breadcrumb location={this.props.match}/>
        <div className="info">
          <div className="title">台账信息</div>
            <Form horizontal className="box">
              <FormItem
                {...formItemLayout}
                label="所属工程公司："
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">局/处/项目部</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="资产管理部门："
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">XXX项目部</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="项目名称："
              >
                <Input placeholder="请输入" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="所在地："
              >
                <Cascader {...addressProps} options={options} onChange={this.addressChange} placeholder="请选择地区" /> 
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="资产分类："
              >
                周转材料
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="材料编码："
              >
                <Input placeholder="请输入" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="工程类型"
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">XXX项目部</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="资产名称"
              >
                <Input {...goodsNameProps} placeholder="请输入" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="供应商"
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">XXX项目部</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="购入时间"
              >
                <DatePicker />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="资产别名"
              >
                <Input placeholder="请输入" />
              </FormItem>  
              <FormItem
                {...formItemLayout}
                label="参数备注"
              >
                <Input placeholder="请输入" />
              </FormItem> 
              <FormItem
                {...formItemLayout}
                label="规格"
              >
                <Input placeholder="请输入" addonAfter="元"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="单价（不含税）"
              >
                <Input placeholder="请输入" addonAfter="元"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="单价（含税）"
              >
                <Input placeholder="请输入" addonAfter="元"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="原值"
              >
                <Input placeholder="请输入" addonAfter="元"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="待摊销金额"
              >
                <Input placeholder="请输入" addonAfter="元"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="已摊销比例"
              >
                <Input placeholder="请输入"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="资产状态"
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">XXX项目部</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="类型"
              >
                <Select showSearch placeholder="请选择">
                  <Option value="jack">A</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="进场类别"
              >
                <Select showSearch placeholder="请选择">
                  <Option value="0">自购</Option>
                  <Option value="1">调入</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="预计退场时间"
              >
                <DatePicker />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="周转次数"
              >
                0
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注"
                className="whole"
              >
                <input type="textarea" className="texteara" />
              </FormItem>
            </Form>
        </div>
        <div className="images">
          <div className="title">
              资产图片<span className="little">最多上传10个格式为jpg、png的文件，单个文件体积小于5M</span>
          </div>
          <div className="box">
          <Upload {...this.state.uploadImageConfig} fileList={this.state.imageList} onChange={this.imageUploadChange} className="upload-list-inline">
            <Icon type="plus" />
            <div className="ant-upload-text">上传照片</div>
          </Upload>
          </div>
        </div>
        <div className="file">
          <div className="title">
            附件<span className="little">最多上传5个格式为doc、xlsx、pdf、jpg、png单个文件，体积小于5M的图片</span>
          </div>
          <Upload className="upload" {...this.state.uploadFileConfig} fileList={this.state.fileList} onChange={this.fileUploadChange}>
            <Button type="ghost">
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </div>
        <div className="submit">
            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                &nbsp;&nbsp;&nbsp;
            <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </div>
      </div>
    )
  }
  addressChange = (value) => {
    console.log(value)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');
      console.log(values);
    });
  }
}
const mapStateToProps = state => {
  return {
  }
}
GoodsEdit = createForm()(GoodsEdit)
export default withRouter(connect(mapStateToProps)(GoodsEdit))
