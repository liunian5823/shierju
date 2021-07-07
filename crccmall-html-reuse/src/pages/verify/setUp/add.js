import React from 'react';
import { Form, Card, Row, Col, Switch, Button, Input, Select, Slider, Radio, Modal, Tree, Table, Tooltip, Icon, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

import { closeWin, isNormal } from '@/utils/dom';
import Util from '@/utils/util';
import api from '@/framework/axios';
import BaseTree from '@/components/baseTree';
import less from './add.less';
import { baseService } from '@/utils/common';

//审批方式
const _ApprovalGroup = baseService.approvalGroup;

class VerifySetUpAdd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            departmentGroup: [
                { id: '1', value: '部门1' },
                { id: '2', value: '部门2' },
                { id: '3', value: '部门3' },
            ],

            formData: {
                name: '',//模板名称
                depts: [],//应用部门
                lowQuota: null,//审批条件
                highQuota: 200,//审批条件
                remarks: '',//备注
                type: '1',//[1竞价, 2订单]
                mode: null,//审批方式
                users: [],//优先级
                msgType: 1,//短信通知
                isDefault: '0',//是否默认[0否, 1是]
            },

            quota: [0, 200],
            priorityList: [{ orderBy: 1, groupName: '', deptId: null, userId: null, spr: '', sprList: [] }],//优先级
            sprVisible: false,//编辑审批人
            sprKey: null,//当前选择的优先级
            sprList: [],//当前选中的人
            treeData: [],//树结构
        }
    }

    _uuids = null
    //扁平化审批人
    approvalerFlat = []

    //短信通知
    noteGroup = [
        { id: 1, value: '全部通过或驳回后通知' },
        { id: 2, value: '即时通知', disabled: true },
    ]

    sprColumns = [
        {
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            width: 100,
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: 100,
            render: (text, record, index) => (
                <span className={less.tabBtn}>
                    <Col span={8}>
                        {
                            index != 0
                                ? <Icon className={less.up} onClick={() => { this.sprUp(record, index) }} type="circle-o-up" />
                                : null
                        }
                    </Col>
                    <Col span={8}>
                        {
                            index < this.state.sprList.length - 1
                                ? <Icon className={less.down} onClick={() => { this.sprDown(record, index) }} type="circle-o-down" />
                                : null
                        }
                    </Col>
                    <Col span={8}>
                        <span className="reuse_link" onClick={() => { this.sprDel(record, index) }}>删除</span>
                    </Col>
                </span>
            )
        }
    ]

    config = {
        col: {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 21
            },
        },
        slider: {
            min: 0,
            max: 200,
            marks: {
                10: '10',
                100: '100'
            }
        }
    }
    getOptions = (arr, value = 'id', label = 'value') => {
        let list = arr.map((item, index) => {
            return (
                <Option value={item[value]} key={item[value]}>{item[label]}</Option>
            )
        })
        return list
    }
    getRadio = (arr) => {
        let list = arr.map((item, index) => {
            return (
                <Radio value={item.id} key={item.id} disabled={item.disabled}>{item.value}</Radio>
            )
        })
        return list
    }
    //统一处理onchange
    valueChange = (el, label) => {

        const formData = this.state.formData;
        const priorityList = this.state.priorityList;
        let value = el;
        if (el.target) {
            value = el.target.value
        }
        formData[label] = value;
        if (label == 'depts') {
            let depts = el
            api.ajax('GET', '@/reuse/organization/getOrganizationList', {
                deptStr: depts.join(','),
                hasUserIdStr: ''
            }).then(res => {
                if (res.data) {
                    let flat = this._getFlat(res.data || [])
                    this.approvalerFlat = flat.flat;
                    priorityList.forEach(ele => {
                        ele.sprList = ele.sprList.filter(elem => {
                            return flat.flat.find(element => element.id == elem.id)
                        })
                        ele.spr = ele.sprList.map(val => val.username || val.userName).join(',')
                    })
                    this.setState({
                        treeData: flat.newArr,
                        priorityList
                    })
                }
            }, error => {
                Util.alert(error.msg, { type: 'error' })
            })
        }

        this.setState({
            formData
        })
    }
    listValueChange = (el, label) => {
        let { priorityList } = this.state;

        let value = el;
        if (el.target) {
            value = el.target.value
        }
        let labelArr = label.split('.');
        priorityList.forEach(v => {
            if (v.orderBy == labelArr[1]) {
                v[labelArr[2]] = value;
            }
        })
        this.setState({
            priorityList
        })
    }

    componentWillMount() {
        this.handleInit()
    }

    //初始
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getTplInfo(this._uuids)
        }
        this.getDepartment()
    }
    //编辑时处理优先级数据
    filterEditUsersGroup = (arr) => {
        let list = [];
        (arr || []).map((v, index) => {
            list[index] = { orderBy: 1, groupName: '', deptId: null, userId: null, spr: '', sprList: [] };
            v.map((val, sindex) => {
                if (sindex == 0) {
                    list[index].groupName = val.groupName;
                    list[index].orderBy = val.orderBy;
                }
                list[index].spr = list[index].spr + (val.userName ? val.userName : '');
                list[index].sprList.push({
                    ...val,
                    _parentId: v.deptId
                })
            })
        })
        return list;
    }
    //获取编辑信息
    getTplInfo = (uuids) => {
        api.ajax('GET', '@/reuse/approval/manage/get', {
            uuids
        }).then(res => {
            if (res.data) {
                let priorityList = this.filterEditUsersGroup(res.data.userGroup);
                res.data.depts = res.data.depts.map(value => {
                    return value.deptId + ""
                });
                this.setState({
                    formData: {
                        ...res.data
                    },
                    priorityList
                }, () => {
                    let depts = this.state.formData.depts
                    api.ajax('GET', '@/reuse/organization/getOrganizationList', {
                        deptStr: depts.join(','),
                        hasUserIdStr: ''
                    }).then(res => {
                        if (res.data) {
                            let flat = this._getFlat(res.data || [])
                            this.approvalerFlat = flat.flat;
                        }
                    }, error => {
                        Util.alert(error.msg, { type: 'error' })
                    })
                })
            }
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
    }
    //获取部门
    getDepartment = () => {
        api.ajax('GET', '@/reuse/organization/queryOrganizationList')
            .then(res => {
                this.setState({
                    departmentGroup: (res.data || []).map(v => {
                        if (isNormal(v.id)) {
                            v.id = v.id + ''
                        }
                        return v;
                    })
                })
            })
    }


    //审批模板信息
    createTplInfo = () => {
        const { col, slider } = this.config;
        const { getFieldProps } = this.props.form;
        const { formData, quota } = this.state;
        // const numTotal = (<span>{(!!this.state.formData.name && this.state.formData.name.length) ? this.state.formData.name.length : 0}/30</span>);

        return (
            <div>
                <Row>
                    <FormItem
                        {...col}
                        label="模板名称">
                        <Input
                            {...getFieldProps('name', {
                                initialValue: formData.name,
                                rules: [
                                    { required: true, message: '请输入模板名称' }
                                ]
                            })}
                            // addonAfter={numTotal}
                            maxLength={30}
                            placeholder="请输入"></Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...col}
                        label="应用部门">
                        <Select
                            multiple
                            {...getFieldProps('depts', {
                                initialValue: formData.depts,
                                rules: [
                                    { required: true, message: '请选择应用部门' },
                                ],
                                onChange: (el) => { this.valueChange(el, 'depts') }
                            })}
                            placeholder="请选择">
                            {this.getOptions(this.state.departmentGroup, 'id', 'organizationName')}
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...col}
                        wrapperCol={{ span: 18 }}
                        label="审批条件">
                        <Slider
                            style={{ width: '80%' }}
                            range
                            {...getFieldProps('quota', {
                                initialValue: quota,
                                rules: [
                                    { required: true, message: '请选择审批条件' }
                                ]
                            })}
                            {...slider} />
                        <span className={less.slider_text}>200万以上</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...col}
                        label="备注信息">
                        <Input
                            type="textarea"
                            {...getFieldProps('remarks', {
                                initialValue: formData.remarks,
                                onChange: (el) => { this.valueChange(el, 'remarks') }
                            })}
                            placeholder="请输入"
                            maxLength={300}
                            autosize={{ minRows: 6 }}></Input>
                        <p className="text_r">{formData.remarks ? formData.remarks.length : 0}/300</p>
                    </FormItem>
                </Row>
            </div>
        )
    }
    //优先级
    createPriority = () => {
        const { priorityList } = this.state;
        const { getFieldProps } = this.props.form;

        return (
            <div>
                {
                    priorityList.map((v, index) => {
                        return (
                            <Row key={v.orderBy}>
                                <Col span={8}>
                                    <FormItem
                                        labelCol={{ span: 9 }}
                                        wrapperCol={{ span: 14 }}
                                        label={'优先级' + (index + 1)}>
                                        <Input
                                            {...getFieldProps(`priorityList.${v.orderBy}.groupName`, {
                                                initialValue: v.groupName,
                                                rules: [
                                                    { required: true, message: '请输入职位名称' }
                                                ],
                                                onChange: (el) => { this.listValueChange(el, `priorityList.${v.orderBy}.groupName`) }
                                            })}
                                            maxLength={30}
                                            placeholder="请输入职位名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span={13}>
                                    <FormItem>
                                        <Input
                                            type="textarea"
                                            {...getFieldProps(`priorityList.${v.orderBy}.spr`, {
                                                initialValue: v.spr,
                                                rules: [
                                                    { required: true, message: '请选择审批人' }
                                                ]
                                            })}
                                            disabled
                                            placeholder="请选择审批人"></Input>
                                    </FormItem>
                                </Col>
                                <Col span={3} className={less.priority_btn}>
                                    <Button type="primary" onClick={() => { this.ApprovalerEdit(v, index) }}>编辑审批人</Button>
                                    {
                                        index > 0 ? <Button onClick={() => { this.priorityDel(v.orderBy) }}>删除审批人</Button> : null
                                    }
                                </Col>
                            </Row>
                        )
                    })
                }
                {priorityList.length <= 4 && <Row>
                    <Col span={18} offset={3}>
                        <Button type="dashed" icon="plus" style={{ width: '100%' }} onClick={this.priorityAdd}>添加</Button>
                    </Col>
                </Row>}
            </div>
        )
    }
    //优先级添加
    priorityAdd = () => {
        let { priorityList } = this.state;
        const key = !!priorityList[priorityList.length - 1] ? +priorityList[priorityList.length - 1].orderBy + 1 + '' : 0;
        priorityList.push({ orderBy: key, groupName: '', deptId: null, userId: null, spr: '', sprList: [] });
        this.setState({
            priorityList
        })
    }
    //审批人过滤及扁平化
    _getFlat = (arr, all) => {
        let newArr = arr || [];
        let flat = all || [];
        newArr.map(v => {
            v._username = v.organizationName;//统一展示value
            if (v.userList) {
                v.userList.map(val => {
                    val._username = val.username;//统一展示value
                    val._parentId = v.id;//记录父级id
                    val._id = v.id + '-' + val.id
                    flat.push(val)
                })
            }
        })
        return {
            flat,
            newArr
        }
    }
    //编辑审批人
    ApprovalerEdit = (tr, index) => {
        let depts = this.state.formData.depts
        let priorityList = this.state.priorityList || []
        if (!depts.length) {
            return Util.alert('请选择应用部门', { type: 'error' })
        }
        let hasUserIdStr = priorityList.map((ele, i) => {
            if (i == index) {
                return []
            } else {
                return ele.sprList.map(elem => elem.userId || elem.id)
            }
            return ele.sprList.map(elem => elem.userId || elem.id)
        }).flat().join(',')
        api.ajax('GET', '@/reuse/organization/getOrganizationList', {
            deptStr: depts.join(','),
            hasUserIdStr
        }).then(res => {
            if (res.data) {
                let flat = this._getFlat(res.data || [])
                this.setState({
                    treeData: flat.newArr,
                })
            }
        }, error => {
            Util.alert(error.msg, { type: 'error' })
        })
        this.setState({
            sprKey: tr.orderBy,
            sprList: tr.sprList,
            sprVisible: true
        })
    }
    //优先级删除
    priorityDel = (key) => {
        let priorityList = this.state.priorityList.filter(v => v.orderBy != key)

        this.setState({
            priorityList
        })
    }

    //审批流程
    createProcess = () => {
        const { col } = this.config;
        const { formData } = this.state;
        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Row>
                    <FormItem
                        {...col}
                        label="审批方式">
                        <RadioGroup
                            {...getFieldProps('mode', {
                                initialValue: formData.mode,
                                rules: [
                                    { required: true, message: '请选择审批方式' }
                                ]
                            })}>
                            <Radio value={1}>
                                依次审批
                            <Tooltip title="逐级审批">
                                    <Icon style={{ marginLeft: '8px' }} type="question-circle-o" />
                                </Tooltip>
                            </Radio>
                            <Radio value={2}>
                                会签
                            <Tooltip title="需所有人审批完成">
                                    <Icon style={{ marginLeft: '8px' }} type="question-circle-o" />
                                </Tooltip>
                            </Radio>
                            <Radio value={3}>
                                或签
                            <Tooltip title="一人审批即可">
                                    <Icon style={{ marginLeft: '8px' }} type="question-circle-o" />
                                </Tooltip>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Row>
                <div>{this.createPriority()}</div>
            </div>
        )
    }

    //审批人选中
    sprSelect = (keys, el) => {
        if (!keys.length || keys[0].startsWith('0-')) { return }
        let ids = keys[0].split('-')
        let pid = ids[0]
        let cid = ids[1]
        let { sprList } = this.state;
        if (sprList.length >= 10) {
            Util.alert('最多选中10个！')
            return;
        }
        // const sprkeys = sprList.map(v => v.id);
        // this.approvalerFlat.forEach(v => {
        //     if (sprkeys.indexOf(v.id) == -1 && v.id == keys[0]) {
        //         sprList.push({ ...v, userName: v.username })
        //     }
        // })
        let obj = sprList.find(ele => {
            return (ele.id == cid || ele.userId == cid)
        })
        let obj1 = this.approvalerFlat.find(ele => {
            return (ele.id == cid || ele.userId == cid)
        })
        if (!obj) {
            sprList.push({ ...obj1, userName: obj1.username })
        }

        if (sprList.length != this.state.sprList) {
            this.setState({
                sprList
            })
        }
    }
    //审批人删除
    sprDel = (tr) => {
        let { sprList } = this.state;
        // sprList = sprList.filter(v => {
        //     return (v.userId != tr.userId || v.id != tr.id) && (v._parentId != tr._parentId || v.deptId != tr.deptId)
        // })
        let index = sprList.findIndex(v => {
            if (v.userId && tr.userId) {
                return v.userId === tr.userId
            } else {
                return v.id === tr.id
            }

        })
        sprList.splice(index, 1)
        this.setState({
            sprList
        })
    }
    //审批人上移动
    sprUp = (tr, index) => {
        if (index <= 0) return;
        let { sprList } = this.state;
        sprList[index - 1] = sprList.splice(index, 1, sprList[index - 1])[0];

        this.setState({
            sprList
        })
    }
    //审批人下移动
    sprDown = (tr, index) => {
        let { sprList } = this.state;
        if (index >= sprList.length - 1) return;
        sprList[index + 1] = sprList.splice(index, 1, sprList[index + 1])[0];

        this.setState({
            sprList
        })
    }
    //审批人确定
    sprOk = () => {
        let { sprKey, sprList, priorityList } = this.state;
        priorityList.forEach(v => {
            if (v.orderBy == sprKey) {
                v.sprList = [...sprList];
                v.spr = sprList.map(val => val.username || val.userName).join(',');
            }
        })

        this.setState({
            priorityList,
            sprVisible: false
        }, () => {
            Util.alert('选择成功', { type: 'success' })
        })
    }

    saveFilterParams = (p) => {
        let params = {}, arr = [];
        params.name = p.name;
        params.depts = JSON.stringify(p.depts.map(value => +value));
        params.lowQuota = p.quota[0];
        params.highQuota = p.quota[1];
        params.remarks = p.remarks;
        params.type = p.type;
        params.msgType = p.msgType;
        params.mode = p.mode;
        params.isDefault = p.isDefault;


        JSON.parse(JSON.stringify(this.state.priorityList)).forEach(v => {
            v.sprList.forEach(val => {
                let obj = v;
                delete obj.spr;//删除spr和sprList
                delete obj.sprList;
                arr.push({
                    ...obj,
                    deptId: val._parentId || val.deptId,
                    userId: val.id ? val.id : val.userId,//编辑和新增是取值不同
                })
            })
        })
        params.users = JSON.stringify(arr);

        return params
    }

    //保存
    save = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let url = this._uuids ? '@/reuse/approval/manage/upd' : '@/reuse/approval/manage/add';
                let params = this.saveFilterParams({
                    ...this.state.formData,
                    ...values
                });
                params.type = 2
                if (this.props.match.params.uuids) {
                    params.uuids = this.props.match.params.uuids;
                }
                api.ajax('POST', url, params).then(res => {
                    Util.alert(res.msg || '保存成功', { type: 'success' })
                    this.back()
                }, error => {
                    Util.alert(error.msg || '保存失败', { type: 'error' })
                })
            }
        })
    }

    back = () => {
        this.props.history.push('/verify/setUp')
    }

    render() {
        const { formData } = this.state;
        const { col } = this.config;
        const { getFieldProps } = this.props.form;

        return (
            <div className={less.verifyadd}>
                <Form>
                    <Card>
                        <div className="reuse_baseTitle">审批模板信息</div>
                        <div>{this.createTplInfo()}</div>
                    </Card>
                    <Card className="mt10">
                        <div className="reuse_baseTitle">审批流程</div>
                        <div>{this.createProcess()}</div>
                    </Card>
                    <Card className="mt10">
                        <div className="reuse_baseTitle">更多设置</div>
                        <div>
                            <Row>
                                <FormItem
                                    {...col}
                                    label="短信通知">
                                    <RadioGroup
                                        {...getFieldProps(`msgType`, {
                                            initialValue: formData.msgType,
                                            rules: [
                                                { required: true, message: '请选择短信通知' }
                                            ]
                                        })}>
                                        {this.getRadio(this.noteGroup)}
                                    </RadioGroup>
                                </FormItem>
                            </Row>
                        </div>
                    </Card>
                    <Card className="mt10">
                        <div className="reuse_baseButtonGroup reuse_baseButtonCenter">
                            <Button onClick={this.back}>返回</Button>
                            <Popconfirm title="确定要保存吗?" onConfirm={this.save}><Button type="primary">保存</Button></Popconfirm>

                        </div>
                    </Card>
                </Form>

                <Modal
                    title="编辑审批人"
                    width={900}
                    visible={this.state.sprVisible}
                    onCancel={() => { this.setState({ sprVisible: false }) }}
                    onOk={this.sprOk}>
                    <div>
                        <Row gutter={20}>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <span>当前已选</span>
                                <span className="ml20">{this.state.sprList.length}/10</span>
                            </Col>
                            <Col span={12} className={less.left_tree}>
                                <BaseTree
                                    data={this.state.treeData}
                                    onSelect={this.sprSelect}
                                    labelKey="_id"
                                    valueKey={['_username', 'phone']}
                                    childKey="userList"></BaseTree>
                            </Col>
                            <Col span={12}>
                                <Table
                                    columns={this.sprColumns}
                                    dataSource={this.state.sprList}
                                    pagination={false}></Table>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(VerifySetUpAdd)
