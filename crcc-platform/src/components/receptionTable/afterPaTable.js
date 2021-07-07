import { Pagination } from 'antd';
import api from '@/framework/axios';
import "./index.css";
export default class receptionTable extends React.Component {
    state = {
        getInfo: {},
        mapList: [],
        currentPage: 1,
        pageSize: 10,
        afterCurrent: 1
    }
    componentWillMount() {
        let getInfo = this.props;
        this.setState({
            getInfo,
            totalCount: getInfo.totalCount
        })
        this.getCirclesList(getInfo.ec_token,1);
    }
    componentWillUnmount() {
        this.setState({
            getInfo: {}
        })
    }
    componentWillUpdate(nextProps){

    }
    getCirclesList = ( ec_token, current ) => {
        let p_url = this.props.url;
        let _url = p_url + ec_token;
        let param = {
            pageIndex: current
        }
        api.ajax('GET',_url,{...param}).then(r => {
            let listSortNum = this.props.listName;
            let newMapList = r.data[listSortNum] ? r.data[listSortNum] : [];
            this.setState({
                mapList: newMapList,
            })
        }).catch(r => { 
            console.log(r,"after失败--")
        }) 
    }

    // pageSize 改变
    pagintionChange = (current, pageSize) => {
        this.setState({
            currentPage: 1,
            pageSize: pageSize,
            // mapList: this.state.newMapList.slice(0, pageSize)  入参无pageSize权限
        })
    }

    // 页码 改变
    onPageChange = (current, pageSize) => {
        let ec_token = this.state.getInfo.ec_token;
        this.setState({
            afterCurrent: current
        })
        this.getCirclesList(ec_token,current);
    }

    // 数据处理
    handleStr = ( str ) => {
        if(Array.isArray(str)) {
            let l_str = "";
            str.forEach(item => {
                l_str += `${item.case_role}:${item.case_company_name};`;
            })
            str = l_str;
        }else if(str == "true" || str == "false") {
            str = str == "true" ? "原告" : "被告";
        }else {
            str = str ? str : "暂无数据";
        }
        return str;
    }

    // 查看详情
    sonSeeDetails = ( arr ) => {
        this.props.seeDetails(arr);
    }
    render() {
        let { getInfo, mapList, afterCurrent } = this.state;
        let pagintionIsShow = Number(getInfo.totalCount) > 10 ?  "block" : "none";
        let _afterCurrent = (afterCurrent-1)*10 + 1;
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
                                                    <td key={infoItem.key}>{mapIndex + _afterCurrent}</td>
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
                        // showSizeChanger
                        defaultCurrent={this.state.currentPage}
                        total={this.state.totalCount}
                        // pageSizeOptions={['5', '10', '15', '20']}
                        defaultPageSize={10}
                        onShowSizeChange={this.pagintionChange}
                        onChange={this.onPageChange}    
                    />
                </div>
            </div>
        )
    }
}