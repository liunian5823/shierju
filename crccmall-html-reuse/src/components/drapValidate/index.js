import less from './index.less'

//一、定义一个获取DOM元素的方法
const _$ = function (selector) {
    return document.querySelector(selector);
}

class drapValidate extends React.Component {
    _isMounted = false
    state = {
    }

    box = null; //容器
    bg = null; //背景
    text = null; //文字
    btn = null; //滑块
    success = false; //是否通过验证的标志
    distance = 0; //滑动成功的宽度（距离）

    componentWillMount() {
        this._isMounted = true;
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.drapStatus) {
            this.reset()
        }
    }
    componentDidMount() {
        let _this = this;
        _this.box = _$(".drag");
        _this.bg = _$(".bg");
        _this.text = _$(".text");
        _this.btn = _$(".btn");
        _this.success = false;
        _this.distance = _this.box.offsetWidth - _this.btn.offsetWidth; 

        //二、给滑块注册鼠标按下事件
        _this.btn.onmousedown = function (e) {
            if(_this.success) return;
            //1.鼠标按下之前必须清除掉后面设置的过渡属性
            _this.btn.style.transition = "";
            _this.bg.style.transition = "";

            //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。

            //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
            var e = e || window.event;
            var downX = e.clientX;

            //三、给文档注册鼠标移动事件
            document.onmousemove = function (e) {
                var e = e || window.event;
                //1.获取鼠标移动后的水平位置
                var moveX = e.clientX;

                //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
                var offsetX = moveX - downX;

                //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
                if (offsetX > _this.distance) {
                    offsetX = _this.distance; //如果滑过了终点，就将它停留在终点位置
                } else if (offsetX < 0) {
                    offsetX = 0; //如果滑到了起点的左侧，就将它重置为起点位置
                }

                //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
                _this.btn.style.left = offsetX + "px";
                _this.bg.style.width = offsetX + "px";

                //如果鼠标的水平移动距离 = 滑动成功的宽度
                if (offsetX == _this.distance) {

                    //1.设置滑动成功后的样式
                    _this.text.innerHTML = "验证通过";
                    _this.text.style.color = "#fff";
                    _this.btn.innerHTML = "&radic;";
                    _this.btn.style.color = "#41B750";
                    _this.bg.style.backgroundColor = "#41B750";

                    //2.设置滑动成功后的状态
                    _this.success = true;
                    //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
                    // _this.btn.onmousedown = null;
                    document.onmousemove = null;

                    //3.成功解锁后的回调函数
                    setTimeout(() => {
                        _this.props.drapResult(true)
                        // alert('解锁成功！');
                    }, 100);
                }
            }

            //四、给文档注册鼠标松开事件
            document.onmouseup = function (e) {

                //如果鼠标松开时，滑到了终点，则验证通过
                if (_this.success) {
                    return;
                } else {
                    //反之，则将滑块复位（设置了1s的属性过渡效果）
                    _this.btn.style.left = 0;
                    _this.bg.style.width = 0;
                    _this.btn.style.transition = "left 1s ease";
                    _this.bg.style.transition = "width 1s ease";
                }
                //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
                document.onmousemove = null;
                document.onmouseup = null;
            }


        }
    }
    componentWillUnmount() {
        if(this.btn) {
            this.btn.onmousedown = null;
        }
        this._isMounted = false;
    }

    reset = () => {
        this.success = false;
        this.btn.style.left = 0;
        this.bg.style.width = 0;
        
        this.btn.style.transition = "left 1s ease";
        this.bg.style.transition = "width 1s ease";

        this.text.innerHTML = "请按住滑块拖到最右边";
        this.text.style.color = "inherit";
        this.btn.innerHTML = "&gt; &gt;";
        this.btn.style.color = "inherit";
        this.bg.style.backgroundColor = "normal";
    }

    render() {
        // 处理权限
        return (
            <div className={[less.drag, 'drag'].join(' ')}>
                <div className={[less.bg, 'bg'].join(' ')}></div>
                <div className={[less.text, 'text'].join(' ')} onselectstart="return false;">请按住滑块拖到最右边</div>
                <div className={[less.btn, 'btn'].join(' ')}> &gt; &gt;</div>
            </div>
        )
    }
}

export default drapValidate