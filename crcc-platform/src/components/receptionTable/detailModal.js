import "./index.css";
import Close from  "./img/close.png";
export default class receptionTable extends React.Component {
    state = {
        modalInfo: {},
        modalIsShow: false
    }
    componentWillMount() {
        let modalInfo = this.props;
        this.setState({
            modalInfo
        })
    }
    
    componentWillUpdate(nextProps){
        if(this.state.modalIsShow != nextProps.modalIsShow) {
            this.setState({
                modalIsShow: nextProps.modalIsShow,
                jioaxuejian: nextProps.tableObj
            }) 
        }
    }
    // 数据处理
    handleStr = ( str ) => {
        let _str = str && str !='null' && str !=null ? str : "暂无数据";
        return _str;
    }
    // 关闭modaltableObj
    closeModal = () => {
        this.props.closeModal();
    }
    render() {
        let { modalInfo, modalIsShow, jioaxuejian } = this.state;
        let _modalIsShow = modalIsShow == true ? "block" : "none";
        let tableObj = jioaxuejian ? jioaxuejian : {};
        return(
            <div className="modals" style={{display: _modalIsShow}}>
                <div className="modal-item modal-item1">
                    <div className="modal-item-top" style={{color: "#6D6D6D"}}>
                        <span>{modalInfo.tableName}</span>
                        <img src={Close} alt="" className="close_img" onClick={this.closeModal} />
                    </div>
                    <div className="modal-item-con">
                        <div className="_midBoms cesjio" style={{border: "none"}}>
                            <div className="typical-table modal_table">
                                <table>
                                    <tbody>
                                    { modalInfo.column.length > 0 ? modalInfo.column.map((mapItem,mapIndex) => {
                                        return(
                                            <tr key={mapIndex}>
                                                {
                                                    mapItem.map(infoItem => {
                                                        let indexKey = infoItem.dataIndex;
                                                        return Object.keys(infoItem).map((graSonItem,graSonIndex) => {
                                                            if(graSonIndex == 0) {
                                                                return(
                                                                    <td>{infoItem[graSonItem]}</td>
                                                                )
                                                            }else {
                                                                // 此处可用 tableObj[indexKey] 或者 tableObj[infoItem[graSonItem]]
                                                                return(
                                                                    <td>{this.handleStr(tableObj[indexKey])}</td>
                                                                )
                                                            }
                                                        })
                                                    })
                                                }
                                            </tr>
                                        )
                                    }) : <h3>暂无数据</h3>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="modal-item-bot" onClick={this.closeModal} style={{background: "#FF1616"}}>确定</div>
                </div>
            </div>
        )
    }
}