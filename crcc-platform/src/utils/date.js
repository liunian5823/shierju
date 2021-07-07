
//时间剩余多少s/m/h/D
const formatTimeDiff = (end, start, T = 'D') => {
    let x = 0;
    let s = start ? new Date(start) : new Date();
    let e = end ? new Date(end) : new Date();
    
    x = e.getTime() - s.getTime();
    
    if(x < 0) x = 0;
        x = x / 1000;
    if(T === 's') return Math.ceil(x);
        x = x / 60;
    if(T === 'm') return Math.ceil(x);
        x = x / 60;
    if(T === 'h') return Math.ceil(x);
        x = x / 24;
    if(T === 'D') return Math.ceil(x);

    return Math.ceil(x)
}

//天-时-分-秒
const formatTimeCountDown = (t) => {
    let text = 0, D = 0, d = 0, h = 0, m = 0, s = 0;

    let time = new Date(t).getTime();
    if(Math.floor(time / 86400000) > 0) {
        d = Math.floor(time / 86400000)
        time = time - d * 86400000
    }
    if(time < 86400000) {
        h = Math.floor(time / 3600000)
        h = h > 9 ? h : '0' + h
        time = time - h * 3600000
    }
    if(time < 3600000) {
        m = Math.floor(time / 60000)
        m = m > 9 ? m : '0' + m
        time = time - m * 60000
    }
    if(time < 60000) {
        s = Math.floor(time / 1000)
        s = s > 9 ? s : '0' + s
    }
    D = d;
    d = d > 0 ? d + '天 ' : '';
    text = d + h + ':' + m + ':' + s;
    return { text, D, d, h, m, s}
}

export default {
    formatTimeDiff,
    formatTimeCountDown
}