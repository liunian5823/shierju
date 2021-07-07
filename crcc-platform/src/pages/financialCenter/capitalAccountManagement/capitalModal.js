import {Form,Row,Table, Col,Input,Button,Modal,message} from 'antd';
import Util from "@/utils/util";
import less from "./index.less";
import api from '@/framework/axios';
import BaseDetails from '@/components/baseDetails';
const confirm = Modal.confirm;
const FormItem = Form.Item;
class CapitalModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName:'',
            data:{
                list:[]
             },
            loading:false,
            openLoading:false,
            isShow:false,
            companyInfo:{}
        }
    }
    // 检索公司
    searchCompany = (page,companyName)=> {
        let _page = page? page:1;
        let _companyName = companyName?companyName:this.props.form.getFieldValue("licenseAndName");
        if(!_companyName || _companyName == "" || _companyName == null){
            message.error("请输入查询条件")
            return;
        }
        this.props.form.validateFieldsAndScroll((errors) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            this.setState({loading: true})
            api.ajax('GET', '!!/financial/ecFinanceInfo/getCompanyInfo', {
                companyName:_companyName,
                pageSize:4,
                page:_page,
            }).then((r) => {
                if (r.data) {
                    this.setState({
                        data: r.data,
                        loading: false,
                        companyName:_companyName,
                        selectedRowKeys:[]
                    })
                } else {
                    Util.alert('请确认您填入的信息', {type: 'warning'});
                }

            }).catch(r => {
                Util.alert(r.msg, {type: 'error'});
            })
        });
    };
    // 开通账户
    openAccount = ()=>{
        this.setState({ openLoading: true });
        api.ajax('GET','!!/financial/ecFinanceInfo/openAccount',{
            companyId: this.state.companyInfo.id,
        }).then((r)=>{
            if (r.data) {
                Util.alert('成功开通资金账户',{type:'success'});
                this.closeCapitalModal(true);
            }
            if(!r.data){
                Util.alert("资金账户已存在",{type:'warning'});
                this.closeCapitalModal();
            }
        }).catch(r=>{
            Util.alert(r.msg,{type:'warning'});
            this.closeCapitalModal();
        })

    };
    // 关闭对话框
    closeCapitalModal = (isSuccess)=>{
        this.setState({
            companyName :'',
            selectedRowKeys:[],
            data:{list:[]},
            loading:false,
            openLoading:false,
            isShow:false,
            companyInfo:{}
        });
        this.props.form.resetFields();
        this.props.onCancel(isSuccess);
    };
    // 公司详细
    displayDetails = (isShow,companyInfo) =>{
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        let companyType = '企业名称';
        let companyName = companyInfo.name?companyInfo.name:'-';
        let businessLicense = companyInfo.businessLicense?companyInfo.businessLicense:'-';
        let legalPersonName = '法人代表姓名';
        let legalPerson = companyInfo.legalPersonName?companyInfo.legalPersonName:'-';
        if(companyInfo.type==0){
            legalPersonName = '';
            legalPerson='';
        }
        if(isShow){
            return[
                <div className={less.line}></div>,
                <div className={less.optionDetails}>当前已选</div>,
                <div className={less.mLeft}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <BaseDetails title={companyType}>
                                <p className={[less.nowrapEllipsis]} style={{width:"260px"}}>
                                    <span title={companyName}>
                                        {companyName}
                                    </span>
                                </p>
                            </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                                <BaseDetails title={'营业执照号'}>
                                    <p className={[less.nowrapEllipsis]} style={{width:"260px"}}>
                                        <span title={businessLicense}>
                                            {businessLicense}
                                        </span>
                                    </p>
                                </BaseDetails>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <BaseDetails title={legalPersonName}>
                                <p className={[less.nowrapEllipsis]} style={{width:"260px"}}>
                                    <span title={legalPerson}>
                                        {legalPerson}
                                    </span>
                                </p>
                            </BaseDetails>
                        </Col>
                    </Row>
                </div>
            ];
        }
    };
    onSelectChange=(selectedRowKeys, record)=>{
        this.setState({
            selectedRowKeys:selectedRowKeys,
            companyInfo:record[0],
            isShow:true,
        })
    };
    handleOk =()=>{
        let _this = this;
        let companyId = this.state.companyInfo.id;
        if(!companyId){
            Util.alert('请选择要开通资金账户的公司')
            return
        }
        api.ajax('GET','!!/financial/ecFinanceInfo/checkCapitalAccount',{
            companyId: this.state.companyInfo.id,
        }).then((resp)=>{
            if(resp.data){
                Util.alert("该账号已开通资金账户",{type:'warning'});
            }
            if(!resp.data) {
                confirm({
                    title: '是否确认为该公司开通资金账户？',
                    onOk(){
                        _this.openAccount();
                    },
                    onCancel(){
                        Util.alert('已取消操作',{ type: 'warning' })
                    }
                })
            }

        })

    };

    // 配置分页
    getPagination_ = function (pagination) {
        let  _this = this;
        return {
            defaultPageSize: 4,
            showSizeChanger: false,
            showQuickJumper:true,
            showTotal:total => `共 ${total} 条`,
            total: pagination && pagination.total != undefined ? pagination.total : 0,
            defaultCurrent: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
            pageSize:  4,
            current: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
            onChange:(current) =>{
                _this.searchCompany(current,_this.state.companyName);
            }
        };
    };
    columns = [{
        title: '企业属性',
        dataIndex: 'type',
        key:'companyType',
        render: (text) => {
            let companyType = '供应商'
            if(text==0) {
                companyType = '采购商'
            }
            if(!text) {
                '-'
            }
            return(<p className={[less.nowrapEllipsis]} style={{width:"70px"}}><span title={companyType}>{companyType}</span></p>)
        }
    },{
        title: '企业名称',
        dataIndex: 'name',
        key:'companyName',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"360px"}}><span title={text?text:'-'}>{text?text:'-'}</span></p>)
        }
    },{
        title: '营业执照号',
        dataIndex: 'businessLicense',
        key:'businessLicense',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"330px"}}><span title={text?text:'-'}>{text?text:'-'}</span></p>)
        }
    }
    ];

    render() {
        const rowSelection = {
            type:'radio',
            selectedRowKeys:this.state.selectedRowKeys ,
            onChange: this.onSelectChange,
        }
        const pagination = {...this.getPagination_(this.state.data)};
        const {getFieldProps} = this.props.form;
        return (
            <div>
                <Modal
                    title="开通资金账户"
                    wrapClassName="openAccount"
                    visible={this.props.visible}
                    width={760}
                    onOk={this.handleOk}
                    onCancel={this.closeCapitalModal}
                    footer={[
                        <Button key="back" type="ghost" onClick={this.closeCapitalModal}>取消</Button>,
                        <Button key="submit" type="primary" loading={this.state.openLoading}onClick={this.handleOk}>开通</Button>
                    ]}
                >
                    <Form>
                        <Row type="flex" justify="center" gutter={12}>
                            <Col span={9} >
                                <Form.Item >
                                    <Input placeholder="企业名称/营业执照号"  {...getFieldProps('licenseAndName')}/>
                                </Form.Item>
                            </Col>
                            <Col span={2} >
                                <Button type="primary" onClick={this.searchCompany.bind(this,1,'')}>查询</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        bordered={false}
                        rowKey="companyId"
                        rowSelection={rowSelection}
                        columns={this.columns}
                        loading={this.state.loading}
                        dataSource={this.state.data.list }
                        pagination={pagination}
                    />
                    <Form>
                        {this.displayDetails(this.state.isShow,this.state.companyInfo)}
                    </Form>
                </Modal>
            </div>
        )
    }
}
    export default Form.create()(CapitalModal)



