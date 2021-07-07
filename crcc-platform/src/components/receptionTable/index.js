import { Pagination } from 'antd';
import api from '@/framework/axios';
import "./index.css";
export default class receptionTable extends React.Component {
    state = {
        getInfo: {},
        mapList: [],
        newMapList: [],
        totalCount: 0,
        currentPage: 1,
        pageSize: 5,
    }
    componentWillMount() {
        let getInfo = this.props;
        this.setState({
            getInfo
        })
        this.getCirclesList(getInfo.ec_token);
    }

    componentWillUnmount() {
        this.setState({
            getInfo: {}
        })
    }
    componentWillUpdate(nextProps){
        // this.setState({
        //     getInfo: nextProps
        // })
        // this.getCirclesList(nextProps.ec_token);
    }
    getCirclesList = ( ec_token ) => {
        let p_url = this.props.url;
        let _url = p_url + ec_token;
        api.ajax('GET',_url).then(r => {
            let listSortNum = this.props.listName;
            let newMapList = [];
            newMapList = r.data[listSortNum] ? r.data[listSortNum] : [];
            let totalNum = newMapList.length;
            this.setState({
                mapList: newMapList.slice(0, this.state.currentPage * this.state.pageSize),
                newMapList,
                totalCount: totalNum,
            })
        }).catch(err => {
            console.log(err,"前端请求失败----")
         }) 
    }

    // pageSize 改变
    pagintionChange = (current, pageSize) => {
        this.setState({
            currentPage: 1,
            pageSize: pageSize,
            mapList: this.state.newMapList.slice(0, pageSize)
        })
    }

    // 页码 改变
    onPageChange = (current, pageSize) => {
        this.setState({
            mapList: this.state.newMapList.slice((current-1) * this.state.pageSize, current * this.state.pageSize),
            currentPage: current
        })
    }

    // 数据处理
    handleStr = ( str ) => {
        let _str = str ? str : "暂无数据";
        return _str;
    }
    // 查看详情
    sonSeeDetails = ( arr ) => {
        console.log(arr,"arr-----")
        this.props.seeDetails(arr);
    }
    render() {
        let { getInfo, mapList, currentPage, pageSize } = this.state;
        let pagintionIsShow = mapList.length > 0 ? "block" : "none";
        let _currentPage = (currentPage-1)* pageSize  + 1;
        return(
            <div>
                {/* tableName */}
                <div className="table-top-title">
                    <span className="topItem1">{getInfo.tableName}</span>
                </div>
                {/* table */}
                <table id="ver-zebra" summary="Most Favorite Movies">
                    <thead>
                        <tr>
                            {
                               getInfo.column.map((item,index) => {
                                   return(
                                    <th scope="col" id="vzebra-comedy" style={{width: item.width}}>{item.title}</th>
                                   )
                               }) 
                            }
                        </tr>
                    </thead>
                    <tbody>
                        { mapList.length > 0 ? mapList.map((mapItem,mapIndex) => {
                            return(
                                <tr key={mapItem.id}>
                                    {
                                        getInfo.column.map((infoItem,infoIndex) => {
                                            let indexKey = infoItem.dataIndex;
                                            if(infoIndex == 0) {
                                                return(
                                                    <td key={infoItem.key}>{mapIndex + _currentPage}</td>
                                                )
                                            }else if(indexKey == "seeDetail"){
                                                return(
                                                    <td className="seeDetail2" onClick={this.sonSeeDetails.bind(this,mapItem)}>查看详情</td>
                                                )  
                                            }else{
                                                return(
                                                    <td key={infoItem.key}>{this.handleStr(mapItem[indexKey])}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr><td colSpan={getInfo.column.length} className="text_show">暂无数据</td></tr>}
                    </tbody>
                </table>
                {/* table 分页 */}
                <div style={{margin: "16px 0",float: "right",display: pagintionIsShow}}>
                    <Pagination
                        showSizeChanger
                        defaultCurrent={this.state.currentPage}
                        total={this.state.totalCount}
                        pageSizeOptions={['5', '10', '15', '20']}
                        defaultPageSize={5}
                        onShowSizeChange={this.pagintionChange}
                        onChange={this.onPageChange}    
                    />
                </div>
            </div>
        )
    }
}