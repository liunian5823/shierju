import {Button, Card, Modal} from 'antd'
import less from './detail.less'

export default class DetailsView extends  React.Component {
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
                <div className="mainDivStyle">
                    <Card>
                        <div className={less.framl}>
                            <h2>{this.props.formData.title}</h2>
                            <div className={less.newsTime}>发布时间：</div>
                            <div className={less.content} dangerouslySetInnerHTML={{__html:this.props.formData.content}} ></div>
                        </div>
                    </Card>
                </div>
            </Modal>
        )
    }
}
