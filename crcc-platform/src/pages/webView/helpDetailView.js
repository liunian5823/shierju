import {Button, Card, Modal, Breadcrumb} from 'antd'
import less from './helpDetailView.less'

export default class helpDetailsView extends  React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
    }

    componentDidMount(){
    }

    closeDetailsModal=()=>{
        this.props.closeDetailsModal();
    }

    render() {
        return (
            <Modal visible={this.props.visible} width="95%"
               onCancel={this.closeDetailsModal}
               footer = {[
                   <Button onClick={this.closeDetailsModal}>关闭</Button>
               ]}
            >
                <div>
                    <div className={less.helpconter}>
                        <div className={less.helpleft}>
                            <span className={less.lefttitle} >帮助中心</span>
                        </div>
                        <div className={less.helpright} >
                            <div>
                                <div className={less.centerconter}>
                                    <h2 className={less.titlebiaoti}>{this.props.formData.title}</h2>
                                    <p className={less.timeshijian}>更新时间：</p>
                                    <div className={less.neirongconter} dangerouslySetInnerHTML={{__html:this.props.formData.content}}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={less.clear}></div>
                    </div>
                </div>
            </Modal>
        )
    }
}
