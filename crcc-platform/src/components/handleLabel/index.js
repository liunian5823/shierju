import "./index.css";
/*
* 字符串长度不可控，取此项目中label字数最长 * 14px 此项目最长为 8
* */

let handleStr = label => {
    return label.split('');
}

let getDetailsLabel = label => {
    let strArr = handleStr(label);
    return(
        <span className="label_itme">
            {
                strArr.map((item,index) => {
                    return(
                        <div>{item}</div>
                    )
                })
            }
        </span>
    )
}

// 处理字符串str是否为空
let checkStr = str => {
    if(str === null || str === "" || str === "null" || str === undefined || str === "undefined") {
        return "-";
    }else {
        return str;
    }
}
export { getDetailsLabel, checkStr };