/**
 * 查询列表搜索条件更多
 * Created by zhouby on 2018/8/30/030.
 */
import {Select,Card,Form,Row,Col,Input,Button,Icon,Table,Divider,Menu,Dropdown,Modal,Radio,Checkbox} from 'antd';
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //false 收起,true展开
            status:false
        }
    }
    packUp=()=>{
        this.setState({
            status:!this.state.status
        })
    }
    render() {
        return (
            <div>
                <Row gutter={42}>
                    {
                        this.props.children[0].props.children.map((item,index)=>{
                            // if(!this.state.status&&index>1){
                            //     return;
                            // }
                            return (
                                <Col key={index} span={10} style={{display:!this.state.status&&index>1?"none":"block"}}>
                                    {React.cloneElement(item)}
                                </Col>
                            )
                        })
                    }
                    {
                        this.props.children[1]
                    }
                </Row>
                {
                    this.props.children[0].props.children.length>2?<div className="advanced_search" onClick={this.packUp}>
                        <span>高级搜索</span>
                        {
                            this.state.status?
                            <img style={{width: '12px', marginLeft: '5px'}} src="../../static/img/shangyixiang1.png" />
                            : <img style={{width: '12px', marginLeft: '5px'}} src="../../static/img/shangyixiang2.png" />
                        }
                    </div>:null
                }
            </div>
        )
    }
}
class SearchBarParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            React.cloneElement(this.props.children)
        )
    }
}
class SearchBarBtns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Col className="btns" span={24}>
                {
                    this.props.children
                }
            </Col>
        )
    }
}
SearchBar.Param=SearchBarParam;
SearchBar.Btns=SearchBarBtns;
export default SearchBar;