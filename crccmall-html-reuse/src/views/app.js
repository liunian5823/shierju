import { HashRouter as Router, Route, Switch } from "react-router-dom"

import Login from '@/pages/login'

import Admin from './admin'
import { RouteList } from "../components/Route"
import { receiveUser } from '../redux/gaoda/auth/AuthAction'
import { connect } from 'react-redux'
import { routes, deskRoutes } from "./routes"
import DeskShell from '@/pages/desk/components/deskShell'
import api from '@/framework/axios'//请求接口的封装

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initUser: false,
        }
    }

    componentWillMount () {
        // this.getUserInfo();
        this.gaodaInit()
    }

    /**
     * 获得用户基础数据
     */
    gaodaInit = () => {
        let that = this
        axios.get('@/common/user/getUser', {
        }).then(function (res) {
            if (res.data) {
                that.props.dispatch(receiveUser({ ...res.data }))
            }
        }).catch(function (r) {
        }).then(() => {
            this.setState({
                initUser: true
            })
        })
    }
    /**
     * 获得用户基础数据
     */
    getUserInfo = () => {
        api.ajax("POST", "@/sso/loginControl/getUserBaseInfo", {
        }).then(r => {
            if (!this._isMounted) { return }
            this._userInfo = JSON.parse(r.data)
            PubSub.publish('PubSub_SendUser', JSON.parse(r.data))
            window.gaodauuids = JSON.parse(r.data).companyCompanyUuids
            this.setState({
                userInfo: JSON.parse(r.data)
            })
        }).catch(r => {
        })
    }
    render () {
        let { initUser } = this.state
        // if (!initUser) return (<div></div>)  // lly调试
        return (
            <Router>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/desk" render={() => {
                        return (
                            <DeskShell>
                                <RouteList routes={deskRoutes} showContent={this.props.showContent} />
                            </DeskShell>
                        )
                    }}></Route>

                    {/* 为了/加载到 */}
                    <Route path="/" render={() => {
                        return (
                            <Admin>
                                <RouteList routes={routes} showContent={this.props.showContent} />
                            </Admin>
                        )
                    }}></Route>
                </Switch>
            </Router>
        )
    }
}
const mapStateToProps = state => {
    return {
        showContent: state.contentReducer.showContent
    }
}
export default connect(mapStateToProps)(App)
