import { Card, Button, Switch,Modal,Tabs,Row,Col,Radio,Form,Input  } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


class FristHandApprovalList extends React.Component {
    state = {
        tableState0: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState1: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState2: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState3: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        detailVisible: false,
        record:{},
        detailShow:false,
        approvalDetail:{},

    }

    _isMounted = false;
    activeTab = "0"


    componentWillMount() {
        this._isMounted = true;
        this.handelToLoadTable(1, 'tableState1');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['isMember', 'companyName']

    formList = () => {
        return [
            {
                type: 'SELECT',
                field: 'isMember',
                label: '企业类型',
                placeholder: '请输入业务类型',
                list: [
                    {
                        id: '1',
                        value: '内部单位'
                    },
                    {
                        id: '2',
                        value: '外部单位'
                    }
                ]
            },
            {
                type: 'INPUT',
                field: 'companyName',
                label: '公司名称',
                placeholder: '公司名称'
            },
            {
                type: 'RANGETIME',
                field: 'applicationTime',
                label: '申请时间',
                placeHolder: '请筛选时间段'
            }
        ]
    }


    handleFilter = (p, isSend = true) => {
        let key = this.activeTab;
        let applicationTimeStart, applicationTimeEnd;
        if (p.applicationTime) {
            applicationTimeStart = p.applicationTime[0] ? moment(p.applicationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            applicationTimeEnd = p.applicationTime[1] ? moment(p.applicationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.applicationTime = null;
        }

        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            applicationTimeStart,
            applicationTimeEnd
        }
        if (isSend) {
            this.reloadTableData();
        }
    }

    baseParams0 = {
        approvalStatus:0
    }
    baseParams1 = {
        approvalStatus:1
    }
    baseParams2 = {
        approvalStatus:2
    }
    baseParams3 = {
        approvalStatus:3
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        let key = this.activeTab;
        this.resetTable(state, 'tableState'+key);
    }
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        console.log("handelToLoadTable",tableState);
        this.setState({
            [tableState]: state
        })
    }


    columns = () => {
        return [
            {
                title: '企业类型',
                dataIndex: 'isMember',
                key: 'isMember',
                width: 150,
                sorter: true,
                render: (text, record) => (
                    <span>
                        {record.isMember=='1' ? '内部企业': '外部企业'}
                  </span>
                )
            },
            {
                title: '公司名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
                sorter: true
            },
            {
                title: '社会统一信用代码',
                dataIndex: 'businessLicense',
                key: 'businessLicense',
                width: 150,
                sorter: true
            },
            {
                title: '申请人',
                dataIndex: 'username',
                key: 'username',
                width: 150,
                sorter: true
            },
            {
                title: '申请人手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                sorter: true
            },
            {
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
                sorter:true,
                render: (text, record) => (
                    <span>
                        {record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') :'' }
                   </span>
                )
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width: 150,
                fixed: 'right',
                render: (text, record) => (
                    <span>
                        {record.approvalStatus=='1' || record.approvalStatus==1 ?   <AuthButton elmType="a" onClick={() => {this.showModal(record)}}>审核</AuthButton> : ''}
                        {record.approvalStatus!='1' && record.approvalStatus!=1 ?   <AuthButton elmType="a" onClick={() => {this.showDetailModel(record)}}>查看</AuthButton> : ''}
                    </span>
                )
            }
        ]
    }

    //切换tab页时
    handleTabChange = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }


    //关闭弹窗
    hideModal=()=> {
        this.setState({
            detailVisible: false
        })
    };
    //打开弹窗
    showModal=(record)=> {
        this.props.form.resetFields();
        this.setState({
            detailVisible: true,
            record:record,
        })
    };
    //递交审核
    handleSubmit=()=> {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            api.ajax('GET', '@/platform/workOrders/approvalFristHand', {
                uuids: this.state.record.uuids,
                approvalFalg : values.approvalFalg,
                remark :values.remark
            }).then(res => {
                this.props.form.resetFields();
                this.setState({
                    detailVisible: false
                })
            }).catch(res => {
                this.props.form.resetFields();
                this.setState({
                    detailVisible: false
                })
            })
            })

    };

    //打开查看弹窗
    showDetailModel=(record)=>{
        api.ajax('GET', '@/platform/workOrders/approvalFristShow', {
            uuids: record.uuids,
        }).then(res => {
            this.setState({
                detailShow: true,
                approvalDetail:res.data
            })
        }).catch(res => {
        })

    }

    //关闭查看弹窗
    hideDetailModal=()=>{
        this.setState({
            detailShow: false
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        };
        const {getFieldProps} = this.props.form;
        const {approvalDetail} = this.state
        return (
            <div>
                <Card bordered={false}>
                    <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                </Card>
                <Card>
                    <Tabs onTabClick={this.handleTabChange}>
                        <TabPane tab="待审核" key="1" >
                            <BaseTable
                                notInit={true}
                                url='@/sub/subPlatformApplication/fristHandApprovalList'
                                tableState={this.state.tableState1}
                                resetTable={(state) => { this.resetTable(state, 'tableState1') }}
                                baseParams={this.baseParams1}
                                columns={this.columns()}
                                scroll={{ x: 900 }} />
                        </TabPane>
                        <TabPane tab="已通过" key="2" >
                            <BaseTable
                                notInit={true}
                                url='@/sub/subPlatformApplication/fristHandApprovalList'
                                tableState={this.state.tableState2}
                                resetTable={(state) => { this.resetTable(state, 'tableState2') }}
                                baseParams={this.baseParams2}
                                columns={this.columns()}
                                scroll={{ x: 900 }} />
                        </TabPane>
                        <TabPane tab="已驳回" key="3" >
                            <BaseTable
                                notInit={true}
                                url='@/sub/subPlatformApplication/fristHandApprovalList'
                                tableState={this.state.tableState3}
                                resetTable={(state) => { this.resetTable(state, 'tableState3') }}
                                baseParams={this.baseParams3}
                                columns={this.columns()}
                                scroll={{ x: 900 }} />
                        </TabPane>
                        <TabPane tab="全部" key="0" >
                            <BaseTable
                                notInit={true}
                                url='@/sub/subPlatformApplication/fristHandApprovalList'
                                tableState={this.state.tableState0}
                                resetTable={(state) => { this.resetTable(state, 'tableState0') }}
                                baseParams={this.baseParams0}
                                columns={this.columns()}
                                scroll={{ x: 900 }} />
                        </TabPane>
                    </Tabs>
                </Card>

                <Modal
                    title="审核"
                    maskClosable={false}
                    width={488}
                    visible={this.state.detailVisible}
                    onCancel={() => { this.setState({ detailVisible: false }) }}
                    footer={[
                        <Button  onClick={this.hideModal} >
                            取消
                        </Button>,
                        <Button type="primary" onClick={this.handleSubmit} key={'submit'}>
                            递交
                        </Button>
                    ]}
                >
                    <Form>
                        <Row span={24}>
                            <Col>
                                <FormItem
                                    {...formItemLayout}
                                    label='审核结果'
                                >
                                    <RadioGroup
                                        {...getFieldProps('approvalFalg', {
                                            initialValue: 2,
                                            rules: [
                                                {required: true, message: '请选择法人证件类型'}
                                            ],
                                            onChange: () => {
                                                this.props.form.resetFields(['approvalFalg']);
                                            }
                                        })}
                                    >
                                        <Radio key='a' value={2}>通过</Radio>
                                        <Radio key='b' value={3}>不通过</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row span={24}>
                            <Col>
                                <FormItem
                                    {...formItemLayout}
                                    label='审核意见'
                                >
                                    <Input type="textarea" placeholder='请输入审核意见'
                                           {...getFieldProps('remark', {
                                               rules: [
                                                   {required: true,  message: '请输入审核意见'},
                                               ]
                                           })}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    title="查看审核"
                    maskClosable={false}
                    width={488}
                    visible={this.state.detailShow}
                    onCancel={() => { this.setState({ detailShow: false }) }}
                    footer={[
                        <Button  onClick={this.hideDetailModal} >
                            关闭
                        </Button>
                    ]}
                >
                    <Row span={24} style={{marginBottom:20}}>
                        <Col span={24}>
                            审核结果： {approvalDetail.approval_status ==1 ? '审核通过' : approvalDetail.approval_status ==2 ? '审核驳回' :'' }
                        </Col>
                        <Col span={18}>

                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col  span={24}>
                            审核意见：{approvalDetail.approval_reason}
                        </Col>
                    </Row>

                </Modal>
            </div>
        )
    }


}
export default Form.create()(FristHandApprovalList) ;