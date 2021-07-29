import { Select, Card, Form, Row, Col, Input, Button, Table, Modal, DatePicker, Tabs, message, Radio, Checkbox } from 'antd';
import api from '@/framework/axios'
import Util from '@/utils/util';
const Option = Select.Option;
class SelectOrg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyList: this.props.companyList,         //搜索条件选择的公司列表
            loading:false,
            selectedOrgList:[],
            selectedOrgIndex:[],
            orgData:{
                rows:[]
            },
            selectCompanyId: '-1',       //选中的公司的uuids
            range: '',                  //公司级别
        }
    }


    /**
     * 初始化
     */
    componentWillMount() {
        console.log('componentWillMount ---------- ')
        // this.handleSearch(1,5);
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps 11111 ---------- ', nextProps)
        if(this.state.selectedOrgList != this.props.selectedOrgList){
            console.log('componentWillReceiveProps 222222---------- ', nextProps)
            if(nextProps.selectedOrgList!= undefined){
                console.log('componentWillReceiveProps 3333333---------- ', nextProps)
            }
            console.log('componentWillReceiveProps 44444444---------- ', nextProps)
            this.setState({
                selectedOrgList: nextProps.selectedOrgList,
                companyList: nextProps.companyList,
                range: nextProps.range
            })
        }
    }

    handleSearch=(page, pageSize, event)=>{
        /*let orgName = $('#name').val();
        let {selectCompanyId} = this.state;
        console.log('handleSearch --------- ', page, pageSize, orgName, selectCompanyId)
        let rows = [
            {
                uuids: '13123123',
                companyName: '公司1',
                orgName: '项目部1'
            },
            {
                uuids: '12411231',
                companyName: '公司2',
                orgName: '项目部2'
            },
            {
                uuids: '345345345',
                companyName: '公司3',
                orgName: '项目部3'
            },
            {
                uuids: '34532234234',
                companyName: '公司4',
                orgName: '项目部4'
            }
        ];

        let data = {
            total: 20,
            pageNum: 1,
            pageSize: 5,
            rows: rows
        }

        this.setState({
            orgData: data
        })*/
        console.log('handleSearch>>>>>>>>>>>>>>>>>>>>>>>>>> -------------------- ')
        let params = {};
        let orgName = $('#name').val();
        if (orgName)
            params.orgName = orgName;
        let {selectCompanyId, range} = this.state;
        if (!range || range == '')
            return;
        if (!selectCompanyId || selectCompanyId == '-1'){
            Util.alert('请先选择采购公司！', {type: 'warning'})
            return;
        }
        params.finCompanyId = selectCompanyId;
        params.page = page;
        params.rows = pageSize;
        params.type = range;
        console.log('handleSearch -=---- params ---------------- ', params)
        this.setState({
            loading:true
        })
        api.ajax(
            'GET',
            '@/platform/firsthand/dpContract/getUserOrgList',
            {...params}
        ).then(r=>{
            console.log('handleSearch -=--- then ------------- ', r)
            let data = r.data.rows;
            let {selectedOrgList} = this.state;
            //重新计算列表选中下标
            let selectedOrgIndex = this.calculateSelectedIndex(data, selectedOrgList);
            this.setState({
                orgData: r.data,
                selectedOrgIndex,
                loading:false
            })
        }).catch(r=>{
            Util.alert(r.msg, {type: 'error'});
            return ;
        })
    }

    selectCompany=(record, index)=>{
        let data = this.state.orgData;

        let obj = data.list[index];
        obj.selected = true;
        let selectedOrgList = this.state.selectedOrgList;
        let selectedOrgIndex = this.state.selectedOrgIndex;
        selectedOrgList.push(obj)
        selectedOrgIndex.push(index);
        this.setState({
            orgData:data,
            selectedOrgList,
            selectedOrgIndex
        });
    }

    /**
     * 确认邀请
     */
    selectCompanyOk=()=>{
        let selectedOrgList = this.state.selectedOrgList;
        this.props.ok(selectedOrgList);
        // this.props.form.resetFields(["name"]);
        $('#name').val('');
        this.setState({
            selectCompanyId: '-1'
        })
    }
    closeModal=()=>{
        $('#name').val('');
        this.props.close();
    }

    /**
     * 清空选中供应商
     */
    selectCompanyClear=()=>{
        let data = this.state.orgData;
        for(let i = 0;i<data.rows.length;i++){
            let obj = data.rows[i];
            obj.selected = false;
        }
        this.setState({
            orgData:data,
            selectedOrgList:[],
            selectedOrgIndex:[]
        });
    }

    /**
     * 移除选中供应商
     * @param item
     */
    removeSelectedCompany=(item)=>{
        let selectedOrgList = this.state.selectedOrgList;

        selectedOrgList = selectedOrgList.filter(key => key !== item);
        let data = this.state.orgData.rows;
        //重新计算列表选中下标
        let selectedOrgIndex = this.calculateSelectedIndex(data, selectedOrgList)
        this.setState({selectedOrgList, selectedOrgIndex});
    }

    /**
     * 重新计算列表选中下标
     * @param data 列表数据
     * @param selectedOrgList 已选择数据
     * @returns {Array}
     */
    calculateSelectedIndex = (data, selectedOrgList)=>{
        let selectedOrgIndex = [];
        for(let i=0;i<data.length;i++){
            for(let j=0;j<selectedOrgList.length;j++){
                if(data[i].uuids == selectedOrgList[j].uuids){
                    selectedOrgIndex.push(i);
                }
            }
        }
        return selectedOrgIndex;
    }

    tableRowSelect=(selectedRowKeys, selectedRows)=>{
        let selectedOrgList = this.state.selectedOrgList.concat(selectedRows);
        let selectedOrgIndex = this.state.selectedOrgIndex;
        let orgData = this.state.orgData.rows;



        var result = [];
        var obj = {};
        //去重
        for(var i =0; i<selectedOrgList.length; i++){
            if(!obj[selectedOrgList[i].uuids]){
                result.push(selectedOrgList[i]);
                obj[selectedOrgList[i].uuids] = true;
            }
        }
        selectedOrgList = result;
        if(selectedRowKeys.length <= selectedOrgIndex.length){
            let selectedRowKeysSet = new Set(selectedRowKeys);
            let selectedCompanyIndexSet = new Set(selectedOrgIndex);
            let cb = new Set([...selectedCompanyIndexSet].filter(x => !selectedRowKeysSet.has(x)));
            cb.forEach((value, key) => {
                //移除取消掉的供应商
                selectedOrgList.splice(selectedOrgList.findIndex(item => item.uuids === orgData[value].uuids), 1)
                //selectedOrgList = selectedOrgList.filter(key => key !== orgData[value]);
            })
        }
        this.setState({
            selectedOrgIndex:selectedRowKeys,
            selectedOrgList:selectedOrgList
        })
    }


    selectCompanyColumns = [{
        title: '采购公司',
        dataIndex: 'companyName',
        key: 'companyName',
        width:452,
    }, {
        title: '项目部',
        dataIndex: 'organizationName',
        key: 'organizationName',
        width:359
    }];

    onShowSizeChange = (page, pageSize) => {
        this.handleSearch(page, 5);
    };
    onChange = (page, pageSize) => {
        this.setState({
            selectedOrgIndex:[]
        },()=>{
            this.handleSearch(page, 5);
        });
    };

    //采购哦公司选择
    companyChange=(v)=>{
        this.setState({
            selectCompanyId: v
        })
    }

    showSelectCompanyColumns = [{
        title: '采购公司',
        dataIndex: 'companyName',
        key: 'companyName',
        width:300,
    }, {
        title: '项目部',
        dataIndex: 'organizationName',
        key: 'organizationName',
    }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width:80,
        render: (text, record)=>{
            return (
                <a onClick={this.removeSelectedCompany.bind(this, record)}>删除</a>
            )
        }
    }];

    render() {
        let {companyList, selectCompanyId, selectedOrgList} = this.state;
        console.log('selectedOrgList ---------- ', selectedOrgList)
        const rowSelection = {
            selectedRowKeys: this.state.selectedOrgIndex,
            onChange:this.tableRowSelect
        };
        const pagination = ComponentDefine.getPagination_(this.state.orgData, this.onChange,this.onShowSizeChange);
        pagination.defaultPageSize= 5;
        pagination.showSizeChanger = false;
        return (
            <div className="add_inquiry">
                <Modal
                    title="选择合同适用项目部"
                    wrapClassName="select_company_list"
                    visible={this.props.visible}
                    width={900}
                    onCancel={this.closeModal}
                    okText="确认"
                    onOk={this.selectCompanyOk}
                >
                    <div className="search_tabs_input">
                        <Row span={24}>
                            <Col span={12}>
                                采购公司名：
                                <Select
                                    style={{width: 260}}
                                    value={selectCompanyId}
                                    onChange={this.companyChange}
                                >
                                    <Option value={'-1'} >请选择</Option>
                                    {
                                        companyList.map((item, index)=>{
                                            return(
                                                <Option value={item.companyId} >{item.companyName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={2}>项目部名：</Col>
                            <Col span={10}>
                                <Input placeholder="请输入项目部名称" id={'name'}/>
                            </Col>
                        </Row>
                        <Row>
                            <div className="ant-input-group-wrap">
                                <Button style={{float: 'right', marginTop: '10px', marginBottom: '10px'}} type="primary" onClick={this.handleSearch.bind(this, 1, 5)}>搜索</Button>
                            </div>
                        </Row>
                    </div>
                    <Table rowKey="select_company_list_table"
                           {...ComponentDefine.table_}
                           loading={this.state.loading}
                           rowSelection={rowSelection}
                           pagination={pagination}
                           dataSource={this.state.orgData.rows}
                           columns={this.selectCompanyColumns}/>
                    <Card className="select-company-card">
                        <Row gutter={10}>
                            <Col span={4}>
                                <span className="select-company-span">当前已选供应商</span>
                            </Col>
                            <Col span={2}>
                                ({selectedOrgList.length}家)
                            </Col>
                            <Col>
                                <a onClick={this.selectCompanyClear}>清空</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table rowKey="select_company_list_table"
                                       {...ComponentDefine.table_}
                                       rowSelection={false}
                                       pagination={false}
                                       dataSource={selectedOrgList}
                                       columns={this.showSelectCompanyColumns}/>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(SelectOrg)