import { Select, message, Modal, Icon,Radio } from 'antd';
const Option = Select.Option;

const _icons = {
    save: {
        type: 'question-circle',
        style: {
            color: '#fa0',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
        }
    },
    del: {
        type: 'cross-circle',
        style: {
            color: '#F5222D',
            fontWeight: 'normal',
            fontSize: '18px',
            paddingRight: '15px',
        }
    },
}

export default {
    alert(msg, options = {}) {
        msg = msg ? msg : '系统错误!请重试,或联系管理员.';
        const type = options.type || 'info';
        const duration = options.duration || 1.5;
        message.config({
            top: 300,
        })
        message[type](msg, duration)
        if (options.callback) {
            setTimeout(() => {
                options.callback();
            }, (duration * 1000));
        }
    },
    confirm(title, props) {
        let type = _icons.save;

        if (props && props.iconType && _icons[props.iconType]) {
            type = _icons[props.iconType];
        }

        Modal.confirm({
            title: title,
            content: (
                <div>
                    <h3 className="mt20 mb20" style={{ wordBreak: 'break-all' }}><Icon type={type.type} style={type.style} />{props.tip}</h3>
                    <div>{props.content}</div>
                </div>
            ),
            onOk: props.onOk,
            onCancel: props.onCancel,
            width: props.width,
            footer: props.footer,
            iconType: 'x'
        })
    },
    getOptionList(data, key = 'id', value = 'value') {
        if (!data) {
            return []
        }
        let option = [];

        data.map((item) => {
            option.push(<Option value={`${item[key]}`} key={item[key]}>{item[value]}</Option>)
        });
        return option;
    },
    getRadioList(data, key = 'id', value = 'value') {
        if (!data) {
            return []
        }
        let option = [];

        data.map((item) => {
            option.push(<Radio value={`${item[key]}`} key={item[key]}>{item[value]}</Radio>)
        });
        return option;
    },
    //删除一个对象里面的空属性（深度）
    deleteEmptyKey(obj) {
        obj = JSON.parse(JSON.stringify(obj))
        for (let key in obj) {
            if (obj[key] !== null && typeof obj[key] == 'object') {
                this.deleteEmptyKey(obj[key])
            } else {
                if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
                    delete obj[key]
                }
            }
        }
        return obj
    },
    pageination(res, current, callback, pageSizeChange) {
        let page = {
            onChange: (current) => {
                callback(current)
            },
            current: current,
            list: res.data.list,
            total: res.data.total,
            showTotal: () => {
                return `共有${res.data.total}条记录`
            },
            showQuickJumper: true,
            defaultPageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100', '1000'],
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                pageSizeChange(current, pageSize)
            },
        }
        return page;
    },
    buildTree: (a, idStr, pidStr, chindrenStr) => {
        //将扁平化结构转化未树型结构
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                let filterArr = [];
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    },
    formatterTime(value, type = 'datetime') {
        if (!value) {
            return '-';
        }
        let time = new Date(value);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let date = time.getDate();
        if (date < 10) {
            date = '0' + date;
        }
        let hours = time.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }
        let min = time.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        let sec = time.getSeconds();
        if (sec < 10) {
            sec = '0' + sec;
        }
        if (type == 'datetime') {
            return year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec;
        } else if (type = 'date') {
            return year + '-' + month + '-' + date;
        } else {
            return 'you send error type'
        }
    },
    filtterColumns: (columns, arr = []) => {
        if (arr.length == 0) {
            return columns;
        }
        let list = [];
        columns.map(item => {
            if (arr.includes(item.key) || item.key == "options") {
                list.push(item);
            }
        })
        return list;
    },
    toLogin: (isBackHome = false) => {
        window.location.href = SystemConfig.configs.loginUrl;
    },
    randomString: (len) => {
        let dateTime = new Date().getTime();
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        pwd = pwd.substring(0, 51) + dateTime
        return pwd;
    },
    formatterData: (type, value) => {
        if (!value) {
            return null
        }
        switch (type) {
            case 'phone':
                return value.substring(0, 3) + '****' + value.substring(7, 11)
                break;
            case 'email':
                let eValue = value.split("@");
                return eValue[0].substring(0, 2) + '****' + eValue[0].substring(eValue[0].length - 2) + '@' + eValue[1]
                break;
            case 'cardId':
                //证件
                return value.substring(0, 6) + '****' + value.substring(value.length - 4)
                break;

            default:
                break;
        }
    },
    getLinkageOptionList(data, key = 'id', value = 'name', isleaf = "no") {
        if (!data) {
            return []
        }
        let options = [];
        let isLeaf = false;
        if (isleaf == "yes") {
            isLeaf = true;
        }
        data.map((item, index) => {
            options.push(
                {
                    value: item[key],
                    label: item[value],
                    level: item["level"],
                    isLeaf
                }
            )
        });
        return options;
    },
    print(dom) {
        let printView = document.createElement('div');  //获取待打印元素
        printView.innerHTML = dom.innerHTML;
        let hideDom = printView.querySelectorAll("*[data-print-hide]");//隐藏不需要打印的元素
        for (let i = 0; i < hideDom.length; i++) {
            hideDom[i].style.display = 'none'
        }
        document.querySelector('#app').className = 'print-hide'  //将根元素隐藏
        document.body.appendChild(printView) //将待打印元素追加到body中
        window.print() //调用浏览器的打印预览
        document.body.removeChild(printView) //将待打印元素从body中移除
        document.querySelector('#app').className = '' //将原始页面恢复
    },

    //处理大区展示数据
    handleAreaToName (str) {
        if(str == null || str == '' || str == undefined || str == 'null')
            return '-';
        str = str.replace(/[\\s]*[,][\\s]*[,]{1,}([\\s]+|[,]+)*/g, ',')
        if (str.substr(-1).indexOf(',') > -1)
            str = str.substr(0, str.length - 1)
        if (str.split(',').length == 8)
            return '全国';
        str = str.replace("DB", "东北地区")
            .replace("FDL", "非大陆地区")
            .replace("HB", "华北地区")
            .replace("HD", "华东地区")
            .replace("HZ", "华中地区")
            .replace("XB", "西南地区")
            .replace("XN", "西北地区")
            .replace("HN", "华南地区");
        return str;
    },
    /*
    计算税额，四舍五入保留两位小数展示
    totalAmt：总金额
    taxRate: 税率，例如3，13...
   */
    computeTax(totalAmt, taxRate){
        if (totalAmt != null && taxRate != null)
            return (totalAmt*(taxRate/100)).toFixed(2);
    },


    /*
        处理数值四舍五入
        num：要处理的数字
        fixed：要保留的小数位数
     */
    handleToRoundingOff(num, fixed){
        if (!num || !fixed)
            return null;
        return num.toFixed(fixed)
    },

    computeUnitPrice(totalPrice,totalNum){
        if (totalPrice != null && totalNum != null)
            return (totalPrice/totalNum).toFixed(2);
    },


    toFixed(num, d) {
    if (!num) { return '0.00' }
    var s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 0) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return num + "";
}
}
