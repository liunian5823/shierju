import {Form,Row,Table, Col,Input,Button,Modal,message} from 'antd';
import Util from "@/utils/util";
import less from "./index.less";
const confirm = Modal.confirm;
class PurchaserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            companyName:'',
        }
    }
    // 关闭对话框
    closePurchaserModal = ()=>{
        this.setState({
            companyName :'',
            selectedRowKeys:[]
        });
        this.props.form.resetFields();
        this.props.closeModal();
    }
    // 检索采购商
    searchOk = ()=>{
        let companyName = this.props.form.getFieldValue("companyName");
        this.setState({
            companyName :companyName,
            selectedRowKeys:[]
        })
        this.props.searchData(1,companyName);
    }
    //  采购商数据表,选择项
    onSelectChange=(selectedRowKeys)=>{
        this.setState({
            selectedRowKeys:selectedRowKeys
        })
    }
    // 添加方法
    handleOk =()=>{
        let _this = this;
        let companyId = this.state.selectedRowKeys[0];
        if(companyId === undefined ){
            Util.alert('请选择要添加的采购商')
            return
        }
        confirm({
            title: '是否确认添加该采购商？',
            onOk(){
                _this.addPurchaser();
            },
        onCancel(){
                Util.alert('已取消操作')
            }
        })
    }
    // 添加采购商清单
    addPurchaser () {
        let _this = this;
        let params ={
            companyId:_this.state.selectedRowKeys[0],
            sort:_this.props.sort + 1,
            type:2
        };
        axios.get('!!/purchaser/attachment/addPurchaser', {
            params:{ ...params }
        }).then((r, err) =>{
            if(r.data){
                _this.props.refreshPurchaseList();
                _this.setState({
                    selectedRowKeys: [],
                }),
                 Util.alert('添加成功',{ type: 'success' })
            }else{
                axios.get('!!/purchaser/attachment/checkAttachment', {
                    params:{...params}
                }).then((r)=>{
                    Util.alert('该采购商已被您添加到清单',{ type: 'warning' })
                })
            }
        })
    }
    // 配置分页
    getPagination_ = function (pagination) {
       let  _this = this;
        return {
            defaultPageSize: 5,
            showSizeChanger: false,
            showQuickJumper:true,
            showTotal:total => `共 ${total} 条`,
            total: pagination && pagination.total != undefined ? pagination.total : 0,
            defaultCurrent: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
            pageSize:  5,
            current: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
            onChange:(current) =>{
                _this.props.searchData(current,_this.state.companyName);
            }
        };
    };
    // 采购商展示表列配置
    columns = [{
        title: '采购单位',
        dataIndex: 'companyName',
        key:'companyName',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"372px"}}><span title={text}>{text}</span></p>)
        }
        },{
            title: '级别',
            dataIndex: 'unitLevel',
            key:'unitLevel',
            render: (text, record, index) => {
                return(<p className={[less.nowrapEllipsis]} style={{width:"101px"}}><span title={text}>{text}</span></p>)
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key:'createTime',
            render: (text, record, index) => {
                return(<p className={[less.nowrapEllipsis]} style={{width:"200px"}}><span title={text}>{text}</span></p>)
            }
        },{
            title: '询价单数',
            dataIndex: 'inquiryNum',
            key:'inquiryNum',
            render: (text, record, index) => {
                return(<p className={[less.nowrapEllipsis]} style={{width:"200px"}}><span title={text}>{text}</span></p>)
            }
        }
    ];

    render() {
        const rowSelection = {
            type:'radio',
            selectedRowKeys:this.state.selectedRowKeys ,
            onChange: this.onSelectChange,
        }
        const pagination = {...this.getPagination_(this.props.purchaserData)};
        const {getFieldProps} = this.props.form;
        return (
            <div>
                <Modal
                    title="新增"
                    wrapClassName="add_purchaser_modal"
                    visible={this.props.purchaserModalVisible}
                    width={900}
                    onOk={this.handleOk}
                    onCancel={this.closePurchaserModal}
                    footer={[
                        <Button key="back" type="ghost" onClick={this.closePurchaserModal}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>添加</Button>
                    ]}
                >
                    <Form>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col span={9} >
                                <Form.Item >
                                    <Input placeholder="请输入采购单位名称"  {...getFieldProps('companyName')}/>
                                </Form.Item>
                            </Col>
                            <Col span={3} >
                                <Button type="primary" onClick={this.searchOk}>查询</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        bordered={false}
                        rowKey="companyId"
                        rowSelection={rowSelection}
                        columns={this.columns}
                        loading={this.props.purchaserLoading}
                        dataSource={this.props.purchaserData.list }
                        pagination={pagination}
                    />
                </Modal>
            </div>
        )
    }
}
    export default Form.create()(PurchaserModal)



