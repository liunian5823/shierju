import less from './scrollView.less';
import { Icon } from 'antd';

export default class ScrollView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navOffset: 0
        }
    }

    scrollPrev = () => {
        const { scrollEle, listEle } = this;
        let navOffset = this.state.navOffset;

        if (scrollEle && listEle && scrollEle.offsetWidth < listEle.offsetWidth) {
            let move = navOffset - scrollEle.offsetWidth;
            move = move < 0 ? 0 : move;

            this.setState({
                navOffset: move
            })
        } else {
            this.setState({
                navOffset: 0
            })
        }
    }

    scrollNext = () => {
        const { scrollEle, listEle } = this;
        let navOffset = this.state.navOffset;

        if (scrollEle && listEle && scrollEle.offsetWidth < listEle.offsetWidth) {
            let max = listEle.offsetWidth - scrollEle.offsetWidth;
            let move = navOffset + scrollEle.offsetWidth;
            move = move < max ? move : max;

            this.setState({
                navOffset: move
            })
        } else {
            this.setState({
                navOffset: 0
            })
        }
    }

    upPosition = () => {
        const { scrollEle, listEle } = this;
        let navOffset = this.state.navOffset;
        
        if(scrollEle && listEle){
            if(scrollEle.offsetWidth < listEle.offsetWidth){
                let move = listEle.offsetWidth - scrollEle.offsetWidth;
                if(move < navOffset) {
                    navOffset = move;
                }
                
            } else {
                navOffset = 0;
            }

            this.setState({
                navOffset: navOffset
            })
        }
    }

    componentDidUpdate(prevProps,prevState) {
        let prevLen = prevProps.children.length;
        let curLen = this.props.children.length;
        if(curLen && prevLen) {
            if(curLen < prevLen) {
                this.upPosition()
            } else if(curLen > prevLen ) {
                this.setState({
                    navOffset: 0
                })
            }
        }
    }

    render() {
        const { children } = this.props;
        const { scrollPrev, scrollNext } = this;
        let navOffset = this.state.navOffset;

        if (children && children.length) {
            return (
                <div className={ less.scrollView }>
                    <div className={[less.scrollView_btn, less.scrollView_leftbtn].join(' ')} onClick={scrollPrev}> 
                        <Icon type="circle-o-left"></Icon> 
                    </div>
                    <div className={less.scrollView_wrap} ref={el => { this.scrollEle = el }}>
                        <div
                            className={less.scrollView_list}
                            ref={el => { this.listEle = el }}
                            style={{ transform: `translateX(${-navOffset}px)` }}>{children} </div>
                    </div>
                    <div className={[less.scrollView_btn, less.scrollView_rightbtn].join(' ')} onClick={scrollNext}> 
                        <Icon type="circle-o-right"></Icon> 
                    </div>
                    <div className={less.line}></div>
                </div>
            )
        } else {
            return null
        }
    }
}
