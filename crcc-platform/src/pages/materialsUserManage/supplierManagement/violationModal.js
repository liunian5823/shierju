import { Form, Select, Modal, Input, InputNumber, Cascader } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';

const FormItem = Form.Item;

class ViolationModal extends React.Component {
  visible = false;
  state = {
    type: '4',//处理类型
    isClose: false,//是否永久关闭
    region: [],
    violationResult:[],
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    if (this.visible != this.props.visible) {
      this.visible = this.props.visible;
      if (!this.props.visible) {
        // 重置数据
        this.props.form.resetFields();
        return
      }
      if(this.props.formData.companyId){
        this.getViolation();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getViolation = () =>{
    let companyId =   this.props.formData.companyId
    let companyUUIDS = this.props.formData.companyUUIDS
    api.ajax('GET', '@/portal/ecStore/queryStoreStatus', {
      companyId: companyId
    }).then(r => {
      let violationResult = this.violationResultFunction();
      if(r.data.status != 0){
        violationResult = violationResult.filter(obj=> obj.id != 4)
      }
      //交易管理
      if(r.data.dealSwitch != 0){
        violationResult = violationResult.filter(obj=> obj.id != 2)
      }
      //限制提现
      if(r.data.moneySwitch != 0){
        violationResult = violationResult.filter(obj=> obj.id != 3)
      }

      this.getCompanyBlack(companyUUIDS,violationResult);
    }).catch(r => {
      this.setState({
        violationResult: this.violationResultFunction()
      })
    })
  }

  getCompanyBlack  = (companyUUIDS,violationResult) =>{
    api.ajax('GET', '@/supplier/ecCompanySupplier/getCompanyInfo', {
      uuids: companyUUIDS
    }).then(r => {
      if (r.data.blackCompanyType == 1) {
        violationResult  = violationResult.filter(obj=> obj.id != 1)
      }
      this.setState({
        violationResult: violationResult,
      })
    }).catch(r => {
      this.setState({
        violationResult: this.violationResultFunction()
      })
    })
  }


  violationResultFunction = () =>{
    return [
      {
        id: '2',
        value: "关闭交易"
      },
      {
        id: "4",
        value: "关闭店铺"
      }, {
        id: "1",
        value: "拉黑公司"
      }, {
        id: "3",
        value: "限制提现"
      }
    ]
  }

  violationOptions = () => {
    return [
      {
        value: '1',
        label: '一类违规',
        children: [
            {
              value: '1',
              label: '资质造假',
              children : this.violationOptionsChildren()
            },
          {
            value: '2',
            label: '知识侵权',
            children : this.violationOptionsChildren()
          },
          {
            value: '3',
            label: '违规发布',
            children : this.violationOptionsChildren()
          }
        ]
      },
      {
        value: '2',
        label: '二类违规',
        children: [
          {
            value: '4',
            label: '恶意报价',
            children : this.violationOptionsChildren()
          },
          {
            value: '5',
            label: '围标串标',
            children : this.violationOptionsChildren()
          },
          {
            value: '6',
            label: '扰乱秩序',
            children : this.violationOptionsChildren()
          }
        ]
      },
      {
        value: '3',
        label: '三类违规',
        children: [
          {
            value: '7',
            label: '拒绝履约',
            children : this.violationOptionsChildren()
          },
          {
            value: '8',
            label: '履约欺诈',
            children : this.violationOptionsChildren()
          },
          {
            value: '9',
            label: '质量缺陷',
            children : this.violationOptionsChildren()
          },{
            value: '10',
            label: '服务怠慢',
            children : this.violationOptionsChildren()
          },{
            value: '11',
            label: '税务违规',
            children : this.violationOptionsChildren()
          }
        ]
      }

    ]
  };

  violationOptionsChildren = () =>{
    return [
      {
        value: '1',
        label: '情节较轻',
      },
      {
        value: '2',
        label: '情节一般',
      },
      {
        value: '3',
        label: '情节严重',
      },
      {
        value: '4',
        label: '情节恶劣',
      }
    ]

  }

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      values.companyId = this.props.formData.companyId
      if(values.punish_choose_reason){
        values.punishType = values.punish_choose_reason[0]
        values.punlishBehavior = values.punish_choose_reason[1]
        values.punlishDegree = values.punish_choose_reason[2]
      }
      this.props.onOk(values);
    })
  }
  handleCancel = () => {
    this.props.onCancel();
  }


  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <Modal
        title='供应商违规处罚'
        wrapClassName="vertical-center-modal"
        confirmLoading={this.props.confirmLoading}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form>
          <FormItem
            label='公司名称'
            {...formItemLayout}>
            {this.props.formData.companyName}
          </FormItem>
          <FormItem
            label="营业执照号"
            {...formItemLayout}>
            {this.props.formData.bussinessLisence}
          </FormItem>
          <FormItem
            label="违规原因"
            {...formItemLayout}>
            <Cascader
                options={this.violationOptions()}
                placeholder="请选择违规原因"
                {...getFieldProps('punish_choose_reason',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入违规原因'
                        }
                      ]
                    })}

            />
          </FormItem>

          <FormItem
            label="其他行为"
            {...formItemLayout}>
            <Input
              type="textarea"
              placeholder="其他行为"
              rows={6}
              {...getFieldProps('otherReason',
                {
                  rules: [
                    {
                      message: '请输入其他行为'
                    }
                  ]
                })} />
          </FormItem>

          <FormItem
              label="处罚措辞"
              {...formItemLayout}>
            <Select
                placeholder='请选择处罚措辞'
                {...getFieldProps('result',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择处罚措辞'
                        }
                      ]
                    })}>
              {Util.getOptionList(this.state.violationResult)}
            </Select>
          </FormItem>
          <FormItem
              label="处罚期限"
              {...formItemLayout}>
            <Select
                placeholder='请选择处罚期限'
                {...getFieldProps('punlishDays',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择处罚期限'
                        }
                      ]
                    })}>
              {Util.getOptionList([
                {
                  id: '0',
                  value: "0天"
                },
                {
                  id: "7",
                  value: "7天"
                }, {
                  id: "30",
                  value: "30天"
                }, {
                  id: "90",
                  value: "90天"
                }
              ])}
            </Select>
          </FormItem>
          <FormItem
              label="处罚理由"
              {...formItemLayout}>
            <Input
                type="textarea"
                placeholder="处罚理由"
                rows={6}
                {...getFieldProps('processingPersonReasons',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入处罚理由'
                        }
                      ]
                    })} />
          </FormItem>
        </Form>

      </Modal>
    )
  }
}

export default Form.create()(ViolationModal);