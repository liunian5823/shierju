import {Spin, Card, Row, Col, Form, Input, Select, DatePicker, Button, Icon, Table, Divider, Menu, Dropdown, Modal, Tabs, Radio,Pagination } from 'antd';

import { tablePagination_,btnName_} from "@/utils/config/componentDefine";
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getQueryString, getUrlByParam} from '@/utils/urlUtils';
import {DetailsBtns, PermissionsBtn} from '@/components/gaoda/DetailsBtns';
import {getDetailsLabel} from '@/components/gaoda/Details';
import api from '@/framework/axios';
import {NumberFormat} from '@/components/gaoda/Format';

class ListOrderItems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[

            ],
            total:0,
            pageSize: 10,
            page:1,
        }
    }

    componentWillMount(){
        this.handleSearch(
            {settlementId:this.props.settlementId,
            page:1,
            rows:10
        }
        );
    }

    componentWillReceiveProps(props){

    }
    

    handleSearch = (params)=>{
        // let params = {}
        // params.settlementId = this.props.settlementId;
        // params.page = 1;
        // params.rows = 10;
        api.ajax("GET", "@/platform/settlementDetail/getOrderItermBySettlementId", {
            ...params
        }).then(r => {
            this.setState({
                dataSource: r.data,
                total: r.data.total,
                allDataList:r.data.rows,
            })
        });
    }
    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        let params = {
          rows: pageSize,
          page: 1,
          settlementId :this.props.settlementId,
        };
        this.setState(
          {
            currentPage: 1,
            pageSize: pageSize,
          },
          () => {
            this.handleSearch(params);
          },
        );
      };
      pageChange = (page) => {
        
        this.handleSearch({
          settlementId : this.props.settlementId,
           page :page,
          rows : this.state.pageSize
       
   });
      };

      handleSorter = (orderParams, type, e) => {
        console.log('859',orderParams);
        
        let params = {};
    
        // let tableStatus = this.state.searchList.tabStatus;
        // if (tableStatus) {
        //   params.tabStatus = tableStatus;
        // }
        //排序
        if (orderParams != null) {
          params.orderKey = orderParams.field;
        //   params.sort = orderParams.order;
          let sortValue = 0;
          console.log('888888888888888',orderParams.order)
          if (orderParams.order == 'ascend') {
              console.log('bhhfdfhd')
              params.sort = 'asc'
          }else{
              params.sort ='desc'
          }
          if (params.orderKey == 'orderNo') {
            params.orderNoSort = sortValue;
          } else if (params.orderKey == 'brand') {
            params.brandSort = sortValue;
          } else if (params.orderKey == 'productName') {
            params.productNameSort = sortValue;
          } else if (params.orderKey == 'specifications') {
            params.specificationsSort = sortValue;
          } else if (params.orderKey == 'count') {
            params.countSort = sortValue;
          } else if (params.orderKey == 'finalPrice') {
            params.finalPriceSort = sortValue;
          } else if (params.orderKey == 'tax') {
            params.taxSort = sortValue;
          } else if (params.orderKey == 'salePrice') {
            params.salePriceSort = sortValue;
          } else if (params.orderKey == 'productTotalPrice') {
            params.productTotalPriceSort = sortValue;
          }
        }
    
        
        if (type !== 'sort') {
          this.setState({ activeKey: '1' })
        }
        this.setState(
          {
            page: 1,
          },
          () => {
            params.rows = 10;
            params.page = 1;
            params.settlementId = this.props.settlementId,
            this.handleSearch(params);
          },
        );
      };


    columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width:150,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"160px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width:100,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    },{
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:150,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"130px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '规格型号',
        dataIndex: 'specifications',
        key: 'specifications',
        width:100,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        ),
    }, {
        title: '实际采购量',
        dataIndex: 'count',
        key: 'count',
        width:100,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"80px"}} className="table_overflow_twoLine">
                <span title={text}>{text}</span>
            </p>
        )
    },{
        title: '成交单价',
        dataIndex: 'finalPrice',
        key: 'finalPrice',
        className:'text_align_right',
        width:120,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },{
        title: '税额',
        dataIndex: 'tax',
        key: 'tax',
        className:'text_align_right',
        width:120,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{(text || text == 0)?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    },{
        title: '商品金额',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className:'text_align_right',
        width:120,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }, {
        title: '税价合计',
        dataIndex: 'productTotalPrice',
        key: 'productTotalPrice',
        className:'text_align_right',
        width:120,
        sorter: true,
        render: (text, record, index) => (
            <p style={{width:"100px",float:"right"}}>
                <span title={text}>{text?<NumberFormat value={text}/>:"-"}</span>
            </p>
        )
    }];

    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
          }
        return (
            <div className="purchaserSettlementDetailListOrderItems">
                <Table
                    rowSelection={null}
                    onChange = {this.onChange}
                    columns = {this.columns}
                    dataSource = {this.state.dataSource.rows}
                    pagination = {false}
                    scroll = {{x:true}}
                    onChange = {(pagination,filters,sorter)=>{
                        this.handleSorter(sorter,'sort')
                    }}
                />
                <div style={{float: 'right',margin: '16px 0'}}>
                <Pagination
                    total={this.state.total}
                    showSizeChanger
                    showQuickJumper
                    showTotal={showTotal}
                    onChange={this.pageChange}
                    onShowSizeChange={this.onShowSizeChange}
                />
             
            </div>
            </div>
        )
    }
}

export default Form.create()(ListOrderItems)