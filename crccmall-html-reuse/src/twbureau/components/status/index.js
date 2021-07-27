import React from 'react';
import { Modal, Button, Form, Radio, Select, Input } from 'antd';
import './index.css';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Status extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      updateType: "all",
      verify: 1,
      remark: '',
      showConfirmModel: false,
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
      console.log(values);
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
  render() {
    let { visible } = { ...this.state }
    let { status, process, step } = { ...this.props }
    const { getFieldProps } = this.props.form;
    const afterupdateStatusProps = getFieldProps('afterupdateStatus', {
      rules: [
        { required: true, message: '请选择更新后物资状态' },
      ],
    });
    const number1Props = getFieldProps('number1')
    const unit1Props = getFieldProps('unit1')
    const restProps = getFieldProps('restStatus', {
      rules: this.state.updateType == 'part' ? [
        { required: true, message: '请选择剩余物资状态' },
      ] : [
        { required: false }
      ],
    });
    const number2Props = getFieldProps('number2')
    const unit2Props = getFieldProps('unit2')
    const remarkProps = getFieldProps('remark', {
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

    return (
      <div>
        <Modal
          className="status"
          width="710px"
          title="查看物资状态"
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
                数量：<span className='detail' onClick={() => this.details(status)}>{status.number1} {status.unit1}</span>
              </FormItem>
              <FormItem
                className="whole"
                label="更新类型："
              >
                <RadioGroup disabled={step !== 'update'} onChange={this.onUpdateTypeChange} defaultValue={status.updateType}>
                  <Radio key="all" value={"all"}>全部更新</Radio>
                  <Radio key="part" value={"part"}>部分更新</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                label="更新后物资状态："
              >
                <Select disabled={step !== 'update'} {...afterupdateStatusProps} className="s_size" showSearch placeholder="请选择" defaultValue={status.afterupdateStatus}>
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
                <Input disabled={step !== 'update'} {...number1Props} defaultValue={status.number1} className="s_size" placeholder="请输入" />&nbsp;&nbsp;&nbsp;&nbsp;
                <Select disabled={step !== 'update'} {...unit1Props} defaultValue={status.unit1} className="xs_size" showSearch placeholder="请选择">
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
              {this.state.updateType == "part" && <FormItem
                label="剩余物资状态："
              >
                <Select disabled={step !== 'update'} {...restProps} defaultValue={status.restStatus} className="s_size" showSearch placeholder="请选择">
                  <Option value="0">在用</Option>
                  <Option value="1">闲置</Option>
                </Select>
              </FormItem>}
              {this.state.updateType == "part" && <FormItem
                label="更新数量："
              >
                <Input disabled={step !== 'update'} {...number2Props} defaultValue={status.restStatus} className="s_size" placeholder="请输入" />&nbsp;&nbsp;&nbsp;&nbsp;
                <Select disabled={step !== 'update'} {...unit2Props} defaultValue={status.unit2} className="xs_size" showSearch placeholder="请选择">
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
                <Input disabled={step !== 'update'} {...remarkProps} defaultValue={status.remark} value={status.remark} className="textarea" type="textarea" />
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