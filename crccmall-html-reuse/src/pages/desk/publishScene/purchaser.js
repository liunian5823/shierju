import React from 'react';
import BaseTable from '@/components/baseTable';
import { Modal, Tabs, Input, Button, Row, Col, Icon } from 'antd';
const TabPane = Tabs.TabPane;
import less from './purchaser.less';
import Util from '../../../utils/util';


export default class Purchaser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableState: 1,
            selectionList: [],//选中的列表
        };
        this.baseParams = {
            ...this.baseParams,
            saleTarget: props.saleTarget
        }
    }
    componentWillReceiveProps(nextProps) {
        this.baseParams = {
            ...this.baseParams,
            saleTarget: nextProps.saleTarget
        }
        this.handleSearch()
    }
    config = {
        size: 'default'
    }
    visible = false
    baseParams = {
        flag: null,
        name: null,
        saleTarget: null
    }
    columns= [
        {
          title: '采购商名称',
          dataIndex: 'name',
          key: 'name'
        }
    ]

    componentDidUpdate(){
        if(this.visible != this.props.visible) {
            this.visible = this.props.visible;
            if (!this.props.visible) return
            if(this.props.visible) {
                this.handleSearch()
            }
            this.setState({
                selectionList: this.props.selectionList ? [...this.props.selectionList] : [],
            }, () => {
                //确保selectionList更新完成之后再去改变tableState
                this.setState({
                    tableState: 3,
                })
            })

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
        if(!this.state.selectionList) return;
        if(this.state.selectionList.length > 20) {
            Util.alert('当前选中采购商已超过 20 家！')
            return;
        }
        this.props.onOk(this.state.selectionList)
    }
    //取消
    handleCancel = () => {
        this.props.onCancel()
    }
    //勾选改变
    selectionChange = ({keys, rows}) => {
        this.setState({
            selectionList: rows,
        })
    }
    //tab切换
    tabChange = (prop) => {
        this.baseParams.flag = prop == 0 ? null : prop;
        this.setState({
            tableState: 1,
        })
    }
    //输入框改变
    inputChange = (el) => {
        this.baseParams.name = el.target.value;
    }
    //搜索
    handleSearch = () => {
        this.setState({
            tableState: 1,
        })
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
        const { flag } = this.baseParams;
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
                        <Col span={12} className="reuse_resetTabs">
                            <Tabs defaultActiveKey={flag} size={size} onChange={this.tabChange}>
                                <TabPane tab="所有采购商" key="0"></TabPane>
                                <TabPane tab="本局成员单位" key="1"></TabPane>
                            </Tabs>
                        </Col>
                        <Col span={12}>
                            <Col span={18}>
                                <Input defaultValue={this.baseParams.name}
                                    onChange={this.inputChange}
                                    size={size}
                                    placeholder="请输入采购商名称" ></Input>
                            </Col>
                            <Col span={6} className={less.searchBtn}>
                                <Button type="primary" size={size}
                                    onClick={this.handleSearch} >搜索</Button>
                            </Col>
                        </Col>
                    </Row>
                    <div className="reuse_purchaser_table">
                        <BaseTable
                            rowKey="id"
                            url='@/reuse/company/queryPurchaserPage'
                            haveSelection={true}
                            selectedList={selectionList}
                            setSelectedItems={this.selectionChange}
                            resetTable={this.resetTable}
                            tableState={tableState}
                            baseParams={this.baseParams}
                            columns={this.columns} />
                        <div className={less.selection}>
                            <div className={less.selection_title}>
                                <span>当前已选 {selectionList.length} 家采购商</span>
                                <span className={["reuse_link", less.clear].join(' ')}
                                    onClick={() => {this.clearSelectionList(3)}}>清空</span>
                            </div>
                            <div className={less.selection_box}>
                                <Row gutter={20}>
                                    {
                                        selectionList.map((v, index) => {
                                            return (
                                                <Col span={8} key={index}>
                                                    <div className={["reuse_tag", less.select_item].join(' ')} >
                                                        <div className={less.select_name}
                                                            title={v.name}>{v.name}</div>
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
                </div>
            </Modal>
        )
    }
}
