import { Card,Button, Table,Modal} from 'antd';
import Util from "@/utils/util";
import CooperatorModal from './cooperatorModal'
import UpArrow from './upArrow.png'
import DownArrow from './downArrow.png'
import less from "./index.less";
const confirm = Modal.confirm;
const defaultPageSize = 5;
class cooperatorsListAddition extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            purchaserModalVisible:false,
            loading:false,
            data:[],
            purchaserData:{
                list:[]
            },
            purchaserLoading: false,
        };
    };

    // 初始化
    componentWillMount() {
        this.getCooperatorsList();
    }
    // 获取合作单位清单数据
    getCooperatorsList= ()=>{
        this.setState( {
            loading:true,
        })
        axios.get('!!/purchaser/attachment/getCooperators',{
            params:{type:3}
        }).then((response)=> {
            this.setState({
                data:response.data,
                loading:false,
                purchaserModalVisible:false,
            })
        })
    }

    // 排序方法
    sortPurchase (sortKey,sort,sortType) {
        if(sort == 1  &&  sortType == 'upArrow'){
            Util.alert('已是第一位',{ type: 'error' });
            return;
        }else if(sort  == this.state.data.length &&  sortType == 'downArrow'){
            Util.alert('已是最后一位',{ type: 'error' });
            return;
        }
        let that = this;
        axios.get('!!/purchaser/attachment/sortCooperators', {
            params:{
                sortType:sortType,
                sortKey:sortKey,
                sort:sort,
            }
        }).then((r, err) =>{
            if(r.data){
                Util.alert('排序成功',{ type: 'success' })
                this.getCooperatorsList();
            }else{
                Util.alert('排序失败',{ type: 'error' })
            }
        })
    }
    // 删除方法
    delPurchase (uuids,sort) {
        let _this = this;
        confirm({
            title: '是否确认删除该合作单位？',
            onOk() {
                _this.delSubmit(uuids,sort)
            },
            onCancel() {
                Util.alert('已取消操作')
            }
        })
    }
   delSubmit(uuids,sort){
        axios.get('!!/purchaser/attachment/delCooperator', {
            params: {
                uuids: uuids,
                sort: sort,
                type:3,
            }
        }).then((r, err) => {
            if (r.data) {
                Util.alert('删除成功',{ type: 'success' })
                this.getCooperatorsList();
            } else {
                Util.alert('删除失败',{ type: 'error' })
            }
        })
    }
    // 会话框开关
    modalToggle = ()=>{
        if(!this.state.purchaserModalVisible){
            this.setState({
                purchaserModalVisible:true,
            })
            this.searchData();
        } else {
            this.setState({
                purchaserModalVisible:false,
            })
        }
    }
    // 新增会话框,数据查询方法
    searchData=(page,companyName)=>{
        let _page = page == undefined ? 1 :page;
        this.setState({
            purchaserLoading:true,
        })
        axios.get('!!/purchaser/attachment/getCooperatorsForPage', {
            params:{
                companyName:companyName,
                pageSize:defaultPageSize,
                page:_page,
                type:3,
            }
        }).then((response)=>{
            if(response.data.total === 0) {
                Util.alert('不存在符合条件的合作单位',{ type: 'warning' })
            }
            this.setState({
                purchaserData:response.data,
                purchaserLoading:false
            })

        })
    }
    //  合作单位清单表列
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
            return(<p style={{width:"100px"}}><span>{index +1}</span></p>)
        }
    },{
        title: '合作单位',
        dataIndex: 'companyName',
        key:'companyName',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"300px"}}><span title={text}>{text}</span></p>)
        }
    },{
        title: '操作人',
        dataIndex: 'userName',
        key:'userName',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"180px"}}><span title={text}>{text}</span></p>)
        }
    },{
        title: '添加时间',
        dataIndex: 'createTime',
        key:'createTime',
        render: (text, record, index) => {
            return(<p className={[less.nowrapEllipsis]} style={{width:"180px"}}><span title={text}>{text}</span></p>)
        }
    },{
        title: '操作',
        key: 'operation',
        render: (text, record) => {
            return (
                (<p style={{width:"150px"}}>
                            <span>
                                <a href="javascript:void(0);" onClick={this.sortPurchase.bind(this,record.sortKey,record.sort,'upArrow')}><img  src={UpArrow} /></a>
                                <span className={[less.margin8]}></span>
                                <a href="javascript:void(0);" onClick={this.sortPurchase.bind(this,record.sortKey,record.sort,'downArrow')}><img src={DownArrow} /></a>
                                <span className={[less.margin4]}></span>
                                <span className="ant-divider"></span>
                                <span className={[less.margin4]}></span>
                                <a href="javascript:void(0);" onClick={this.delPurchase.bind(this,record.uuids,record.sort)}>删除</a>
                            </span>
                </p>)

            )
        }
    }
    ];
    render() {
        return (
            <div  className={"CooperatorsListTable"}>

                <Card
                    title={"各局合作清单"}
                    extra={
                        <Button type="primary" onClick={this.modalToggle}>新增</Button>
                    }
                    bordered={false}
                >
                    <Table
                        rowKey="sortKey"
                        bordered={false}
                        columns={this.columns}
                        loading={this.state.loading}
                        dataSource={this.state.data}
                        pagination={false}
                    />
                </Card>

                <CooperatorModal
                    purchaserLoading={this.state.purchaserLoading}
                    purchaserData={this.state.purchaserData}
                    purchaserModalVisible={this.state.purchaserModalVisible}
                    closeModal={this.modalToggle}
                    refreshPurchaseList={this.getCooperatorsList}
                    searchData ={this.searchData}
                    sort ={this.state.data.length}
                />
            </div>
        );
    }
}
export default cooperatorsListAddition
