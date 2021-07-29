import { Card, Button, Switch,Modal,Tabs,Row,Col, Popconfirm } from 'antd';
import React from 'react';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton';
import Util from '@/utils/util'
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
import { systemConfigPath} from '@/utils/config/systemConfig'

class FirsthandContractList extends React.Component {
    state = {
        tableState0: 0,//tableState1//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState10: 0,//tableState2//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState20: 0,//tableState3//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
        tableState30: 0,//tableState4//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.
    }

    _isMounted = false;
    activeTab = "0"
    componentWillMount() {
        this._isMounted = true;
        this.handelToLoadTable(1, 'tableState0');

    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**查询条件 */
    importantFilter = ['contractName', 'buyerContractNo']

    formList = () => {
        return [
            {
                type: 'INPUT',
                field: 'contractName',
                label: '合同名称',
                placeholder: '合同名称'
            },
            {
                type: 'INPUT',
                field: 'buyerContractNo',
                label: '采购合同号',
                placeholder: '采购合同号'
            },
            {
                type: 'INPUT',
                field: 'contractNo',
                label: '平台合同号',
                placeHolder: '平台合同号'
            },
            {
                type: 'INPUT',
                field: 'sellerCompanyName',
                label: '供应公司名',
                placeholder: '供应公司名'
            },
            {
                type: 'INPUT',
                field: 'buyerCompanyName',
                label: '采购公司名',
                placeholder: '采购公司名'
            },
            {
                type: 'SELECT',
                field: 'range',
                label: '适用范围',
                placeholder: '适用范围',
                list: [
                    {
                        id: '0',
                        value: '仅直属项目部'
                    },
                    {
                        id: '1',
                        value: '包含下级公司'
                    }
                ]
            },
            {
                type: 'RANGETIME',
                field: 'endTime',
                label: '合同有效期',
                placeHolder: '请筛选时间段'
            },
            {
                type: 'INPUT',
                field: 'createCompanyId',
                label: '录入方',
                placeholder: '录入方',
                list: [
                    {
                        id: '0',
                        value: '平台'
                    },
                    {
                        id: '1',
                        value: '本公司'
                    }
                ]
            },
            {
                type: 'SELECT',
                field: 'status',
                label: '合同状态',
                placeholder: '请选择合同状态',
                list: [
                    {
                        id: '10',
                        value: '待提交'
                    },
                    {
                        id: '20',
                        value: '待供方确认'
                    },
                    {
                        id: '30',
                        value: '供方已确认'
                    }
                ]
            }
        ]
    }


    handleFilter = (p, isSend = true) => {
        let key = this.activeTab;
        let endTimeS, endTimeE;
        if (p.endTime) {
            endTimeS = p.endTime[0] ? moment(p.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '';
            endTimeE = p.endTime[1] ? moment(p.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';
            p.findCreatTame = null;
        }

        this['baseParams' + key] = {
            ...this['baseParams' + key],
            ...p,
            endTimeS,
            endTimeE
        }
        if (isSend) {
            this.reloadTableData();
        }
    }


    baseParams0 = {
        selectTab:-1
    }
    baseParams1 = {
        selectTab:10
    }
    baseParams2 = {
        selectTab:20
    }
    baseParams3 = {
        selectTab:30
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
                title: '合同名称',
                dataIndex: 'contractName',
                key: 'contractName',
                width: 150,
                sorter: true
            },
            {
               title: '采购合同号',
               dataIndex: 'buyerContractNo',
               key: 'buyerContractNo',
               width: 200,
               sorter: true
           },
           {
               title: '平台合同号',
               dataIndex: 'contractNo',
               key: 'contractNo',
               width: 200,
               sorter: true
           },
           {
               title: '采购公司',
               dataIndex: 'buyerCompanyName',
               key: 'buyerCompanyName',
               width: 250,
               sorter: true
           },
           {
               title: '供应公司',
               dataIndex: 'sellerCompanyName',
               key: 'sellerCompanyName',
               width: 150,
               sorter: true
           },
           {
               title: '确认状态',
               dataIndex: 'status',
               key: 'status',
               width: 100,
               sorter:true,
               render: (text, record) =>{
                   switch (text) {
                       case '10':
                           return <span >待提交</span>;
                       case '20':
                           return <span >待供方确认</span>
                       case '30':
                           return <span >供方已确认</span>
                   }
               }
           },
           {
               title: '有效状态',
               dataIndex: 'validStatus',
               key: 'validStatus',
               width: 200,
               sorter: true,
               render: (text, record) =>{
                   return   <span>{this.validStatus(record)}</span>
               }
           },
          {
               title: '录入方',
               dataIndex: 'createCompanyId',
               key: 'createCompanyId',
               width: 170,
               sorter: true,
              render: (text, record) =>{
                  return <span>{text == 0 ? '平台' : '采购方'}</span>
              }
           },
           {
               title: '适用范围',
               dataIndex: 'range',
               key: 'range',
               width: 150,
               sorter: true,
               render: (text, record) => {
                   return <span>{text == '0' || text == 0 ? '仅直属项目部' : '包含下级公司'}</span>
               }
           }, {
               title: '操作',
               dataIndex: '',
               key: 'x',
               width: 150,
               fixed: 'right',
               render: (text, record) => {
                   if (record.status == '10') {        //待提交：提交，修改，删除
                       return (
                           <span>
                               <AuthButton elmType="a"  onClick={() => {his.toDetail.bind(this, record)}} >查看</AuthButton>
                               <span className="ant-divider"></span>
                               <AuthButton elmType="a" onClick={this.toAdd.bind(this, record) }>提交</AuthButton>
                                 <span className="ant-divider"></span>
                               <AuthButton elmType="a" onClick={this.toAdd.bind(this, record) }>修改</AuthButton>
                                 <span className="ant-divider"></span>
                               {record.createCompanyId == 0 && record.status < 20 ?
                                   <Popconfirm title="您确定要删除此合同吗？" onConfirm={this.deleteContract.bind(this, record.uuids)}>
                                       <AuthButton elmType="a"  href="#">删除</AuthButton>
                                   </Popconfirm>
                                   :''
                               }
                            </span>
                       )
                   }
                   if (record.status == '20') {     //待供方确认：修改
                       return (
                           <span>
                               <AuthButton elmType="a" onClick={() => {his.toDetail.bind(this, record)}}>查看</AuthButton>
                                 <span className="ant-divider"></span>
                               <AuthButton elmType="a" onClick={this.toAdd.bind(this, record) }>修改</AuthButton>
                           </span>
                       )
                   }
                   if (record.status == '30') {     //供方已确认：查看
                       return (
                           <span>
                               <AuthButton elmType="a" onClick={() => {his.toDetail.bind(this, record)}}  >查看</AuthButton>
                                 <span className="ant-divider"></span>
                               <AuthButton elmType="a" onClick={this.toAdd.bind(this, record) }>修改</AuthButton>
                           </span>
                       )
                   }
               }
           }
        ]
    }


    //切换tab页时
    handleTabChange = (key) => {
        this.activeTab = key;
        this.reloadTableData();
    }

    //提交修改跳转
    toAdd =  (key) => {
        window.open(systemConfigPath.jumpPage('/firsthand/firsthandContractRelease'));
    }
    //详情
    toDetail =  (key) => {
        window.open(systemConfigPath.jumpPage('/firsthand/contractDetail?uuids='+key.uuids));
    }

    //删除
    deleteContract =  (key) => {
        //发送请求
        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/deleteByUuids?uuids=' + uuids,
            {}
        ).then(r=>{
            Util.alert(r.msg, {type: 'success'});
            //刷新当前页面
            this.handleSearch(page, pageSize);
        }).catch(r=>{
            Util.alert(r.msg, {type: 'error'});
            return;
        })
    }

    //有效状态
    validStatus=(record)=>{
        let startTime = moment(record.startTime);
        let endTime = moment(record.endTime);
        let now = Date.now();
        let vali = '';
        if (startTime.isBefore(now) && endTime.isAfter(now))
            vali = '生效中'
        if (endTime.isBefore(now))
            vali = '已结束';
        if (startTime.isAfter(now))
            vali = '未开始';
        return vali;
    }

    render() {
        return (
            <div>
                    <Card bordered={false}>
                        <BaseForm formList={this.formList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    </Card>
                    <Card extra={<Button type="primary" style={{paddingRight:"10px",marginLeft:"10px",marginBottom:"10px"}} onClick={this.toAdd} >新增合同</Button>}>
                        <Tabs onTabClick={this.handleTabChange}>
                            <TabPane tab="全部" key="0" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/firsthand/dpContract/selectList'
                                    tableState={this.state.tableState0}
                                    resetTable={(state) => { this.resetTable(state, 'tableState0') }}
                                    baseParams={this.baseParams0}
                                    columns={this.columns()}
                                    scroll={{ x: 2000 }} />
                            </TabPane>
                            <TabPane tab="待提交" key="10" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/firsthand/dpContract/selectList'
                                    tableState={this.state.tableState10}
                                    resetTable={(state) => { this.resetTable(state, 'tableState10') }}
                                    baseParams={this.baseParams1}
                                    columns={this.columns()}
                                    scroll={{ x: 2000 }} />
                            </TabPane>
                            <TabPane tab="待确认" key="20" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/firsthand/dpContract/selectList'
                                    tableState={this.state.tableState20}
                                    resetTable={(state) => { this.resetTable(state, 'tableState20') }}
                                    baseParams={this.baseParams2}
                                    columns={this.columns()}
                                    scroll={{ x: 2000 }} />
                            </TabPane>
                            <TabPane tab="已确认" key="30" >
                                <BaseTable
                                    notInit={true}
                                    url='@/platform/firsthand/dpContract/selectList'
                                    tableState={this.state.tableState30}
                                    resetTable={(state) => { this.resetTable(state, 'tableState30') }}
                                    baseParams={this.baseParams3}
                                    columns={this.columns()}
                                    scroll={{ x: 2000 }} />
                            </TabPane>
                        </Tabs>
                </Card>
            </div>
        )
    }
}
export default FirsthandContractList;