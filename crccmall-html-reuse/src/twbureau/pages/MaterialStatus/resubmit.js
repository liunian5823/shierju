import React from 'react';
import { Modal, Button, Form, Radio, Select, Input, DatePicker } from 'antd';
import './index.css';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
class Resubmit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible,
            remark: '',
            showConfirmModel: false,
            period1:"",
            period2:"",
            status:"",
        }
    }

    static defaultProps = {
        visible: false, // 默认值不展示
        // 物资状态数据 从父组件传入
        status: {
            name: '资产名称', // 资产名称
            type: "周转材料", // 资产类别
            standards: 'KKK', // 规格型号
            department: 'xx部门', // 资产管理部门
            befoeupdateStatus: '0', // 更新前资产状态
            afterupdateStatus: '1', // 更新后资产状态
            number1: '999', //数量 没找到对应字段名称，可改成跟接口字段名称一致
            unit1: '',//单位 没找到对应字段名称，可改成跟接口字段名称一致
            updateType: 'all', //更新类型 没找到对应字段名称，可改成跟接口字段名称一致
            restStatus: '', //剩余物资状态 没找到对应字段名称，可改成跟接口字段名称一致
            number2: '999', //数量 没找到对应字段名称，可改成跟接口字段名称一致
            unit2: '',//单位 没找到对应字段名称，可改成跟接口字段名称一致
        },
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
            status: nextProps.status.afterupdateStatus,
        })
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
    onUpdateTypeChange = (e) => {
        this.setState({
            updateType: e.target.value
        })
    }
    onRemarkChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    periodChange(date, dateString) {
      console.log(dateString);
      this.setState({
        period1: dateString[0],
        period2: dateString[1]
      }, () => {
        console.log(this.state.period1, this.state.period2);
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
    handleCancel = () => {
        this.setState({
            visible: false
        },()=>{
            this.props.resubmitModule(this.state.visible)
        })        
    }
    handleConfirmOk = () => {

    }
    handleConfirmCancel = () => {
        this.setState({
            showConfirmModel: false
        })
    }
    
    selectChange(type, value) {
        console.log(type,value);
       if (type == '更新后') {
            // 更新后资产状态
            this.setState({
                status: value
            },()=>{
                this.props.status.afterupdateStatus=value
                console.log(this.props.status,this.state.status);
            })
           
        }
    }
    render() {
        let { visible } = { ...this.state }
        let { status } = { ...this.props }
        const { getFieldProps } = this.props.form;
        const afterupdateStatusProps = getFieldProps('afterupdateStatus', {
            rules: [
                { required: true, message: '请选择更新后物资状态' },
            ],
        });
        const number1Props = getFieldProps('number1')
        const unit1Props = getFieldProps('unit1')
        // const remarkProps = getFieldProps('remark', {
        //     rules: [
        //         { required: true, message: '请填写备注' },
        //     ],
        // });
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
                    className="resubmit"
                    width="710px"
                    title="修改物资状态"
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" onClick={this.handleCancel}>返 回</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                            提 交
                        </Button>
                    ]}
                >
                    <div>
                        <Form className="content">
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
                                <RadioGroup onChange={this.onUpdateTypeChange} defaultValue={status.updateType}>
                                    <Radio key="all" value={"all"}>全部更新</Radio>
                                    <Radio key="part" value={"part"}>部分更新</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem
                                label="更新后物资状态："
                            >
                                <Select {...afterupdateStatusProps} className="s_size" showSearch placeholder="请选择" defaultValue={status.afterupdateStatus} value={this.state.status} onChange={this.selectChange.bind(this, '更新后')}>
                                    <Select.Option value="1">在用</Select.Option>
                                    <Select.Option value="2">闲置</Select.Option>
                                    <Select.Option value="3">可周转</Select.Option>
                                    <Select.Option value="6">可处置</Select.Option>
                                    <Select.Option value="9">可租赁</Select.Option>
                                    <Select.Option value="5">已周转</Select.Option>
                                    <Select.Option value="8">已处置</Select.Option>
                                    <Select.Option value="10">已租赁</Select.Option>
                                    <Select.Option value="11">报废</Select.Option>
                                    <Select.Option value="12">报损</Select.Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="更新数量："
                                className='update'
                            >
                                <Input {...number1Props} defaultValue={status.number1} className="s_size" placeholder="请输入" />
                                <Select {...unit1Props} defaultValue={status.unit1} className="xs_size" showSearch placeholder="请选择">
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
                        </Form>
                        {this.state.status == "10" && <div>                            
                            <div className='resubmit-title'>租赁信息</div>
                            <Form className="content">
                                <FormItem
                                    className="whole"
                                    label="承租方："
                                >
                                   <Input className='leaseControl' placeholder="请输入" />
                                </FormItem>
                                <FormItem
                                    className="whole"
                                    label="租赁周期："
                                >
                                   <RangePicker className='leaseControl' onChange={this.periodChange.bind(this)} />&nbsp;&nbsp;天
                                </FormItem>
                                <FormItem
                                    className="whole"
                                    label="租金收入："
                                >
                                   <Input className='leaseControl' placeholder="请输入" />&nbsp;&nbsp;元
                                </FormItem>
                                <FormItem
                                    className="whole"
                                    label="备注："
                                >
                                    <Input className="leaseControl" type="textarea" onChange={this.onRemarkChange} value={this.state.remark} rows={4}/>
                                </FormItem>
                            </Form>
                        </div>}
                    </div>
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
Resubmit = createForm()(Resubmit)
export default Resubmit