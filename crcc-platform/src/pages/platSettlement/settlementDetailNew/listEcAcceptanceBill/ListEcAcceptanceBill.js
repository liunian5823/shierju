import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';
import CheckSettleModal from './checksettlemodal'
import moment from 'moment';
import BaseTable from '@/components/baseTable'

class ListOrders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ],
            draftData: {},
            switchModal: false,
        }
    }

    componentWillMount(){
        this.handleSearch();
    }

    componentWillReceiveProps(props){

    }

    handleSearch = ()=>{
        let params = {}
        params.settlementId = this.props.settlementId;
        params.page = 1;
        params.rows = 10;
        api.ajax("GET", "@/platform/settlementDetail/getEcAcceptanceBill", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data
            })
        });
    }
    //查看承兑汇票
    checkDraft = (type,record) => {
        this.setState({
            switchModal: true,
            type
        })
        let params = {
            uuids: record.uuids
        }
        axios.get('@/settlement/detail/getAcceptancebil', { params }).then((res) => {
            this.setState({ draftData: res.data })
            // this.showModal("Acceptance_of_draft")
        })
    }
    closeModal = () => {
        this.setState({ switchModal: false })
    }
    stausToRes = (status) => {
        if (!status) {
          return;
        }
        let tempStatus = '';
        switch (status) {
          case 1:
            tempStatus = '审批中';
            break;
          case 2:
            tempStatus = '收票中';
            break;
          case 3:
            tempStatus = '可冻结';
            break;
          case 4:
            tempStatus = '可融资';
            break;
          default:
            break;
        }
        return tempStatus;
      };

    columns = [{
        title: '票据单号',
        dataIndex: 'billNo',
        key: 'billNo',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '流水号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '票据号',
        dataIndex: 'sysBillNo',
        key: 'sysBillNo',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{text}</span>
            </p>
        )
    },
    {
        title: '票据类型',
        dataIndex: 'billType',
        key: 'billType',
        width:120,
        render: (text, record, index) => {
            let billType = "-"
            if(1==text){
                billType = "铁建银信";
            }
            if(2==text){
                billType = "商业承兑汇票";
            }
            return(
                <p style={{width:"100px"}} className="table_overflow_twoLine">
                    <span title={billType}>{billType}</span>
                </p>
            )
        }
    },
    
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 180,
        sorter: true,
        render: (text, record, index) => {
            let type = ''
            let color = ''
            switch (text) {
                case 1:
                    type = '审批中'
                    color = '#A1DDF9'
                    break;
                case 2:
                    type = '收票中'
                    color = '#A1DDF9'
                    break;
                case 3:
                    type = '冻结中'
                    color = '#F9B5B6'
                    break;
                case 4:
                    type = '可融资'
                    color = '#B0E8CB'
                    break;
                case 5:
                    type = '已完成'
                    color = '#6DD400'
                    break;
                case 6:
                    type = '作废'
                    color = '#E02020'
                    break;
                case 7:
                    type = '待复核签收'
                    color = '#A1DDF9'
                    break;
                default:
                    break;
            }
            return (
                <p className="tableColumnWidth" style={{ width: '100px' }}>
                    <span style={{ color }} title={type}>{type}</span>
                </p>
            );
        },
        // render: (text, record, index) => {
        //     if(!text){
        //         return '--'
        //     }
        //     let statusStr = this.stausToRes(text);
        //     let color;
        //     switch (statusStr){
        //         case '审批中':
        //             color = '#54c5f7';
        //             break;
        //         case '收票中':
        //             color = '#54c5f7';
        //             break;
        //         case '冻结中':
        //             color = 'red';
        //             break;
        //         case '可融资':
        //             color = '#2fc371';
        //             break;
        //     }
        // return <div >
        //     <p style={{color: `${color}`}}>{statusStr?statusStr:'-'}</p>
        // </div>
        // }
    },
    {
        title: '金额',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:188,
        render: (text, record, index) => (
            <p style={{width:"172px"}}>
                <span title={text}>{(text || text==0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },
    {
        title: '开立日期',
        dataIndex: 'openDate',
        key: 'openDate',
        width:88,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    },
    {
        title: '承兑日期',
        dataIndex: 'acceptanceTime',
        key: 'acceptanceTime',
        width:88,
        render: (text, record, index) => (
            <p style={{width:"72px"}}>
                <span title={text?moment(text).format("YYYY-MM-DD"):"-"}>{text?moment(text).format("YYYY-MM-DD"):"-"}</span>
            </p>
        )
    },
    {
        title: '操作',
        width: 70,
        render: (text, record, index) => {
            return (
                <div className="tableColumnWidth" style={{ width: '70px' }}>
                    <p> <a onClick={() => { this.checkDraft('Acceptance_of_draft',record) }}>查看</a></p>
                </div>
            );
        },
    },
];

    render() {
        return (
            <div className="purchaserSettlementDetailListOrders">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource.rows}
                    pagination = {false}
                    scroll = {{x:true}}
                />
                <CheckSettleModal
                    show={this.state.switchModal}
                    close={this.closeModal}
                    draftData={this.state.draftData}
                ></CheckSettleModal>
            </div>
        )
    }
}

export default Form.create()(ListOrders)