
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import less from './index.less';
import './reset.css';

export default class BaseTabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let {
            tabsList,
            tabChange = () => { },
            defaultKey,
            children
        } = this.props;
        if (tabsList && tabsList.length) {
            defaultKey = defaultKey ? defaultKey : tabsList[0].id;
            return (
                <div className={['baseTabs', less.tabs].join(' ')}>
                    {<Tabs defaultActiveKey={defaultKey} activeKey={defaultKey} onChange={tabChange}>
                        {
                            tabsList.map(pane => {
                                return (
                                    <TabPane tab={pane.value} key={pane.id}>
                                        {pane.render ? pane.render : null}
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>}
                    <div className={["reuse_baseButtonGroup", less.options].join(' ')}>
                        {children}
                    </div>
                </div>
            )
        } else if (children) {
            return (
                <div className={['baseTabs', less.fixation].join(' ')}>
                    <div className={["reuse_baseButtonGroup", less.options].join(' ')}>
                        {children}
                    </div>
                </div>
            )
        } else {
            return null;
        }

    }
}
