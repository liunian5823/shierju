import React from 'react';
import { Modal, Button, Form, Radio, Select, Input, Alert } from 'antd';
import './index.css';
import httpsapi from '@/twbureau/api/api';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Status extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      updateType: 0,
      verify: 1,
      remark: '',
      showConfirmModel: false,
      data: ''
    }
  }

  static defaultProps = {
    visible: false, // 默认值不展示
    step: "look", // step当前步骤 look：查看物资状态 update: 更新状态 vertify: 审核
    // 物资状态数据 从父组件传入
    // status: {
    //   name: '资产名称', // 资产名称
    //   type: "周转材料", // 资产类别
    //   standards: 'KKK', // 规格型号
    //   department: 'xx部门', // 资产管理部门
    //   befoeupdateStatus: '0', // 更新前资产状态
    //   afterupdateStatus: '1', // 更新后资产状态
    //   number1: '999', //数量 没找到对应字段名称，可改成跟接口字段名称一致
    //   unit1: '',//单位 没找到对应字段名称，可改成跟接口字段名称一致
    //   updateType: 'all', //更新类型 没找到对应字段名称，可改成跟接口字段名称一致
    //   restStatus: '', //剩余物资状态 没找到对应字段名称，可改成跟接口字段名称一致
    //   number2: '999', //数量 没找到对应字段名称，可改成跟接口字段名称一致
    //   unit2: '',//单位 没找到对应字段名称，可改成跟接口字段名称一致
    //   remark: 'dakdajlfdklas' // 备注 没找到对应字段名称，可改成跟接口字段名称一致
    // },
    // 审批流程数据 从父组件传入
    // process: [
    //   {
    //     head: '项目部XX部长',
    //     name: '张三三',
    //     dateTime: '2021.08.23 12:00:00',
    //     status: '审核通过',
    //     statusKey: 'agree', // agree通过 refuse拒绝 waitting审核中
    //     explain: '我是审批说明'
    //   },
    //   {
    //     head: '项目管理员',
    //     name: '李四小',
    //     dateTime: '2021.08.23 12:00:00',
    //     status: '审核中',
    //     statusKey: 'waitting', // agree通过 refuse拒绝 waitting审核中
    //     explain: '我是审批说明'
    //   },
    //   {
    //     head: '项目管理员',
    //     name: '李四',
    //     dateTime: '2021.08.23 12:00:00',
    //     status: '拒绝',
    //     statusKey: 'refuse', // agree通过 refuse拒绝 waitting审核中
    //     explain: '我是审批说明'
    //   }
    // ]
  }
  // 详情
  details(e) {
    // 1:周转材料；2:施工设备;3:其他循环物资
    if (e.type == "1") {
      this.props.history.push('/tw/MaterialStatus/detailRevolving/' + e.type + '/' + e.prodottoId)
    } else if (e.type == "2") {
      this.props.history.push('/tw/MaterialStatus/detailEquipment/' + e.type + '/' + e.prodottoId)
    } else if (e.type == "3") {
      this.props.history.push('/tw/MaterialStatus/detailRests/' + e.type + '/' + e.prodottoId)
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    })
  }
  onUpdateTypeChange = (e) => {
    this.setState({
      updateType: e.target.value
    }, () => {
      console.log(this.state.updateType);
    })
  }
  onVerifyChange = (e) => {
    this.setState({
      verify: e.target.value
    })
  }
  onRemarkChange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }
  // 更新
  handleSubmit = (e) => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      this.setState({
        showConfirmModel: true
      })
      console.log('Submit!!!');
      this.setState({
        data: values
      })
    });
  }
  // 审核
  handleCertain = () => {
    console.log(this.state.verify, this.state.remark)
  }
  handleCancel = () => {
    this.setState({
      visible: false
    }, () => {
      this.props.statusModule(this.state.visible)
    })
  }
  handleConfirmOk = () => {
    this.setState({
      showConfirmModel: false,
      visible: false
    })
    console.log(this.props.status, this.state.updateType);
    if (this.props.step == "update") {
      var dataObj = {}, obj = this.state.data
      if (obj.unit2 == '0') {
        obj['updateUnit'] = '套'
      } else if (obj.unit2 == '1') {
        obj['updateUnit'] = '台'
      } else if (obj.unit2 == '2') {
        obj['updateUnit'] = '根'
      } else if (obj.unit2 == '3') {
        obj['updateUnit'] = '块'
      } else if (obj.unit2 == '4') {
        obj['updateUnit'] = '片'
      } else if (obj.unit2 == '5') {
        obj['updateUnit'] = '间'
      } else if (obj.unit2 == '6') {
        obj['updateUnit'] = '个'
      } else if (obj.unit2 == '7') {
        obj['updateUnit'] = '节'
      } else if (obj.unit2 == '8') {
        obj['updateUnit'] = '米'
      } else if (obj.unit2 == '9') {
        obj['updateUnit'] = '平米'
      } else if (obj.unit2 == '10') {
        obj['updateUnit'] = '吨'
      }
      dataObj['id'] = this.props.status.id;// id
      dataObj['department'] = this.props.status.department; // 资产管理部门
      dataObj['type'] = this.props.status.type; // 资产类别
      dataObj['standards'] = this.props.status.standards; // 规格型号
      dataObj['name'] = this.props.status.name;// 资产名称
      dataObj['befoeupdateStatus'] = this.props.status.befoeupdateStatus; // 更新前资产状态
      dataObj['number'] = this.props.status.number1; // 数量
      dataObj['unit'] = this.props.status.unit1; //单位
      dataObj['updateType'] = this.state.updateType // 0-全部更新；1-部分更新
      dataObj['afterupdateStatus'] = obj.afterupdateStatus; // 更新后资产状态
      dataObj['updateNumber'] = obj.updateNumber; // 更新后数量
      dataObj['updateRemainderStatus'] = obj.updateRemainderStatus; // 更新后资产状态
      dataObj['updateAfterNumber'] = obj.updateAfterNumber; // 更新后数量
      dataObj['remark'] = obj.remark; //备注
      console.log(dataObj);
      httpsapi.ajax("post", "/inForApproval/save", dataObj).then(r => {
        console.log(r);
      }).catch(r => {
        console.log(r)
      })
    }
  }
  handleConfirmCancel = () => {
    this.setState({
      showConfirmModel: false
    })
  }
  createFooter = () => {
    let footer;
    if (this.props.step == "update") {
      footer = [
        <Button key="back" type="ghost" onClick={this.handleCancel}>返 回</Button>,
        <Button key="submit" type="primary" onClick={this.handleSubmit}>
          提 交
        </Button>,
      ]
    } else if (this.props.step == "look") {
      footer = [
        <Button key="back" type="ghost" onClick={this.handleCancel}>关 闭</Button>
      ]
    } else {
      footer = [
        <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
        <Button key="submit" type="primary" onClick={this.handleCertain}>
          确 认
        </Button>]
    }
    return footer
  }
  checkPass(rule, value, callback) {
    console.log(value);
    callback();
  }
  render() {
    let { visible } = { ...this.state }
    let { status, process, step } = { ...this.props }
    const { getFieldProps } = this.props.form;
    const updateTypeProps = getFieldProps('updateType',
      { 
        initialValue: this.props.status.updateType == '' || this.props.status.updateType == undefined ? this.state.updateType : this.props.status.updateType,
        rules: [{ required: true, message: '请选择更新类型' }],
        trigger: ['onBlur', 'onChange'],
      }
    );
    const afterupdateStatusProps = getFieldProps('afterupdateStatus',
      { 
        initialValue: this.props.status.afterupdateStatus ,
        rules: [{ required: true, message: '请选择更新后物资状态' },{ validator: this.checkPass },],
        trigger: ['onBlur', 'onChange'],
      }
    );
    const updateNumberProps = getFieldProps('updateNumber', {
      initialValue: this.props.status.updateNumber,
    })
    const remainderProps = getFieldProps('updateRemainderStatus',
      { 
        initialValue: this.props.status.updateRemainderStatus, 
        rules: this.state.updateType == 1 ? [{ required: true, message: '请选择剩余物资状态' },] : [{ required: false }], 
      }
    );
    const afterNumberProps = getFieldProps('updateAfterNumber', {
      initialValue: this.props.status.updateAfterNumber,
    })
    const unit1Props = getFieldProps('unit1', {
      initialValue: this.props.status.unit1,
    })
    const remarkProps = getFieldProps('remark', {
      initialValue: this.props.status.remark,
      rules: [
        { required: true, message: '请填写备注' },
      ],
    });
    // 资产状态
    const filterStatus = (status) => {
      if (status == '1') {
        return '在用'
      } else if (status == '2') {
        return '闲置'
      } else if (status == '3') {
        return '可周转'
      } else if (status == '4') {
        return '周转中'
      } else if (status == '5') {
        return '已周转'
      } else if (status == '6') {
        return '可处置'
      } else if (status == '7') {
        return '处置中'
      } else if (status == '8') {
        return '已处置'
      } else if (status == '9') {
        return '可租赁'
      } else if (status == '10') {
        return '已租赁'
      } else if (status == '11') {
        return '报废'
      } else if (status == '12') {
        return '报损'
      }
    }
    // 单位
    const filterUnit= (unit) => {
      if (unit == '0') {
        return '套'
      } else if (unit == '1') {
        return '台'
      } else if (unit == '2') {
        return '根'
      } else if (unit == '3') {
        return '块'
      } else if (unit == '4') {
        return '片'
      } else if (unit == '5') {
        return '间'
      } else if (unit == '6') {
        return '个'
      } else if (unit == '7') {
        return '节'
      } else if (unit == '8') {
        return '米'
      } else if (unit == '9') {
        return '平米'
      } else if (unit == '10') {
        return '吨'
      }
    }

    return (
      <div>
        <Modal
          className="status"
          width="710px"
          title={step !== 'update' ? '查看物资状态' : '修改看物资状态'}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          footer={this.createFooter()}
        >
          <div className="content">
            <Form>
              <FormItem>
                资产管理部门：{status.department}
              </FormItem>
              <FormItem>
                资产类别：{status.type == "1" ? "周转材料" : status.type == "2" ? "施工设备" : "其他循环物资"}
              </FormItem>
              <FormItem>
                规格型号：{status.standards}
              </FormItem>
              <FormItem>
                资产名称：{status.name}
              </FormItem>
              <FormItem>
                更新前物资状态：{filterStatus(status.befoeupdateStatus)}
              </FormItem>
              <FormItem>
                数量：<span className='detail' onClick={() => this.details(status)}>{status.number1} {filterUnit(status.unit1)}</span>
              </FormItem>
              <FormItem
                className="whole"
                label="更新类型："
              >
                <RadioGroup disabled={step !== 'update'} {...updateTypeProps} onChange={this.onUpdateTypeChange.bind(this)}>
                  <Radio key="all" value={0}>全部更新</Radio>
                  <Radio key="part" value={1}>部分更新</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                label="更新后物资状态："
              >
                <Select disabled={step !== 'update'} {...afterupdateStatusProps} className="s_size" showSearch placeholder="请选择">
                  <Option value="1">在用</Option>
                  <Option value="2">闲置</Option>
                  <Option value="3">可周转</Option>
                  <Option value="6">可处置</Option>
                  <Option value="9">可租赁</Option>
                  <Option value="5">已周转</Option>
                  <Option value="8">已处置</Option>
                  <Option value="10">已租赁</Option>
                  <Option value="11">报废</Option>
                  <Option value="12">报损</Option>
                </Select>
              </FormItem>
              <FormItem
                label="更新数量："
              >
                <Input disabled={step !== 'update'} {...updateNumberProps} className="s_size" placeholder="请输入" />
                <Select disabled={step !== 'update'} disabled={true} {...unit1Props} className="xs_size" showSearch placeholder="请选择">
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
              {this.state.updateType == 1 && <FormItem
                label="剩余物资状态："
              >
                <Select disabled={step !== 'update'} {...remainderProps} className="s_size" showSearch placeholder="请选择">
                  <Option value="1">在用</Option>
                  <Option value="2">闲置</Option>
                  <Option value="3">可周转</Option>
                  <Option value="6">可处置</Option>
                  <Option value="9">可租赁</Option>
                  <Option value="5">已周转</Option>
                  <Option value="8">已处置</Option>
                  <Option value="10">已租赁</Option>
                  <Option value="11">报废</Option>
                  <Option value="12">报损</Option>
                </Select>
              </FormItem>}
              {this.state.updateType == 1 && <FormItem
                label="更新数量："
              >
                <Input disabled={step !== 'update'} {...afterNumberProps} className="s_size" placeholder="请输入" />
                <Select disabled={step !== 'update'} disabled={true} {...unit1Props} className="xs_size" showSearch placeholder="请选择">
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
              </FormItem>}
              <FormItem
                className="whole"
                label="备注："
              >
                <Input disabled={step !== 'update'} {...remarkProps} className="textarea" type="textarea" />
              </FormItem>
            </Form>
          </div>
          {(step == 'look' || step == 'vertify') && <div>
            <div className="status-title">审批流程</div>
            <div className="process">
              {
                process.map((item, index) => {
                  return (
                    <div key={index} className={`item ${item.statusKey}`}>
                      <div className="head"><div></div><span>{item.head}</span></div>
                      <div className="info">
                        <div className="name">{item.name}</div>
                        <div className="date">{item.dateTime}</div>
                        <div className="status">{item.status}</div>
                        <div className="explain">审批说明：{item.explain}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>}
          {step == 'vertify' && <div>
            <div className="status-title">审批</div>
            <div className="vertify">
              <Form>
                <FormItem
                  className="whole"
                  label="审批结果："
                >
                  <RadioGroup onChange={this.onVerifyChange} value={this.state.verify}>
                    <Radio key="all" value={1}>审核通过</Radio>
                    <Radio key="part" value={0}>审核拒绝</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem
                  className="whole"
                  label="备注："
                >
                  <Input className="textarea" type="textarea" onChange={this.onRemarkChange} value={this.state.remark} />
                </FormItem>
              </Form>
            </div>
          </div>}
        </Modal>
        <Modal title="提示" width="388px" visible={this.state.showConfirmModel}
          onOk={this.handleConfirmOk}
          onCancel={this.handleConfirmCancel}
        >
          <p>请确认是否修改</p>
        </Modal>
      </div>
    )
  }
}
Status = createForm()(Status)
export default Status