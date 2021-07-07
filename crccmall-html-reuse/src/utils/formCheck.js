
//座
const telePhone = (rule, value, callback) => {
    const reg = RegExp("^((0\d{2,3})-)(\d{6,8})(-(\d{1,}))?$");
    if (value) {
        if (reg.test(value)) {
            callback()
        } else {
            callback(new Error('请输入正确的电话'))
        }
    } else {
        callback()
    }
}
//手机
const mobilePhone = (rule, value, callback) => {
    const reg = RegExp("^0{0,1}(13[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$");
    if (value) {
        if (reg.test(value)) {
            callback()
        } else {
            callback(new Error('请输入正确的手机号'))
        }
    } else {
        callback()
    }
}
//座机和手机
const teleAndMobile = (rule, value, callback) => {
    const reg1 = /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/;
    // const reg2 = /^0{0,1}(13[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/;
    const reg2 = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
    // const reg2 = /^1[0-9]{10}$/;
    if (value) {
        if (reg1.test(value) || reg2.test(value)) {
            callback()
        } else {
            callback(new Error('请输入正确的电话或手机号'))
        }
    } else {
        callback()
    }
}

export {
    telePhone,
    mobilePhone,
    teleAndMobile,
}
