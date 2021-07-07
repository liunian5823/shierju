import {Timeline,Select,Card, Form,Row, Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,DatePicker,Tabs,Radio,Tooltip,BackTop,Popconfirm,message} from 'antd';
import api from '@/framework/axios';
import "./index.css";

class InquiryApprovalLogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inquiryApprovalLogList:[],
        }
    }

    componentWillMount(){
        let inquiryUuids = this.props.inquiryUuids;
        if(inquiryUuids){
            this.getInquiryApprovalLogList(inquiryUuids);
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.inquiryUuids&&this.props.inquiryUuids!=nextProps.inquiryUuids){
            this.getInquiryApprovalLogList(nextProps.inquiryUuids);
        }
    }

    getInquiryApprovalLogList = (inquiryUuids)=>{
        if(inquiryUuids){
            api.ajax("GET","!!/inquiry/inquiryDetailController/getInquiryApprovalLogList",{
                inquiryUuids:inquiryUuids
            }).then((r)=>{
                this.setState({
                    inquiryApprovalLogList:r.data
                })
            })
        }

    }

    columns = ()=>{
        let result =
            [{
                title: '审批人',
                dataIndex: 'username',
                key: 'username',
                width:216,
                render: (text, record) => {
                    let result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"200px"}}><span title={text}>{text}</span></p>;
                    return result;
                }
            }, {
                title: '时间',
                dataIndex: 'createTimeStr',
                key: 'createTimeStr',
                width:156,
                render: (text, record) => {
                    let result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"140px"}}>{text}</p>;
                    return result;
                }
            }, {
                title: '结果',
                dataIndex: 'result',
                key: 'result',
                width:66,
                render: (text, record) => {
                    let result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"50px"}}></p>;
                    if(text == 1){
                        result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"50px"}}><span style={{color:"#3DB900"}}>通过</span></p>
                    }else if(text == 2){
                        result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"50px"}}><span style={{color:"#FAAD14"}}>不通过</span></p>
                    }
                    return result;
                }
            },{
                title: '备注(原因)',
                dataIndex: 'approvalReason',
                key: 'approvalReason',
                width:416,
                render: (text, record) => {
                    let result = <p className="inquiryApprovalLogListTableColumnWidth" style={{width:"400px"}}><span title={text}>{text}</span></p>;
                    return result;
                }
            }]
        return result;
    }

    render() {
        return(
            <Card title="审批记录" bordered={false} className="mb10">
                <Table
                    {...ComponentDefine.table_}
                    rowSelection={null}
                    filterMultiple={false}
                    pagination={false}
                    columns={this.columns()}
                    dataSource={this.state.inquiryApprovalLogList}
                />
            </Card>
        )
    }
}

export default InquiryApprovalLogList

