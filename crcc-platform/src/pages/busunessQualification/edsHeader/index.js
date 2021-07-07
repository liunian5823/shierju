import { Button } from 'antd';
import { systemConfigPath } from "@/utils/config/systemConfig";
import less from './index.less';
import logo from '../img/logo@2x.png';
export default class EdsHeader extends React.Component {
    toHome = () => {
        window.open(systemConfigPath.jumpShopPage("/"));
    }
    render() {
        return(
            <div className={less.top}>
                <div className={[less.container_wrapper, less.clearfix].join(' ')}>
                <a href="/" className={[less.fl, less.logo].join(" ")}>
                    <img src={logo} />
                </a>
                <div className={[less.fl, less.title].join(" ")}>
                    企业资质信息
                </div>
                <div className={[less.fr, less.btn_wrapper].join(" ")}>
                    <Button onClick={this.toHome}>商城首页</Button>
                </div>
                </div>
            </div>
        )
    }
}