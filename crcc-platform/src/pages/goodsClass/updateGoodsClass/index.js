import {Button, Card, Col, Row} from "antd";
import Util from "@/utils/util";
import api from '@/framework/axios';//请求接口的封装
import Fenlei1 from "./fenlei1";
import Fenlei2 from "./fenlei2";
import less from "./fenlei1.less";
import React from "react";
export default class Index  extends React.Component {
    _isMounted = false; //该组件是否被挂载，用于取消ajax请求的执行
    _oldGoodsClass = null;
    _newGoodsClass = null;
    _userInfo = null
    constructor(props) {
        super(props);
        this.state = {
            goodsClass3:null,
            loading: false,     //保存按钮状态
        };
    }

    componentWillMount() {
        this._isMounted = true;
        this.pubsub_userInfo = PubSub.subscribe('PubSub_SendUser', function (topic, obj) {
            if (this._userInfo || !obj) { return false }
            this._userInfo = obj;
        }.bind(this));//
        PubSub.publish('PubSub_GetUser', {});   //主动获取用户信息数据
    }

    componentWillUnmount() {
        this._isMounted = false;
        PubSub.unsubscribe(this.pubsub_userInfo);
    }



    //获取分类对象
    handleGetGoodsClassOld = (value) =>{
        this._oldGoodsClass = value;
    }

    //获取分类对象
    handleGetGoodsClassNew = (value) =>{
        this._newGoodsClass = value;
    }


    submitData = () =>{
        //分类信息：
        let _oldGoodsClass = this._oldGoodsClass;
        let _newGoodsClass = this._newGoodsClass;

        if( !this.checkEmpty( _newGoodsClass )){
            Util.alert('请选择新商品分类', {type: 'error'});
            return;
        }
        if( !this.checkEmpty(_oldGoodsClass)){
            Util.alert('请选择旧商品分类', {type: 'error'});
            return;
        }

        let params = this.getLastGoodsClass( _newGoodsClass );
        let params1 = this.getLastGoodsClass( _oldGoodsClass );
        params.goodsClassOld = params1.goodsClass;
        params.goodsClassNameOld = params1.goodsClassName;

        //设置提交状态
        this.setState({
            loading: true
        })
        //提交数据
        api.ajax('POST', '@/platform/ecEditGoodsClass/saveEditGoodsClass',
            {...params}
        ).then(
            r=>{
                Util.alert("保存成功",{ type: 'success' });
                this.setState({
                    loading: false
                })
            }
        ).catch(
            r=>{
                Util.alert("保存失败"+ r.msg,{ type: 'error' });
                this.setState({
                    loading: false
                })
            }
        )
    }

    //校验是否为空
    checkEmpty = (obj) => {
        if(obj == null) return false;
        if(obj.goodsClass1 == null) return false;
        return true;
    }

    //获取选择的最底层分类信息
    getLastGoodsClass = (obj) => {
        let params = {};
        if ( obj.goodsClass2 == null ) {
            params.goodsClass = obj.goodsClass1;
            params.goodsClassName = obj.goodsClassName1;
        };
        if ( obj.goodsClass3 == null ) {
            params.goodsClass = obj.goodsClass2;
            params.goodsClassName = obj.goodsClassName2;
        };
        if ( obj.goodsClass3 != null  ) {
            params.goodsClass = obj.goodsClass3;
            params.goodsClassName = obj.goodsClassName3;
        }
        return params;
    }


    render(){
        return (
            <div>
                <Card bordered={false} >
                    {/*新分类*/}
                    <Fenlei1 handleGetGoodsClassNew={this.handleGetGoodsClassNew}/>
                    {/*旧分类*/}
                    <Fenlei2 handleGetGoodsClassOld={this.handleGetGoodsClassOld}/>
                </Card>
                <Card bordered={false} style={{"margin-top":"20px"}}>
                    <Row>
                        <Col span="8" >
                            <Button type="primary" loading={this.state.loading} onClick={this.submitData.bind()}>保存</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}