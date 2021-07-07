import React from 'react';
import BaseTable from '@/components/baseTable';
import { Modal, Tabs, Input, Button, Row, Col, Icon } from 'antd';
const TabPane = Tabs.TabPane;
import less from './purchaser.less';
import Util from '../../../utils/util';

const tableData = {
    code: "200",
    data: {
        total: 22,
        pageSize: 10,
        pageNum: 1,
        list: [{
            buyerCompanyId: 'BCID_1',
            buyerCompanyName: '中铁十一局某某公司采购项目1',
        }, {
            buyerCompanyId: 'BCID_2',
            buyerCompanyName: '中铁十一局某某公司采购项目2',
        }, {
            buyerCompanyId: 'BCID_3',
            buyerCompanyName: '中铁十一局某某公司采购项目3',
        }, {
            buyerCompanyId: 'BCID_4',
            buyerCompanyName: '中铁十一局某某公司采购项目4',
        }, {
            buyerCompanyId: 'BCID_5',
            buyerCompanyName: '中铁十一局某某公司采购项目5',
        }, {
            buyerCompanyId: 'BCID_6',
            buyerCompanyName: '中铁十一局某某公司采购项目6',
        }, {
            buyerCompanyId: 'BCID_7',
            buyerCompanyName: '中铁十一局某某公司采购项目7',
        }, {
            buyerCompanyId: 'BCID_8',
            buyerCompanyName: '中铁十一局某某公司采购项目8',
        }, {
            buyerCompanyId: 'BCID_9',
            buyerCompanyName: '中铁十一局某某公司采购项目9',
        }, {
            buyerCompanyId: 'BCID_10',
            buyerCompanyName: '中铁十一局某某公司采购项目10',
        }, {
            buyerCompanyId: 'BCID_11',
            buyerCompanyName: '中铁十一局某某公司采购项目11',
        }, {
            buyerCompanyId: 'BCID_12',
            buyerCompanyName: '中铁十一局某某公司采购项目12',
        }, {
            buyerCompanyId: 'BCID_13',
            buyerCompanyName: '中铁十一局某某公司采购项目13',
        }, {
            buyerCompanyId: 'BCID_14',
            buyerCompanyName: '中铁十一局某某公司采购项目14',
        }, {
            buyerCompanyId: 'BCID_15',
            buyerCompanyName: '中铁十一局某某公司采购项目15',
        }, {
            buyerCompanyId: 'BCID_16',
            buyerCompanyName: '中铁十一局某某公司采购项目16',
        }, {
            buyerCompanyId: 'BCID_17',
            buyerCompanyName: '中铁十一局某某公司采购项目17',
        }, {
            buyerCompanyId: 'BCID_18',
            buyerCompanyName: '中铁十一局某某公司采购项目18',
        }, {
            buyerCompanyId: 'BCID_19',
            buyerCompanyName: '中铁十一局某某公司采购项目19',
        }, {
            buyerCompanyId: 'BCID_20',
            buyerCompanyName: '中铁十一局某某公司采购项目20',
        }, {
            buyerCompanyId: 'BCID_21',
            buyerCompanyName: '中铁十一局某某公司采购项目21',
        }, {
            buyerCompanyId: 'BCID_22',
            buyerCompanyName: '中铁十一局某某公司采购项目22',
        }]
    },
    msg: "成功"
}

export default class GoodsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableState: 1,
            selectionList: [],//选中的列表
            inputValue: '',//输入框类容
        }
    }
    config = {
        size: 'default'
    }
    visible = false
    baseParams = {}
    columns= [
        {
          title: '采购商名称',
          dataIndex: 'buyerCompanyName',
          key: 'buyerCompanyId'
        }
    ]

    componentDidUpdate(){
        if(this.visible != this.props.visible) {
            this.visible = this.props.visible;
            if (!this.props.visible) return;
            // this.setState({
            //     selectionList: JSON.parse(JSON.stringify(this.props.selectionList)) || [],
            // }, () => {
            //     //确保selectionList更新完成之后再去改变tableState
            //     this.setState({
            //         tableState: 3,
            //     })
            // })
            
        }
    }
    //清除选中数据
    clearSelectionList = (num) => {
        this.setState({
            selectionList: [],
        }, () => {
            this.setState({
                tableState: num || 2,
            })
        })
    }

    //确定
    handleOk = () => {
        this.props.onOk(this.state.selectionList)
    }
    //取消
    handleCancel = () => {
        this.props.onCancel()
    }
    //勾选改变
    selectionChange = (rows) => {
        this.setState({
            selectionList: rows
        })
    }
    //输入框改变
    inputChange = (el) => {
        this.setState({
            inputValue: el.target.value
        })
    }
    //搜索
    handleSearch = () => {
    }
    //baseTable挂载完成时 和 props改变时会调用这个函数
    resetTable = (state) => {
        if (state != this.state.tableState) {
            this.setState({
                tableState: state
            });
        }
    }
    //删除选中数据
    selectItemDel = (item, index) => {
        let selectionList = this.state.selectionList;
        selectionList.splice(index, 1)

        this.setState({
            selectionList,
        }, () => {
            this.setState({
                tableState: 3,
            })
        })
    }

    render() {
        const { visible } = this.props;
        const { tableState, selectionList } = this.state;
        const { size } = this.config;

        return (
            <Modal title="选择采购商" 
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={800} >
                <div className={less.purchaser}>
                    <Row className={less.tabs}>
                        <Input placeholder="物料名称"></Input>
                        <Input placeholder="规格"></Input>
                        <Button type="primary" size={size} onClick={this.handleSearch} >搜索</Button>
                    </Row>
                    <div className="reuse_purchaser_table">
                        <BaseTable 
                            rowKey="buyerCompanyId"
                            data={tableData}
                            url='@/inquiry/gddept/getForPage'
                            haveSelection={true}
                            selectedKeys={selectionList}
                            setSelectedItems={this.selectionChange}
                            resetTable={this.resetTable}
                            tableState={tableState}
                            baseParams={this.baseParams}
                            columns={this.columns} />
                        <div className={less.selection}>
                            <div className={less.selection_title}>
                                <span>当前已选商品数 {selectionList.length}</span>
                                <span className={["reuse_link", less.clear].join(' ')} onClick={() => {this.clearSelectionList(3)}}>清空</span>
                            </div>
                            <Row gutter={20}>
                                {
                                    selectionList.map((v, index) => {
                                        return (
                                            <Col span={7} key={index}>
                                                <div className={["reuse_tag", less.select_item].join(' ')} >
                                                    {v.buyerCompanyName}
                                                    <Icon className={less.select_del} type="cross-circle"
                                                    onClick={() => {this.selectItemDel(v, index)}}></Icon>
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}