import { Select, message } from 'antd';
const Option = Select.Option;
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
  pageination(res, current, callback, pageSizeChange) {
    let page = {
      onChange: (current) => {
        callback(current)
      },
      current: current,
      rows: res.data.rows,
      total: res.data.total,
      showTotal: () => {
        return `共有${res.data.total}条记录`
      },
      showQuickJumper: true,
      defaultPageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100', '1000'],
      showSizeChanger: true,
      onShowSizeChange: (current, rows) => {
        pageSizeChange(current, rows)
      },
    }
    return page;
  },
  pageination1(res, current, callback, pageSizeChange) {
    let page = {
      onChange: (current) => {
        callback(current)
      },
      current: current,
      rows: res.data.rows,
      total: res.data.total,
      showTotal: () => {
        return `共有${res.data.total}条记录`
      },
      showQuickJumper: true,
      defaultPageSize: 10,
      pageSizeOptions: ['10', '20'],
      showSizeChanger: true,
      onShowSizeChange: (current, rows) => {
        pageSizeChange(current, rows)
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
        hashVP[children] = Array.from(new Set([...hashVP[children], aVal]))
      } else {
        r = Array.from(new Set([...r, aVal]))
      }
    }
    return r;
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
      case 'idcard':
        return value.substring(0, 3) + '****' + value.substring(12)
        break;
      case 'phone':
        return value.substring(0, 3) + '****' + value.substring(7, 11)
        break;
      case 'email':
        let eValue = value.split("@");
        return eValue[0].substring(0, 2) + '****' + eValue[0].substring(eValue[0].length - 2) + '@' + eValue[1]
        break;

      default:
        break;
    }
  },
  toLogin: () => {
    window.location.href = "index.html#login";
  },
  getLinkageOptionList(data, key = 'id', value = 'name',isleaf = "no") {
    if (!data) {
      return []
    }
    let options = [];
    let isLeaf  = false;
    if(isleaf=="yes"){
      isLeaf = true;
    }
    data.map((item,index) => {
      options.push(
          {
			key: index,
            value: item[key],
            label: item[value],
            level:item["level"],
            isLeaf
          }
      )
    });
    return options;
  },
  formatterTime: (value, type = 'datetime') => {
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
    } else if (type == 'start') {
      return year + '-' + month + '-' + date + ' ' + '00' + ':' + '00' + ':' + '00';
    } else if (type == 'end') {
      return year + '-' + month + '-' + date + ' ' + '23' + ':' + '59' + ':' + '59';
    }  else {
      return 'you send error type'
    }
  },
  print(dom) {
    let printView = document.createElement('div');  //获取待打印元素
    printView.innerHTML = dom.innerHTML;
    document.querySelector('#app').className = 'print-hide'  //将根元素隐藏
    document.body.appendChild(printView) //将待打印元素追加到body中
    window.print() //调用浏览器的打印预览
    document.body.removeChild(printView) //将待打印元素从body中移除
    document.querySelector('#app').className = '' //将原始页面恢复
  },
  //时间差计算
  timerCountDown (dateF, dateS = new Date()) {
    if (!dateF) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    }
    let date1 = new Date(dateF);
    let date2 = new Date(dateS);
    let dateS1 = date1.getTime();
    let dateS2 = date2.getTime();
    let dateMinus = dateS1 - dateS2;
    if (dateMinus <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    }
    let days = Math.floor(dateMinus / (24 * 60 * 60 * 1000));
    days = days < 10 ? '0' + days : days;
    let dayRemainder = dateMinus % (24 * 60 * 60 * 1000);
    let hours = Math.floor(dayRemainder / (60 * 60 * 1000));
    hours = hours < 10 ? '0' + hours : hours;
    let hourRemainder = dayRemainder % (60 * 60 * 1000);
    let minutes = Math.floor(hourRemainder / (60 * 1000));
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let minutesRemainder = hourRemainder % (60 * 1000);
    let seconds = Math.floor(minutesRemainder / 1000);
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return {
      days,
      hours,
      minutes,
      seconds
    }

  },
  setCookie(key, value) {
    let exp = new Date();
    exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000);
    document.cookie = key + "=" + escape(value) + ";expires=" + 
                      exp.toGMTString() + ";path=/;Domain=" + 
                      this.handleDomain(window.location.hostname);
  },
  handleDomain(hostNameStr) {
    return /[A-Za-z]/.test(hostNameStr) ? 
    hostNameStr.replace(hostNameStr.match(/^[^.]*/)[0] + '.', '')
    : hostNameStr
  },
  getCookie: (name) => {
    let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  		if(arr=document.cookie.match(reg)) {return unescape(arr[2]);}
  		else {return null;}
  },
  handleArray: (arrs, key) => {
    let str = ''
	if(arrs && arrs.length > 0){
		arrs.forEach(i => {
		  str =  str+ ',' +i[key]
		})
		return str.slice(1);
	}
	return str;
  }
}
