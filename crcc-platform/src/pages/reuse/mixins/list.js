import { Card, Tabs } from 'antd';

const { TabPane } = Tabs;
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import AuthButton from '@/components/authButton'
import './index.css'

class supplierManagement extends React.Component {
    importantFilter = ['codeOrName', 'code', 'source', 'goodsName', 'nameOrCode'];
    state = {
        loading: false,
        tableState: 0,
        supplierInfo: {}, // 供应商信息
        adminInfo: {}, //管理员信息
        supplierUsersInfo: [], //本公司不是管理员的用户信息列表
        userInfo: {}, //选中的管理员
        resetInformationShow: false, // 重置信息弹框显示标识
        resetAdminShow: false, // 重置管理员弹框显示标识
        mainCommodityData: [],//主营类目
        activeKey: '0'
    }

    _isMounted = false;
    baseParams = {};

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleFilter = (p, isSend = true) => {
        if (p.is_export === undefined) {
            this.baseParams.queryState = null;
            this.setState({
                activeKey: '0'
            })
        }
        let
            // 截止时间
            effectiveStartDate, effectiveEndDate,
            // 审核时间
            approvalStartDate, approvalEndDate,
            // 发布时间
            creatStartDate, creatEndDate,
            // 发布时间
            bidStartDate, bidEndDate,
            offerStartTimeStart, offerStartTimeEnd,
            offerEndTimeStart, offerEndTimeEnd,
            signEndTimeStart, signEndTimeEnd,
            // 下单时间
            createStartDate, createEndDate;


        if (p.effectiveStartDate) {
            effectiveStartDate = p.effectiveStartDate[0] ? moment(p.effectiveStartDate[0]).format('YYYY-MM-DD') : '';
            effectiveEndDate = p.effectiveStartDate[1] ? moment(p.effectiveStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.approvalStartDate) {
            approvalStartDate = p.approvalStartDate[0] ? moment(p.approvalStartDate[0]).format('YYYY-MM-DD') : '';
            approvalEndDate = p.approvalStartDate[1] ? moment(p.approvalStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.creatStartDate) {
            creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.createStartDate) {
            createStartDate = p.createStartDate[0] ? moment(p.createStartDate[0]).format('YYYY-MM-DD') : '';
            createEndDate = p.createStartDate[1] ? moment(p.createStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.bidStartDate) {
            bidStartDate = p.bidStartDate[0] ? moment(p.bidStartDate[0]).format('YYYY-MM-DD') : '';
            bidEndDate = p.bidStartDate[1] ? moment(p.bidStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerStartTimeStart) {
            offerStartTimeStart = p.offerStartTimeStart[0] ? moment(p.offerStartTimeStart[0]).format('YYYY-MM-DD') : '';
            offerStartTimeEnd = p.offerStartTimeStart[1] ? moment(p.offerStartTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.offerEndTimeStart) {
            offerEndTimeStart = p.offerEndTimeStart[0] ? moment(p.offerEndTimeStart[0]).format('YYYY-MM-DD') : '';
            offerEndTimeEnd = p.offerEndTimeStart[1] ? moment(p.offerEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        if (p.signEndTimeStart) {
            signEndTimeStart = p.signEndTimeStart[0] ? moment(p.signEndTimeStart[0]).format('YYYY-MM-DD') : '';
            signEndTimeEnd = p.signEndTimeStart[1] ? moment(p.signEndTimeStart[1]).format('YYYY-MM-DD') : '';
        }
        delete p.createTimeArr;
        this.baseParams = {
            ...this.baseParams,
            ...p,
            effectiveStartDate, effectiveEndDate,
            approvalStartDate, approvalEndDate,
            creatStartDate, creatEndDate,
            offerStartTimeStart, offerStartTimeEnd,
            offerEndTimeStart, offerEndTimeEnd,
            signEndTimeStart, signEndTimeEnd,
            bidStartDate, bidEndDate,
            createStartDate, createEndDate
        };
        if (isSend) {
            this.reloadTableData();
        }
    };
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

    handleToExport = () => {
        let params = '';
        let p = this.baseParams;
        if (p.createTimeArr) {
            p.createTimeStart = p.createTimeArr[0] ? moment(p.createTimeArr[0]).format('YYYY-MM-DD') : '';
            p.createTimeEnd = p.createTimeArr[1] ? moment(p.createTimeArr[1]).format('YYYY-MM-DD') : '';
            p.createTimeArr = '';
        } else {
            p.createTimeStart = '';
            p.createTimeEnd = '';
        }
        for (let index in this.baseParams) {
            if (this.baseParams[index]) {
                params += index + '=' + this.baseParams[index] + '&'
            }
        }

        window.open(
            window.location.origin + this.exportUrl + '?' + params
        )
    };
    switchTagChange = e => {
        this.setState({
            activeKey: e
        });
        this.baseParams.queryState = e === '0' ? '' : e;
        this.reloadTableData();
    };

    render() {
        let columns = this.columns();
        let scrollX = 0;
        columns.forEach(({ width }) => scrollX += width);
        return (
            <div className="list">
                <Card bordered={false}>
                    <BaseForm formList={this.formList()} importantFilter={this.importantFilter}
                        filterSubmit={this.handleFilter} />
                    {
                        this.switchTag ?
                            <Tabs activeKey={this.state.activeKey || '0'} onChange={this.switchTagChange} tabBarExtraContent={
                                <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
                            }>
                                {this.switchTag.map(value => <TabPane {...value} />)}
                            </Tabs>
                            :
                            <div className="toolbar">
                                <AuthButton type="primary" onClick={this.handleToExport}>导出</AuthButton>
                            </div>

                    }
                    <BaseTable
                        url={this.initUrl}
                        tableState={this.state.tableState}
                        resetTable={(state) => {
                            this.resetTable(state, 'tableState')
                        }}
                        baseParams={this.baseParams}
                        columns={columns}
                        scroll={{ x: scrollX }} />
                </Card>
            </div>
        )
    }
}

export default supplierManagement;
