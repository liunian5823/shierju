import {Card, Switch, Icon, Modal, Button, Form, FormItem, Input, Table} from 'antd'
import AuthButton from '@/components/authButton'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import less from './index.less'


class GoodsType extends React.Component {

    _isMounted = false //该组件是否被挂载，用于取消ajax请求的执行
    _userInfo = null

    state = {
        loading: false,
        // roleList: [],
        // 表格数据
        tableState: 0,//tableState//表格状态 0:不刷新或刷新结束，1:刷新列表并返回第一页，2:刷新列表但保持当前页.

        TableDataSource:[],
    }

    baseParams = {
        //系统属性
        ifSystem:1,
    }
    renderFormList = () => {
        return [
            {
                type: 'INPUT',
                field: 'name',
                label: '属性名称',
                placeholder: '请输入属性名称',
                maxLength:30
            },
        ]
    }


    importantFilter = [ 'name'];

    componentWillMount() {
        this._isMounted = true;

        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
            // 获得用户基本信息后执行加载回调
            this.initDataFn();
        }.bind(this));//
        PubSub.publish('PubSub_GetUser', {});//主动获取用户信息数据
    }

    componentWillUnmount() {
        this._isMounted = false;
        PubSub.unsubscribe(this.pubsub_userInfo);
    }

    initDataFn = () => {
        //测试
        this.baseParams = {
            ...this.baseParams,
        }
        // 进入页面加载数据
        this.handelToLoadTable();
    }

    handleFilter = (params, isSend = true) => {
        //根据formList生成的表单输入条件过滤
        this.baseParams = {
            ...this.baseParams,
            ...params,
        }
        if (isSend) {
            this.handelToLoadTable();
        }

    }

    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        // console.log("刷新页面");
        this.setState({
            [tableState]: state
        })
        // 手动请求数据
        // let _this = this;
        // alert("----------------");
        // api.ajax("GET", "@/merchandise/ecGoodsProperty/page", null).then(r => {
        //   if (!_this._isMounted) {
        //     return;
        //   }
        //
        //   if(r.data && r.data.rows){
        //     console.log("已获取到数据");
        //     _this.state.TableDataSource = r.data.rows;
        //     _this.setState({
        //       TableDataSource: r.data.rows,
        //     });
        //   }
        //   else{
        //       console.log("未获取到数据");
        //   }
        // })
    }
    handleToDetails = (id) => {
        this.props.history.push(this.props.history.location.pathname + '/details' + '/' + id)
    }
    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    toAddGoodsAttributePage=()=>{
        this.handleToDetails("addGoodsAttitude");
    }


    //card内容
    extraOptions = () => {
        return  (<span style={{width:"240px"}}>
              {/*<AuthButton className={less.commodityAudit_card_button} type="primary" >配置</AuthButton>*/}
            <AuthButton className={less.commodityAudit_card_button} type="primary" onClick={this.toAddGoodsAttributePage}>新增</AuthButton>
            </span>)
    }

    columns = [
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
                width: 100,
                sorter: true,
                render: (text, record) => {
                    return record.sort;
                }
            },
            {
                title: '属性名称',
                dataIndex: 'name',
                key: 'name',
                
                sorter: false,
            },
            {
                title: '操作',
                dataIndex: 'uuid',
                key: 'uuid',
                width: 180,
                render: (text, record) => {
                    return (
                        <span>
                            <AuthButton  elmType="a" type="primary" onClick={() => this.handleToDetails(record.uuid)}>编辑</AuthButton>
                          </span>
                    )

                }
            }]




    render() {
        // const modeData = this.state.modeData;
        // const { selectedRowKeys } = this.state;
        // const rowCheckSelection = {
        //     type: 'checkbox',
        //     selectedRowKeys,
        //     onChange: (selectedRowKeys)=>{
        //         this.setState({
        //             selectedRowKeys
        //         })
        //         console.log("---------------")
        //     }
        // }
        return (
            <div>
                <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
                <Card bordered={false} title="属性管理" extra={this.extraOptions()}>
                    <BaseTable
                        notInit={true}
                        url="@/merchandise/ecGoodsProperty/page"
                        tableState={this.state.tableState}
                        resetTable={(state) => { this.resetTable(state, 'tableState') }}
                        baseParams={this.baseParams}
                        columns={this.columns}
                        indexkeyWidth={50}
                        // haveSelection={false}
                        selection={false}
                        // dataSource={this.state.TableDataSource}
                        // setSelectedItems={this.setSelectedItems}
                        // syncIndexCompent={this.syncIndexCompent}
                        // onChange={this.handleChange}
                    />
{/*                    <Table
                        rowKey='id'
                        pagination={false}
                        dataSource={this.state.TableDataSource}
                        // rowSelection={false}
                        columns={this.columns} />*/}
                </Card>
            </div>
        )
    }
}

export default GoodsType