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
                <Row gutter="42">
                    {
                        this.props.children[0].props.children.map((item,index)=>{
                            // if(!this.state.status&&index>1){
                            //     return;
                            // }
                            return (
                                <Col span={10} style={{display:!this.state.status&&index>1?"none":"block"}}>
                                    {React.cloneElement(item)}
                                </Col>
                            )
                        })
                    }
                    {
                        this.props.children[1]
                    }
                </Row>
                <div className="advanced_search" onClick={this.packUp}>
                    <span>高级搜索</span>
                    {
                        this.state.status?<i className="iconfont icon-gaojisousuo-copy"></i>:<i className="iconfont icon-gaojisousuo"></i>
                    }
                </div>
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
            this.props.children
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
            <Col className="btns" span={4} style={{
                paddingRight:21
            }}>
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