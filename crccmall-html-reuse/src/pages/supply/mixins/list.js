import api from '@/framework/axios';
import { Card, Modal } from 'antd';
import Qs from 'qs'
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import BaseTabs from '@/components/baseTabs';
import AuthButton from '@/components/authButton';
import { baseService } from '@/utils/common';
import del from '@/static/svg/del.svg'
import '../style/index.css'
import { message } from 'antd';
import Util from "@/utils/util";
import { configs } from "@/utils/config/systemConfig";
const _MAINBIDOBJ = baseService._supplyMainBid_obj;
const _SID = baseService.sellBid;
export default class SupplyDemand extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultKey: sessionStorage.SupplyStatus || null,
            delVisible: false,
            delConfirmLoading: false,
            delData: null,
        };
    }
    /**查询条件 */
    baseParams = {
        status: sessionStorage.SupplyStatus || null
    }

    importantFilter = ['code', 'creatStartDate'];

    formList = [
        {
            type: 'RANGE',
            field: 'creatStartDate',
            label: '发布时间'
        },
        {
            type: 'INPUT',
            field: 'code',
            label: '供求单号',
            placeholder: '请输入'
        },
        {
            type: 'RANGE',
            field: 'effectiveStartDate',
            label: '有效时间'
        },
        {
            type: 'INPUT',
            field: 'categoryName',
            label: '品类',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'publishProjectName',
            label: '发布项目',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'goodsName',
            label: '名称/商品',
            placeholder: '请输入'
        },
        {
            type: 'INPUT',
            field: 'createUserName',
            label: '发布人',
            placeholder: '请输入'
        },
        {
            type: 'SELECT',
            field: 'useArea',
            label: '应用领域',
            placeholder: '请选择应用领域',
            list: [
                {
                    id: 1,
                    value: '房建类'
                },
                {
                    id: 2,
                    value: '公路类'
                },
                {
                    id: 3,
                    value: '铁路类'
                },
                {
                    id: 4,
                    value: '桥梁隧道类'
                },
                {
                    id: 5,
                    value: '市政类'
                },
            ]
        },
        {
            type: 'SELECT',
            field: 'type',
            label: '类型',
            placeholder: '请选择类型',
            list: [
                {
                    id: 1,
                    value: '供应'
                },
                {
                    id: 2,
                    value: '求购'
                },
            ]
        },
    ];

    switchDelVis = data => {
        this.setState({
            delVisible: !!data,
            delData: data
        })
    };
    //导出
    exportList = () => {
        let fieldsValue = this.refs.BaseForm.getFieldsValue()
        this.handleFilter({ ...fieldsValue, is_export: '' })
        let param = Util.deleteEmptyKey({ ...this.baseParams })
        if (Object.keys(param).length) {
            window.open(configs.exportUrl + this.exportUrl + '?' + Qs.stringify(param))
        } else {
            window.open(configs.exportUrl + this.exportUrl)
        }
    };
    // 删除
    delItem = () => {
        let { uuids } = this.state.delData;
        if (uuids) {
            this.setState({
                delConfirmLoading: true
            });
            api.ajax('GET', this.delUrl, {
                uuids
            }).then(res => {
                this.setState({
                    delConfirmLoading: false
                });
                this.reloadTableData();
                this.switchDelVis(null);
            }, e => {
                message.error(e.msg);
                this.setState({
                    delConfirmLoading: false
                });
            })
        }
    };

    // 递交
    submitItem = (tr) => {
        let that = this;
        Util.confirm('发布供求信息', {
            tip: '确定发布该供求信息吗？',
            width: 500,
            content: (
                <div>
                    <p>供求信息单号：{tr.code}</p>
                    <p>信息标题：{tr.noticeName}</p>
                    <p>单位名称：{tr.publishCompanyName}</p>
                    <p>销售项目部：{tr.publishProjectName}</p>
                </div>
            ),
            onOk() {
                if (tr.uuids) {
                    api.ajax('POST', that.submitUrl, {
                        uuids: tr.uuids
                    }).then(res => {
                        Util.alert(res.msg || '递交成功', {
                            type: 'success'
                        })
                        that.reloadTableData()
                    }, error => {
                        Util.alert(error.msg || '递交失败', {
                            type: 'error'
                        })
                    })
                }
            }
        })
    };

    handleFilter = (p) => {
        if (p.is_export === undefined) {
            this.baseParams.tabStatus = null
            this.setState({
                defaultKey: null
            })
        }
        // 发布时间 creatStartDate    creatEndDate
        // 有效时间 effectiveStartDate    effectiveEndDate
        let params = {
            creatStartDate: null,
            creatEndDate: null,
            effectiveStartDate: null,
            effectiveEndDate: null,
        };
        if (p.creatStartDate) {
            params.creatStartDate = p.creatStartDate[0] ? moment(p.creatStartDate[0]).format('YYYY-MM-DD') : '';
            params.creatEndDate = p.creatStartDate[1] ? moment(p.creatStartDate[1]).format('YYYY-MM-DD') : '';
        }
        if (p.effectiveStartDate) {
            params.effectiveStartDate = p.effectiveStartDate[0] ? moment(p.effectiveStartDate[0]).format('YYYY-MM-DD') : '';
            params.effectiveEndDate = p.effectiveStartDate[1] ? moment(p.effectiveStartDate[1]).format('YYYY-MM-DD') : '';
        }
        this.baseParams = {
            ...this.baseParams,
            ...p,
            ...params
        };
        this.reloadTableData();
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    };

    reloadTableData(state = 1) {
        this.handelToLoadTable(state, 'tableState');
    };

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    render() {
        let { delData, delConfirmLoading } = this.state
        return (
            <div>
                <Modal
                    title="删除供求信息"
                    visible={this.state.delVisible}
                    onOk={this.delItem}
                    confirmLoading={delConfirmLoading}
                    onCancel={() => { this.switchDelVis(null) }}
                    okText="确认"
                    cancelText="取消"
                >
                    <img src={del} width={30} height={30} />
                    {delData && <div className="delModel">
                        <p className="delModel-title">确定删除供求信息吗? 删除后该供求信息不能恢复!</p>
                        <p><span className="delModelListLabel">供求信息单号</span>{delData.code}</p>
                        <p><span className="delModelListLabel">信息标题</span>{delData.noticeName}</p>
                        <p><span className="delModelListLabel">单位名称</span>{delData.publishCompanyName}</p>
                        <p><span className="delModelListLabel">销售项目部</span>{delData.publishProjectName}</p>
                    </div>
                    }
                </Modal>
                <BaseForm ref='BaseForm' formList={this.formList} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <Card className="mt10" bordered={false}>
                    <BaseTabs defaultKey={this.state.defaultKey} tabsList={_SID} tabChange={this.tabChange}>
                        <AuthButton onClick={this.exportList}>导出</AuthButton>
                        <AuthButton type="primary" onClick={this.addPublishSD}>发布供求信息</AuthButton>
                    </BaseTabs>
                    <BaseTable
                        scroll={{ x: 1200 }}
                        url={this.pageUrl}
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns} />
                </Card>
            </div>
        )
    }
}
