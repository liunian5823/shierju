import React from 'react';
import DeskHeader from '../deskHeader'
import DeskFooter from '../deskFooter'
import ScrollTop from '../ScrollTop'
import less from './index.less'

export default class DeskShell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollTop: 0,
        }
    }
    config = {
        scrollTopHeight: 400,//回到顶部出现的高度
    }

    setScrollTop = (...props) => {
        this.refs.RefScrollTop.toTop(...props)
    }

    render() {
        const { children } = this.props;
        const { scrollTopHeight } = this.config;

        return (
            <div id="app_scrollbox" className={less.main}>
                <DeskHeader></DeskHeader>
                <div id="app_scrollposition" className={less.main_content}>
                    {React.cloneElement(children, { toScrollTop: this.setScrollTop })}
                </div>
                {/*<DeskFooter></DeskFooter>*/}
                <ScrollTop ref="RefScrollTop" visibilityHeight={scrollTopHeight}></ScrollTop>
            </div>
        )
    }
}
