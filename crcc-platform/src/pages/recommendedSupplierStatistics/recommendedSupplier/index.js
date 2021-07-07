import { Card, Button, Table, Switch, message } from 'antd';
import api from '@/framework/axios';
import BaseAffix from "@/components/baseAffix";
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {getUrlByParam, getQueryString, exportFile} from '@/utils/urlUtils';
import less from './index.less';

class recommendedSupplier extends React.Component{
    state = {
        loading: false,
        tableState: 0,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    /**
     * 搜索框三参数
     * @type {[*]}
     */
        //展示的字段
    importantFilter = ['supplierCompanyName', 'twoLevelCompanyName']

    //搜索框全字段
    formList = [
        {
            type: 'INPUT',
            field: 'supplierCompanyName',
            label: '供应商名称',
            placeholder: '供应商名称',
        },
        {
            type: 'INPUT',
            field: 'twoLevelCompanyName',
            label: '局级单位',
            placeholder: '局级单位',
        },
        {
            type: 'INPUT',
            field: 'threeLevelCompanyName',
            label: '处级单位',
            placeholder: '处级单位',
        },
        {
            type: 'INPUT',
            field: 'username',
            label: '推荐人',
            placeholder: '推荐人',
        },
        {
            type: 'INPUT',
            field: 'phone',
            label: '联系电话',
            placeholder: '联系电话',
        },
        {
            type: 'INPUT',
            field: 'email',
            label: '推荐人邮箱',
            placeholder: '推荐人邮箱',
        }
    ]

    //表单提交按钮
    handleFilter = (p, isSend = true) => {
        let createTimeStart, createTimeEnd;
        this.baseParams = {
            ...this.baseParams,
            ...p,
        }
        if(isSend){
            this.reloadTableData();
        }
    }
    baseParams = {
        source:getQueryString('source'),
        uuids:getQueryString('uuids')
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }
    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
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
                dataIndex: 'supplierCompanyName',
                key: 'supplierCompanyName',
                sorter:true,
                width: 150,
            },
            {
                title: '推荐局级单位',
                dataIndex: 'twoLevelCompanyName',
                key: 'twoLevelCompanyName',
                sorter:true,
                width: 150
            },
            {
                title: '推荐处级单位',
                dataIndex: 'threeLevelCompanyName',
                key: 'threeLevelCompanyName',
                sorter:true,
                width: 150
            },
            {
                title: '推荐人',
                dataIndex: 'username',
                key: 'username',
                sorter:true,
                width: 150
            },
            {
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
                sorter:true,
                //width: 150,
                render: (text, record)=>(
                    <p style={{width:"134px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '推荐人邮箱',
                dataIndex: 'email',
                key: 'email',
                sorter:true,
                width: 150,
            },
            {
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter:true,
                //width: 150,
                render: (text, record)=>(
                    <p style={{width:"134px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '通过时间',
                dataIndex: 'approveTime',
                key: 'approveTime',
                sorter:true,
                //width: 150,
                render: (text, record)=>(
                    <p style={{width:"134px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        <a href="javascript:void(0);" onClick={
                            ()=>{
                                let param = {}
                                param.sellerUuids = record.supplierCompanyUuids
                                window.open(SystemConfig.systemConfigPath.jumpPage(getUrlByParam('/supplier/recommendedSupplier', param)))
                            }
                        }>查看</a>
                    </p>
                )
            }
        ]
    }

    render() {
        return(
            <div>
                <Card bordered={false} className="mb10">
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <BaseTable
                        url='!!/purchaser/cecommendedSupplierStatistics/getRecommendedSupplierListForPage'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 1500 }}
                    />
                </Card>
                <BaseAffix>
                    <Button style={{marginRight: "10px"}}  type="primary" onClick={
                        ()=>{
                            let source = getQueryString('source')
                            if(source==2){
                                this.props.history.push('/purchaser/twoLevelCompany')
                            }else if(source==3){
                                let param = {}
                                param.twoLevelCompanyUuids = getQueryString('twoLevelCompanyUuids')
                                this.props.history.push(getUrlByParam('/purchaser/threeLevelCompany', param))
                            }else if(source==0){
                                let param = {}
                                param.twoLevelCompanyUuids = getQueryString('twoLevelCompanyUuids')
                                param.threeLevelCompanyUuids = getQueryString('threeLevelCompanyUuids')
                                this.props.history.push(getUrlByParam('/purchaser/threeLevelCompanyUser', param))
                            }
                        }
                    }>返回</Button>
                </BaseAffix>
            </div>
        )
    }
}
export default recommendedSupplier;