import React from 'react';
import { Icon } from 'antd';
import less from './index.less';
import { on, off } from '@/utils/dom.js';

export default class ScrollTop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            right: 50
        }
    }
    _dom = null
    _positionDom = null
    _gap = 40

    componentDidMount() {
        this.scrollMount()
        this.positionMount()
    }
    componentWillUnmount() {
        this.scrollUnmount()
    }

    positionMount = () => {
        const { positionId = "#app_scrollposition" } = this.props;
        this._positionDom = document.querySelector(positionId);
        
        if(this._positionDom) {
            const { right, width } = this._positionDom.getBoundingClientRect();
            let gap = right - width - this._gap;

            if(gap > 0) {
                this.setState({
                    right: gap
                })
            } else {
                this.setState({
                    right: 50
                })
            }
        }
    }
    scrollUpdate = (el) => {
        let top = el.target.scrollTop;
        const { visible } = this.state;
        let { visibleHeight = 400 } = this.props;


        if(top >= visibleHeight) {
            if(visible !== false) return;
            this.setState({
                visible: true
            })
        } else {
            if(visible !== true) return;
            this.setState({
                visible: false
            })
        }
    }
    scrollMount = () => {
        let { scrollId = '#app_scrollbox' } = this.props;
        this._dom = document.querySelector(scrollId);

        if(this._dom) {
            on(this._dom, 'scroll', this.scrollUpdate)
        }
    }
    scrollUnmount = () => {
        if(this._dom && this.scrollUpdate) {
            off(this._dom, 'scroll', this.scrollUpdate)
        }
    }
    isDOM = (dom) => {
        if(typeof HTMLElement === 'object') {
            return dom instanceof HTMLElement;
        } else {
            return dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
        }
    }
    getDomBound = (target) => {
        let dom = this.isDOM(target) ? target : document.querySelector(target);
        return dom ? dom.getBoundingClientRect() : {top: 0};
    }
    toTop = (num = 0, callback) => {
        if(!this._dom) return;

        let top = 0;
        if(typeof num == 'object') {
            const { target , offsetY = 0 } = num;
            let bound = 0;
            if(typeof target == 'number'){ 
                bound = target 
            } else {
                bound = this.getDomBound(target).top
            }
            
            top = this._dom.scrollTop + bound + offsetY
        }
        if(typeof num == 'number') {
            top = num
        }
        
        this._dom.scrollTop = top;
        
        if(typeof callback == 'function') {
            callback()
        }
    }


    render() {
        const { children, iconType = "to-top" } = this.props;
        const { visible, right } = this.state;

        return (
            <div className={[
                    less.scrollTop, 
                    visible ? less.into : less.out
                ].join(' ')} 
                // style={{display: visible ? 'block' : 'none', right: `${right}px`}}
                style={{right: `${right}px`}}
                onClick={() => this.toTop()}>
                { children ? children : <Icon type={iconType}></Icon> }
            </div>
        )
    }
}