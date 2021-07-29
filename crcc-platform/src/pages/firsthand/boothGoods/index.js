import {Card, Button, Switch, Modal, Tabs, Row, Col, Popconfirm} from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import less from "./index.less";
import React from "react";
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class FirsthandDpBoothGoodsList extends React.Component {
  state = {
    tableState: 0,//tableState0//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页
    visible:false,
    page:1,
    rows:10
  }

  _isMounted = false;
  activeTab = "0"
  componentWillMount() {
    this._isMounted = true;
    this.handelToLoadTable(1, 'tableState');


  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**查询条件 */
  importantFilter = ['showCompanyName', 'sellerCompanyName'];

  formList = () => {
    return [
      {
        type: 'INPUT',
        field: 'showCompanyName',
        label: '上架专区名',
        placeholder: '请输入上架专区名'
      },
      {
        type: 'INPUT',
        field: 'sellerCompanyName',
        label: '供应商',
        placeholder: '请输入供应商'
      },
      {
        type: 'INPUT',
        field: 'buyerCompanyName',
        label: '原采购公司名',
        placeholder: '请输入原采购公司名'
      },
      {
        type: 'INPUT',
        field: 'buyerContractNo',
        label: '采购合同编号 ',
        placeholder: '请输入采购合同编号'
      },

      {
        type: 'INPUT',
        field: 'goodsName',
        label: '商品名称',
        placeholder: '请输入商品名称'
      },
      {
        type: 'INPUT',
        field: 'spec',
        label: '型号',
        placeholder: '请输入商品型号'
      }
    ]
  }


  handleFilter = (params, isSend = true) => {
    let data={};

    if(params.sellerCompanyName){
      data.sellerCompanyName = params.sellerCompanyName;
    }else {
      data.sellerCompanyName ="";
    }
    if(params.buyerCompanyName){
      data.buyerCompanyName = params.buyerCompanyName;
    }else {
      data.buyerCompanyName ="";
    }
    if(params.buyerContractNo){
      data.buyerContractNo = params.buyerContractNo;
    }else {
      data.buyerContractNo ="";
    }
    if(params.goodsName){
      data.goodsName = params.goodsName;
    }else {
      data.goodsName ="";
    }
    if(params.showCompanyName){
      data.showCompanyName = params.showCompanyName;
    }else {
      data.showCompanyName ="";
    }
    if(params.spec){
      data.spec = params.spec;
    }else {
      data.spec ="";
    }

    this.baseParams = {
      ...data
    }
    if(isSend){
      this.handelToLoadTable();
    }
  }


  baseParams = {};



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
    this.setState({
      [tableState]: state
    })
  }
  columns = () => {
    return [
      {
        title: '供应商名称',
        dataIndex: 'sellerCompanyName',
        key: 'sellerCompanyName',
        width: 150,
        sorter: true,
        render: (text, record) => {
          text = text.replace(/<[^>]+>/g, "");
          return <span className={less.span_zh} title={text}>{text}</span>
        },
      }, {
        title: '原采购名称',
        dataIndex: 'buyerCompanyName',
        key: 'buyerCompanyName',
        width: 150,
        sorter: true,
      }, {
        title: '采购合同编号',
        dataIndex: 'buyerContractNo',
        key: 'buyerContractNo',
        width: 150,
        sorter: true,
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 150,
        sorter: true,
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: 100,
        sorter: true,
      }, {
        title: '型号',
        dataIndex: 'spec',
        key: 'spec',
        width: 100,
        sorter: true,
      },{
        title: '税价合计',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width: 100,
        sorter: true,
      }, {
        title: '关联商品名称',
        dataIndex: 'goodsNameOld',
        key: 'goodsNameOld',
        width: 150,
        sorter:true,
      }, {
        title: '上架专区名',
        dataIndex: 'showCompanyName',
        key: 'showCompanyName',
        width: 150,
        sorter:true,
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Popconfirm  title={'确认删除？'} onConfirm={this.toDelete.bind(this, record)}>
            <Button  style={{borderRadius:"4px",position:"relative",top:"4px",background:"rgba(230,0,18,1)",color:"rgba(255,255,255,1)"}}>删除</Button>
          </Popconfirm>
        )
      }
    ]
  }
  //删除
  toDelete=(record)=>{
    //发送请求
    api.ajax(
        'GET',
        '@/platform/firsthand/boothGoods/deleteByUuids?uuids=' + record.uuids,
        {}
    ).then(r=>{
      Util.alert(r.msg, {type: 'success'});
      //刷新当前页面
      this.handelToLoadTable();
    }).catch(r=>{
      Util.alert(r.msg, {type: 'error'});
      return;
    })
  }


  render() {
    const { info } = this.state;

    return (
        <div>

          <Card bordered={false}>
            <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
            <div className="toolbar">

            {/*  <Button type="primary">添加专区发布</Button>*/}
              <AuthButton type="primary" >添加专区发布</AuthButton>
            </div>
          </Card>
          <Card>
          <BaseTable
              notInit={true}
              url='@/platform/firsthand/boothGoods/findPage'
              tableState={this.state.tableState}
              resetTable={(state) => { this.resetTable(state, 'tableState') }}
              baseParams={this.baseParams}
              columns={this.columns()}
              scroll={{ x: 900 }} />

          </Card>
        </div>
    )
  }
}
export default FirsthandDpBoothGoodsList;