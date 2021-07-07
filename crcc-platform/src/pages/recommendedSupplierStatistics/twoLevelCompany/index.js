import { Card, Button, Table, Switch, message, Col } from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {getUrlByParam, getQueryString, exportFile} from '@/utils/urlUtils';
import less from './index.less';
import dsh from '@/static/iconfont/dsh.png';
import ytg from '@/static/iconfont/ytg.png';
import ybh from '@/static/iconfont/ybh.png';
import qbg from '@/static/iconfont/qbg.png';

class twoLevelCompany extends React.Component{
    state = {
        TwoLevelCompanyStatistics:{},
        loading: false,
        tableState: 0,
    }

    _isMounted = false;

    componentWillMount(){
        this._isMounted = true;
        api.ajax("GET", "!!/purchaser/cecommendedSupplierStatistics/getTwoLevelCompanyStatistics").then((r) => {
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
    importantFilter = ['twoLevelCompanyName', 'adminName']

    //搜索框全字段
    formList = [
        {
            type: 'INPUT',
            field: 'twoLevelCompanyName',
            label: '局级单位名',
            placeholder: '局级单位名',
        },
        {
            type: 'INPUT',
            field: 'adminName',
            label: '管理员姓名',
            placeholder: '管理员姓名',
        },
        {
            type: 'INPUT',
            field: 'adminPhone',
            label: '联系电话',
            placeholder: '联系电话',
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
                title: '局级单位名',
                dataIndex: 'twoLevelCompanyName',
                key: 'twoLevelCompanyName',
                sorter:true,
                width: 300,
            },
            {
                title: '旗下处级单位数',
                dataIndex: 'threeLevelCompanyCount',
                key: 'threeLevelCompanyCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '旗下项目数',
                dataIndex: 'organizationConut',
                key: 'organizationConut',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '子账号数',
                dataIndex: 'userCount',
                key: 'userCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '管理员姓名',
                dataIndex: 'adminName',
                key: 'adminName',
                sorter:true,
                width: 150
            },
            {
                title: '联系电话',
                dataIndex: 'adminPhone',
                key: 'adminPhone',
                sorter:true,
                width: 150
            },
            {
                title: '本单位待审核数量',
                dataIndex: 'recommendStateZeroCount',
                key: 'recommendStateZeroCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '本单位已推荐数量',
                dataIndex: 'recommendStateOneCount',
                sorter:true,
                key: 'recommendStateOneCount',
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            // {
            //     title: '本单位已驳回数量',
            //     dataIndex: 'recommendStateTwoCount',
            //     key: 'recommendStateTwoCount',
            //     //width: 100,
            //     render: (text, record)=>(
            //         <p style={{width:"84px"}}>
            //             {text}
            //         </p>
            //     )
            // },
            {
                title: '累计待审核数量',
                dataIndex: 'subRecommendStateZeroCount',
                sorter:true,
                key: 'subRecommendStateZeroCount',
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            {
                title: '累计已推荐数量',
                dataIndex: 'subRecommendStateOneCount',
                key: 'subRecommendStateOneCount',
                sorter:true,
                //width: 100,
                render: (text, record)=>(
                    <p style={{width:"84px"}}>
                        {text}
                    </p>
                )
            },
            // {
            //     title: '已驳回数量',
            //     dataIndex: 'recommendStateTwoCount',
            //     key: 'subRecommendStateTwoCount',
            //     //width: 100,
            //     render: (text, record)=>(
            //         <p style={{width:"84px"}}>
            //             {text}
            //         </p>
            //     )
            // },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'right',
                width: 160,
                render: (text, record)=>(
                    <p style={{width:"144px"}}>
                        <a onClick={
                           ()=>{
                               let param = {}
                               param.twoLevelCompanyUuids = record.twoLevelCompanyUuids
                               this.props.history.push(getUrlByParam('/purchaser/threeLevelCompany', param))
                           }
                        }>查看数据</a>
                        <span className="ant-divider"></span>
                        <a onClick={
                               ()=>{
                                   let param = {}
                                   param.source = 2
                                   param.uuids = record.twoLevelCompanyUuids
                                   this.props.history.push(getUrlByParam('/purchaser/recommendedSupplier',param))
                               }
                        }>供应商名单</a>
                    </p>
                )
            }
        ]
    }

    export = () => {
        exportFile('/purchaser/cecommendedSupplierStatistics/exportTwoLevelCompanyList',{...this.baseParams})
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
                <Card bordered={false}>
                    <BaseForm formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter}></BaseForm>
                    <BaseTable
                        url='!!/purchaser/cecommendedSupplierStatistics/getTwoLevelCompanyListForPage'
                        tableState={this.state.tableState}
                        resetTable={(state)=>{this.resetTable(state,'tableState')}}
                        baseParams={this.baseParams}
                        columns={this.columns()}
                        scroll={{ x: 2000 }}
                    />
                </Card>
            </div>
        )
    }
}
export default twoLevelCompany;