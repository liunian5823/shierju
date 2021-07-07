// 电话号码
export const phone = { message: '请输入正确的手机号', pattern: /^0{0,1}(13[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/ }
// 数字
export const number = { message: '请输入数字', pattern: /^\d+$|^\d+[.]?\d+$/ };
// 价格
export const price = { message: '格式不正确,例: 100.45', pattern: /^\d+(\.\d{0,2})?$/ };
// 必填
export const required = (message) => { return {required: true, message} };
