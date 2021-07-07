import {Card,Form,Input,Checkbox,Row,Col,InputNumber,Modal,Affix,Tooltip,Menu, Icon} from 'antd';
import api from '@/framework/axios';//请求接口的封装
import Util from '@/utils/util';
import  './footer.css';
import s1 from './img/s1.png';
import s2 from './img/s2.png';
import s3 from './img/s3.png';
import s4 from './img/s4.png';
import ewm from './img/ewm.jpg';
import {configs,systemConfigPath} from '@/utils/config/systemConfig';
export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartData: []
        }
    }
    /**
     * 初始化
     */
    componentWillMount(){
    };

    render() {
        return (<div style={{background:"rgba(255,255,255,1)"}}>
                <div className="dibu qingchu">

                    <div className="db-2">
                        <div className="db-1">
                            <a href="javascript:void(0);"><img src={s1}/>官方授权</a>
                            <a href="javascript:void(0);"><img src={s2}/>免费试用</a>
                            <a href="javascript:void(0);"><img src={s3}/>资源共享</a>
                            <a href="javascript:void(0);"><img src={s4}/>企业内购</a>
                        </div>
                        <dl>

                            <dt>购物指南</dt>
                            <dd>
                                <a href="/cms/news/detail?id=14" target="_blank">购物流程</a>
                                <a href="/cms/news/detail?id=17" target="_blank">常见问题</a>
                                <a href="/cms/news/detail?id=86" target="_blank">供应商上传商品须知</a>
                            </dd>
                        </dl>
                        <dl>
                            <dt>入驻须知</dt>
                            <dd>
                                <a href="/cms/news/detail?id=88" target="_blank">合作方式</a>
                                <a href="/cms/news/detail?id=90" target="_blank">入驻标准</a>
                                <a href="/cms/index/settled" target="_blank">入驻流程</a>
                            </dd>
                        </dl>
                        <dl>

                            <dt>物流配送</dt>
                            <dd>
                                <a href="/cms/news/detail?id=78" target="_blank">配送方式</a>
                                <a href="/cms/news/detail?id=80" target="_blank">物流运费</a>
                                <a href="/cms/news/detail?id=82" target="_blank">物流查询</a>
                                <a href="/cms/news/detail?id=84" target="_blank">签收规范</a>
                            </dd>
                        </dl>
                        <dl>

                            <dt>客户服务</dt>
                            <dd>
                                <a href="/cms/news/detail?id=50" target="_blank">客服电话</a>
                                <a href="/cms/news/detail?id=92" target="_blank">铁建商城纠纷处理</a>
                                <a href="/cms/news/detail?id=98" target="_blank">供应商提现流程</a>
                            </dd>
                        </dl>
                        <dl className="ewm">
                            <dd>
                                <a style={{height:"150px"}}><img src={ewm}/></a>
                            </dd>
                            <dt>关注铁建，获得更多信息！</dt>
                        </dl>
                    </div>
                    <div className="db-4">Copyright©铁建商城 京ICP备14043188号-3 | 京公网安备11010736057-18001 | 服务热线 :400-607-2808 <br/>
                        主办单位:中国铁建股份有限公司 地址:北京市海淀区复兴路40号中国铁建大厦</div>
                </div>
            </div>
        )
    }
}