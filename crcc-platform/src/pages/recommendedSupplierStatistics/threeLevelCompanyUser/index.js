import { Card, Button, Table, Switch, message, Col } from 'antd';
import api from '@/framework/axios';
import BaseAffix from "@/components/baseAffix";
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {getUrlByParam, getQueryString, exportFile} from '@/utils/urlUtils';
import less from './index.less';
import dsh from '@/static/iconfont/dsh.png';
import ytg from '@/static/iconfont/ytg.png';
import ybh from '@/static/iconfont/ybh.png';
import qbg from '@/static/iconfont/qbg.png';

class threeLevelCompanyUser extends React.Component{
    state = {
        TwoLevelCompanyStatistics:{},
        loading: false,
        tableState: 0,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        api.ajax("GET", "!!/purchaser/cecommendedSupplierStatistics/getThreeLevelCompanyUserStatistics",{
            threeLevelCompanyUuids:getQueryString('threeLevelCompanyUuids')
        }).then((r) => {
            if(this._isMounted){
                if(r.data){
                    this.setState({
                        TwoLevelCompanyStatistics:r.data
                    })
                }
            }
        })
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    /**
     * 搜索框三参数
     * @type {[*]}
     */
        //展示的字段
    importantFilter = ['username', 'phone']

    //搜索框全字段
    formList = [
        {
            type: 'INPUT',
            field: 'username',
            label: '员工姓名',
            placeholder: '员工姓名',
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
            label: '员工邮箱',
            placeholder: '员工邮箱',
        },
        {
            type: 'SELECT',
            field: 'state',
            label: '子账号状态',
            placeholder: '子账号状态',
            list: [
                {
                    id: '0',
                    value: '停用'
                },
                {
                    id: '1',
                    value: '启用'
                }
            ]
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
        threeLevelCompanyUuids:getQueryString('threeLevelCompanyUuids')
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
                title: '处级单位名',
                dataIndex: 'threeLevelCompanyName',
                key: 'threeLevelCompanyName',
                sorter:true,
                width: 300,
            },
            {
                title: '员工姓名',
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
                width: 150
            },
            {
                title: '员工邮箱',
                dataIndex: 'email',
                key: 'email',
                sorter:true,
                width: 150
            },
            {
                title: '子账号状态',
                dataIndex: 'stateStr',
                key: 'stateStr',
                sorter:true,
                width: 150
            },
            {
                title: '累计待审核数量',
                dataIndex: 'recommendStateZeroCount',
                key: 'recommendStateZeroCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"114px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '累计已推荐数量',
                dataIndex: 'recommendStateOneCount',
                key: 'recommendStateOneCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"114px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '累计已驳回数量',
                dataIndex: 'recommendStateTwoCount',
                key: 'recommendStateTwoCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"114px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record)=>(
                    <p style={{width:"134px"}}>
                        <a onClick={
                            ()=>{
                                let param = {}
                                param.twoLevelCompanyUuids = getQueryString('twoLevelCompanyUuids')
                                param.threeLevelCompanyUuids = getQueryString('threeLevelCompanyUuids')
                                
                                param.source = 0
                                param.uuids = record.userUuids
                                this.props.history.push(getUrlByParam('/purchaser/recommendedSupplier', param))
                            }
                        }>供应商名单</a>
                    </p>
                )
            }
        ]
    }

    export = () => {
        exportFile('/purchaser/cecommendedSupplierStatistics/exportThreeLevelCompanyUserList',{...this.baseParams})
    }

    render() {
        return(
            <div>
                <Card bordered={false} className="mb10" style={{height:"104px"}}>
                    <Col span="22">
                        <Col span="6" className={less.recommendState_img}>
                            <img src={dsh}/>
                            <div className={less.recommendState_p}>
                                <p><em>{this.state.TwoLevelCompanyStatistics.recommendStateZeroCount}</em>家</p>
                                <p>待审核</p>
                            </div>
                            <div className={less.recommendState_sx}></div>
                        </Col>
                        <Col span="6" className={less.recommendState_img}>
                            <img src={ytg}/>
                            <div className={less.recommendState_p}>
                                <p><em>{this.state.TwoLevelCompanyStatistics.recommendStateOneCount}</em>家</p>
                                <p>已通过</p>
                            </div>
                            <div className={less.recommendState_sx}></div>
                        </Col>
                        <Col span="6" className={less.recommendState_img}>
                            <img src={ybh}/>
                            <div className={less.recommendState_p}>
                                <p><em>{this.state.TwoLevelCompanyStatistics.recommendStateTwoCount}</em>家</p>
                                <p>已驳回</p>
                            </div>
                            <div className={less.recommendState_sx}></div>
                        </Col>
                        <Col span="6" className={less.recommendState_img}>
                            <img src={qbg}/>
                            <div className={less.recommendState_p}>
                                <p><em>{this.state.TwoLevelCompanyStatistics.recommendStateAllCount}</em>家</p>
                                <p>全部共</p>
                            </div>
                        </Col>
                    </Col>
                    <Col span="2" className={less.dc_button}>
                        <Button type="primary" onClick={this.export}>导出</Button>
                    </Col>
                </Card>
                <Card bordered={false} className="mb10">
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <BaseTable
                        url='!!/purchaser/cecommendedSupplierStatistics/getThreeLevelCompanyUserListForPage'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 1500 }}
                    />
                </Card>
                <BaseAffix>
                    <Button style={{marginRight: "10px"}} type="primary" onClick={
                        ()=>{
                            let param = {}
                            param.twoLevelCompanyUuids = getQueryString('twoLevelCompanyUuids')
                            this.props.history.push(getUrlByParam('/purchaser/threeLevelCompany', param))
                        }
                    }>返回</Button>
                </BaseAffix>
            </div>
        )
    }
}
export default threeLevelCompanyUser;