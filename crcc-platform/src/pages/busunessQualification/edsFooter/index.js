import less from './index.less';
export default class EdsFooter extends React.Component {
    render() {
        return(
            <div className={[less.footer, "container_wrapper"].join(' ')}>
                Copyright©2016-2018中铁建金服科技（天津）有限公司 版权所有 | 服务热线：400-607-2808
                <br />
                京ICP备 14043188号-3 | 京公网安备 11010736057-18001
                <br />
                主办单位：中国铁建股份有限公司 | 公司地址：北京市海淀区复兴路40号铁建大厦
            </div>
        )
    }
}