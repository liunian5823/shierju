import "./passwordLevel.css";

export default class pwdLeavel extends React.Component {

    //计算密码等级
    computedLevel = (value) => {
        let level = 0;
        if (value&&value.length < 8) {
            return level;
        }
        let reg1 = /[\d]/;
        let reg2 = /[A-Z]/;
        let reg3 = /[a-z]/;
        let reg4 = /[~!@#$%^&*?]/;
        if (reg1.test(value)) {
            level++
        }
        if (reg2.test(value)) {
            level++
        }
        if (reg3.test(value)) {
            level++
        }
        if (reg4.test(value)) {
            level++
        }
        return level;
    }

    renderLevel = (level) => {
        if (level <= 1) {
            return [
                <li className="active1"></li>,
                <li></li>,
                <li></li>
            ]
        } else if (level == 2) {
            return [
                <li className="active2"></li>,
                <li className="active2"></li>,
                <li></li>
            ]
        } else {
            return [
                <li className="active3"></li>,
                <li className="active3"></li>,
                <li className="active3"></li>
            ]
        }
    }
    renderTip = (level) => {
        if (level <= 1) {
            return <span className="active1">强度：低</span>
        } else if (level == 2) {
            return <span className="active2">强度：中</span>
        } else {
            return <span className="active3">强度：高</span>
        }
    }

    render() {
        let level = this.computedLevel(this.props.value)
        return (
            <div className="level">
                <ul className="level_area">
                    {this.renderLevel(level)}
                </ul>
                <div className="level_tip">
                    {this.renderTip(level)}
                </div>
            </div>
        )
    }
}