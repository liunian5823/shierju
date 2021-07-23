import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Breadcrumb from '@/twbureau/components/breadcrumb';
import { Form, Input, Select, DatePicker, Tabs, Button, Table, Cascader, Upload, Icon } from 'antd';
import '../../style/edit.css';
import options from '../../util/address';
import api from '@/framework/axios';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class revolvingEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData:{
        turnoverTime:"1"
      },
      typeFlag: true,
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
  componentWillMount() {
    var type = this.props.match.params.type
    if (type == 'add') {
      this.setState({
        typeFlag: true,
      })
    
    } else {
      this.setState({
        typeFlag: false
      })
      api.ajax("get", "http://10.10.9.175:9999/materialRevolvingController/getMaerialRevolving/" + this.props.match.params.id, {}).then(r => {
        console.log(r)
        var xiangqings = r.data        
        // xiangqings = {
        //   address: ["110000", "110100", "110101"],
        //   amortizationRatio: "10",
        //   approachType: "0",
        //   assetsAlias: "别名723",
        //   belongingCompany: "jack",
        //   buyTime: "2021-07-23T10:01:17.506Z",
        //   cityId: "110100",
        //   cityName: "市辖区",
        //   countyId: "110101",
        //   countyName: "东城区",
        //   department: "jack",
        //   exitTime: "2021-07-23T10:01:40.594Z",
        //   materialType: "01-01-00001-210609000001",
        //   name: "项目名称723",
        //   number: "678",
        //   amountAmortised:'12',
        //   originalValue: "412",
        //   parameterRemark: "sfsdg",
        //   projectType: "1",
        //   provinceId: "110000",
        //   provinceName: "北京市",
        //   remark: "54564",
        //   revolvingName: "资产名称723",
        //   standards: "561",
        //   status: "1",
        //   supplier: "jack",
        //   turnoverTime: 0,
        //   type: "1",
        //   unit: "0",
        //   unitPriceTaxexclusive: "451",
        //   unitPriceTaxinclusive: "500",
        // }
        this.setState({
          formData:xiangqings
        })
      }).catch(r => {
        console.log(r)
      })
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
    console.log(this.state.imageList);
    let imageList = info.fileList;
    // 1. 上传列表数量的限制, 取最后10个
    imageList = imageList.slice(-10);

    this.setState({ imageList });
  }


  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    const { getFieldProps, getFieldDecorator, isFieldValidating } = this.props.form;
    const addressProps = getFieldProps('address', {
      rules: [{ required: true, type: 'array', message: '请选择地址' },
      {initialValue:this.state.formData.address}],
      trigger: ['onBlur', 'onChange'],
    });
    const revolvingNameProps = getFieldProps('revolvingName', {
      rules: [{ required: true, message: '请输入资产名称' }],
      trigger: ['onBlur', 'onChange'],
    });

    const supplierProps = getFieldProps('supplier', {
      rules: [{ required: true, message: '请选择供应商' }],
      trigger: ['onBlur', 'onChange'],
    });
    const buyTimeProps = getFieldProps('buyTime', {
      rules: [{ required: true, type: 'date', message: '请选择购入日期' }],
      trigger: ['onBlur', 'onChange'],
    })
    const assetsAliasProps = getFieldProps('assetsAlias', {
      rules: [{ max: 30, message: '最多可输入30 个字符' }],
      trigger: ['onChange'],
    })
    const parameterProps = getFieldProps('parameterRemark', {
      rules: [{ max: 30, message: '最多可输入30 个字符' }],
      trigger: ['onChange'],
    })
    const standardsProps = getFieldProps('standards', {
      rules: [{ max: 30, message: '最多可输入30 个字符' }],
      trigger: ['onChange'],
    })
    const TaxexclusiveProps = getFieldProps('unitPriceTaxexclusive', {
      rules: [{ required: true, message: "请输入" }],
      trigger: ['onBlur', 'onChange'],
    })
    const TaxinclusiveProps = getFieldProps('unitPriceTaxinclusive', {
      rules: [{ required: true, message: "请输入金额" }],
      trigger: ['onBlur', 'onChange'],
    })
    const originalProps = getFieldProps('originalValue', {
      rules: [{ required: true, message: "请输入原值" }],
      trigger: ['onBlur', 'onChange'],
    })
    const numberProps = getFieldProps('number', {
      rules: [{ required: true, message: "请输入数量", trigger: "blur" },
      { max: 30, message: '最多可输入30 个字符' }],
      trigger: ['onChange'],
    })
    const unitProps = getFieldProps('unit', {
      rules: [{ required: true, message: "请选择单位" }],
      trigger: ['onBlur', 'onChange'],
    })
    const ratioProps = getFieldProps('amortizationRatio', {
      rules: [{ required: true, message: "请输入已摊销比例" }],
      trigger: ['onBlur', 'onChange'],
    })
    const statusProps = getFieldProps('status', {
      rules: [{ required: true, message: "请选择物资状态" }],
      trigger: ['onBlur', 'onChange'],
    })
    const typeProps = getFieldProps('materialType', {
      rules: [{ required: true, message: "请选择类型" }],
      trigger: ['onBlur', 'onChange'],
    })
    const approachProps = getFieldProps('approachType', {
      rules: [{ required: true, message: "请选择进场类别" }],
      trigger: ['onBlur', 'onChange'],
    })
    const exitProps = getFieldProps('exitTime', {
      rules: [{ required: true, type: 'date', message: "请选择日期" }],
      trigger: ['onBlur', 'onChange'],
    })
    return (
      <div className="goods_edit">
        <Breadcrumb location={this.props.match} />
        <div className="info">
          <div className="title">台账信息</div>
          <Form horizontal className="box" initialValues={{ turnoverTime: 1  }} >
            <FormItem
              {...formItemLayout}
              label="所属工程公司："
            >
              <Select showSearch placeholder="请选择" {...getFieldProps('belongingCompany',{initialValue:this.state.formData.belongingCompany})}>
                <Option value="jack">局/处/项目部</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产管理部门："
            >
              <Select showSearch placeholder="请选择" {...getFieldProps('department',{initialValue:this.state.formData.department})}>
                <Option value="jack">XXX项目部</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="项目名称："
            >
              <Input placeholder="请输入" {...getFieldProps('name',{initialValue:this.state.formData.name})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所在地："
            >
              <Cascader {...addressProps} options={options} placeholder="请选择地区"/>
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
              <Input placeholder="请输入" {...getFieldProps('materialType',{initialValue:this.state.formData.materialType})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="工程类型"
            >
              <Select showSearch placeholder="请选择" {...getFieldProps('projectType',{initialValue:this.state.formData.belongingCompany})}>
                <Option value="1">铁路</Option>
                <Option value="2">公路</Option>
                <Option value="3">水利</Option>
                <Option value="4">市政</Option>
                <Option value="5">电气化</Option>
                <Option value="6">房建</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产名称"
            >
              <Input {...revolvingNameProps} placeholder="请输入" {...getFieldProps('revolvingName',{initialValue:this.state.formData.revolvingName})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              <Select showSearch placeholder="请选择" {...supplierProps} {...getFieldProps('supplier',{initialValue:this.state.formData.supplier})} >
                <Option value="jack">XXX项目部</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="购入时间"
            >
              <DatePicker  {...buyTimeProps} {...getFieldProps('buyTime',{initialValue:this.state.formData.buyTime})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产别名"
            >
              <Input placeholder="请输入" {...assetsAliasProps} {...getFieldProps('assetsAlias',{initialValue:this.state.formData.assetsAlias})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="参数备注"
            >
              <Input placeholder="请输入" {...parameterProps} {...getFieldProps('parameterRemark',{initialValue:this.state.formData.parameterRemark})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="规格"
            >
              <Input placeholder="请输入" addonAfter="元" {...standardsProps} {...getFieldProps('standards',{initialValue:this.state.formData.standards})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单价（不含税）"
            >
              <Input placeholder="请输入" addonAfter="元" {...TaxexclusiveProps} {...getFieldProps('unitPriceTaxexclusive',{initialValue:this.state.formData.unitPriceTaxexclusive})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单价（含税）"
            >
              <Input placeholder="请输入" addonAfter="元" {...TaxinclusiveProps} {...getFieldProps('unitPriceTaxinclusive',{initialValue:this.state.formData.unitPriceTaxinclusive})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="原值"
            >
              <Input placeholder="请输入" addonAfter="元" {...originalProps} {...getFieldProps('originalValue',{initialValue:this.state.formData.originalValue})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数量"
              required
              className='item-number'
            >
              <Input placeholder="请输入"  {...numberProps} {...getFieldProps('number',{initialValue:this.state.formData.number})}/>
              <Select placeholder="请选择" {...unitProps} {...getFieldProps('unit',{initialValue:this.state.formData.unit})}>
                <Option value="0">套</Option>
                <Option value="1">台</Option>
                <Option value="2">根</Option>
                <Option value="3">块</Option>
                <Option value="4">片</Option>
                <Option value="5">间</Option>
                <Option value="6">个</Option>
                <Option value="7">节</Option>
                <Option value="8">米</Option>
                <Option value="9">平米</Option>
                <Option value="10">吨</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="待摊销金额"
            >
              <Input placeholder="请输入" addonAfter="元" disabled={this.state.typeFlag} {...getFieldProps('amountAmortised',{initialValue:this.state.formData.amountAmortised})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已摊销比例"
            >
              <Input placeholder="请输入" {...ratioProps} {...getFieldProps('amortizationRatio',{initialValue:this.state.formData.amortizationRatio})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产状态"
            >
              <Select showSearch placeholder="请选择" {...statusProps} {...getFieldProps('status',{initialValue:this.state.formData.status})}>
                <Option value="1">在用</Option>
                <Option value="2">闲置</Option>
                <Option value="3">可周转</Option>
                <Option value="5">已周转</Option>
                <Option value="6">可处置</Option>
                <Option value="8">已处置</Option>
                <Option value="9">可租赁</Option>
                <Option value="10">已租赁</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              <Select showSearch placeholder="请选择" {...typeProps} {...getFieldProps('materialType',{initialValue:this.state.formData.status})}>
                <Option value="1">A</Option>
                <Option value="2">B</Option>
                <Option value="3">C</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="进场类别"
            >
              <Select showSearch placeholder="请选择" {...approachProps} {...getFieldProps('approachType', { initialValue: this.state.formData.approachType })}>
                <Option value="0">自购</Option>
                <Option value="1">调入</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预计退场时间"
            >
              <DatePicker {...exitProps} {...getFieldProps('exitTime', { initialValue: this.state.formData.exitTime })}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="周转次数"
            >
              <Input disabled={true} {...getFieldProps('turnoverTime', { initialValue: this.state.formData.turnoverTime })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
              className="whole"
            >
              <input type="textarea" className="texteara" {...getFieldProps('remark', { initialValue: this.state.formData.remark })} />
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
          <Button type="ghost" onClick={this.handleReset}>关闭</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </div>
      </div>
    )
  }
  addressChange(e) {
    console.log(e);
    // const submitForm = this.state.submitForm;

    // let params = {
    //     provinceId: arr[0] ? arr[0].value : null,
    //     provinceName: arr[0] ? arr[0].label : null,
    //     cityId: arr[1] ? arr[1].value : null,
    //     cityName: arr[1] ? arr[1].label : null,
    //     countyId: arr[2] ? arr[2].value : null,
    //     countyName: arr[2] ? arr[2].label : null,
    // }
    // this.setState({
    //     submitForm: {
    //         ...submitForm,
    //         ...params
    //     }
    // })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');
      values['type'] = "1"
      values['provinceId'] = values.address[0]
      values['cityId'] = values.address[1]
      values['countyId'] = values.address[2]
      console.log(options);
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        if (element.value == values.address[0]) {
          values['provinceName'] = element.label
          for (let index = 0; index < element.children.length; index++) {
            const element1 = element.children[index];
            if (element1.value == values.address[1]) {
              values['cityName'] = element1.label
              for (let index = 0; index < element1.children.length; index++) {
                const element2 = element1.children[index];
                if (element2.value == values.address[2]) {
                  values['countyName'] = element2.label
                }
              }
            }
          }
        }
      }
      console.log(values);
      if (this.state.typeFlag) {
        api.ajax("post", "http://10.10.9.175:9999/materialRevolvingController/insertRevolving", { ...values }).then(r => {
          if (r) {
            if (refresh) { refresh() } else {
              this.handleSearch(this.state.dataSource.pageNum, this.state.dataSource.pageSize);
            }
            message.success(r.msg);
          }
        });
      } else {
        api.ajax("post", "http://10.10.9.66:9999/materialRevolvingController/updateMaterialRevolving", { ...values }).then(r => {
          if (r) {
            if (refresh) { refresh() } else {
              this.handleSearch(this.state.dataSource.pageNum, this.state.dataSource.pageSize);
            }
            message.success(r.msg);
          }
        });
      }
    });
  }
}
const mapStateToProps = state => {
  return {
  }
}
revolvingEdit = createForm()(revolvingEdit)
export default withRouter(connect(mapStateToProps)(revolvingEdit))
