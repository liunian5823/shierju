
let areaData = [];
const arrStr = '';
let loadAreaArr = [];

// 计算集合拼接json
const computedData = (arr, key, parentCode) => {
    let titleK = key + 'Name';
    let keyK = key + 'Code';
    arr.map(item => {
        let codeBefore = parentCode ? parentCode + '_' : '';
        item.title = item[titleK];
        item.code = codeBefore + item[keyK];
        item.parentCode = parentCode || null;
    })
    return arr;
}

const initData = (data) => {
    data = data || [];
    let halfCheckedData = computedDataSplit(data);

    loadAreaArr = halfCheckedData;
    initDataAjax();

}
//拆分节点
computedDataSplit = (arr) => {
    let haflArr = []
    arr.map(item => {
        let strArr = item.split('_');
        if (strArr.length > 1) {
            let code = '';
            for (let i = 0; i < (strArr.length - 1); i++) {
                if (i == 0) {
                    code = strArr[i];
                } else {
                    code += '_' + strArr[i];
                }
                haflArr.push(code)
            }
        }
    })
    haflArr = Array.from(new Set([...haflArr]));
    //根据不全的去加载数据
    haflArr.map(item => {
        let strLength = item.split('_').length;
    })
    return haflArr
}

const initDataAjax = () => {
    let list = [];
    if (loadAreaArr.length == 0) {
        return
    }
    loadAreaArr.map(item => {
        let obj = getObjFromData(item);

        if (!obj) {
            list.push(item);
        } else {
            let itemArr = item.split('_');
            let fncName = ''
            if (itemArr.length == 1) {
                fncName = 'getProvinceList'
                getProvinceList(item, 0, () => {
                    initDataAjax();
                });
            }

        }
    })
    loadAreaArr = list;
}

//从缓存数据中获得当前对象
const getObjFromData = (code) => {
    let data = areaData;
    return deepQuery(data, code)
}
//深度非递归计算节点
const deepQuery = (tree, code) => {
    var stark = [];
    stark = stark.concat(tree);
    while (stark.length) {
        var temp = stark.shift();
        if (temp.children) {
            stark = temp.children.concat(stark);
        }
        let key = 'code'
        if (code === temp[key]) {
            return temp;
        }
    }
}

const computedCode = (code) => {
    let codeStrArr = code.split('_');
    return codeStrArr[codeStrArr.length - 1]
}

// 获取省数据
const getProvinceList = (areaCode, checkStatus, callback) => {

    let obj = getObjFromData(areaCode);
    if (obj.children) {

        //this.changeTreeStatusForArr(obj.children, checkStatus);
    } else {
        let _this = this;

        axios.get("@/inquiry/area/selectProvince", {
            params: { areaCode: computedCode(areaCode) }
        }).then(r => {

            r.rows = computedData(r.rows, 'province', areaCode);
            obj.children = r.rows;

        })
    }
}

const area = {
    renderText: (areaRes) => {
        axios.get("@/inquiry/area/selectArea", {
        }).then(r => {
            r.rows = computedData(r.rows, 'area');
            areaData = r.rows
            initData(areaRes.split(','))
            let arr = areaRes.split(',');
            //["DB"],
            //["DB_100001,DB_100002"]
            let filterArr = [];
            arr.map(item => {
                let indexO = item.lastIndexOf("_");
                if (indexO > -1) {
                    let str = item.substring(0, indexO);
                    let indexJ = arr.indexOf(str);
                    if (indexJ == -1) {
                        filterArr.push(item)
                    }
                } else {
                    filterArr.push(item)
                }
            })
            filterArr = Array.from(new Set([...filterArr]));
            let strArr = "";
            filterArr.map(item => {
                let obj = getObjFromData(item)
                if (obj) {
                    // let tip = obj.children ? '(全部)' : '';
                    if (strArr.length > 0) {
                        strArr += ',' + obj.title
                    } else {
                        strArr = obj.title
                    }
                }
            })
            return strArr

        })
    }
};


module.exports = { area };
